(function(window, undefined) {'use strict';


angular.module('DevopsDashboard.widget.bizops-proposals', ['adf.provider', 'summernote', 'ui.select'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('bizops-proposals', {
        title: 'Proposal Tool',
        description: 'Search and aggregate historic proposal data to be used in a new proposal',
        authorizedGroups: ['myorg_all'],
        templateUrl: 'app/widgets/bizops-proposals/src/view.html',
        edit: {
          templateUrl: 'app/widgets/bizops-proposals/src/edit.html'
        },
        controller: 'bizopsProposalCtrl'
      });
  }])
  /** @ngInject */
  .directive('bizopsProposalUpload', ["bizopsProposalUploadFactory", function (bizopsProposalUploadFactory) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            element.bind('change', function () {
                var formData = new FormData();
                formData.append('file', element[0].files[0]);
                // TODO: Get user and send with post data
                formData.append('username', 'changeme');
                console.log('element[0].files[0]:', element[0].files[0]);
                console.log('formData:', formData);
                bizopsProposalUploadFactory('https://bizproposal.devops.secure.myorg.com/uploader', formData, function (callback) {
                  console.log(callback);
                });
            });

        }
    };
  }])

  /* */
  /** @ngInject */
  .factory('bizopsProposalUploadFactory', ["$http", function ($http) {
    return function (url, data, callback) {
      $http({
        url: url,
        method: "POST",
        data: data,
        headers: {'Content-Type': undefined}
      }).success(function (response) {
        callback(response);
      });
    };
  }])

  /* Popup spinner when waiting for query results */
  /** @ngInject */
  .factory('loadingModal', loadingModal)

  /* Highlight text found in query results */
  /** @ngInject */
  .filter('highlight', ["$sce", function highlightFilter($sce) {
    return function(text, scope) {
      return $sce.trustAsHtml(text.replace(new RegExp(scope.searchString, 'gi'), '<span class="highlightedText">$&</span>'));    
    };
  }])

  /** @ngInject */
  .controller('bizopsProposalCtrl', ["$scope", "$timeout", "config", "loadingModal", function($scope, $timeout, config, loadingModal) {
    var socket = io('/proposals');
    var proposalSaveQueued = false;
    var previousSelectedTitle = '';

    config.uploadurl = 'https://bizproposal.devops.secure.myorg.com/uploader';

    socket.on('error', function(err) {
      console.error('Error:', err);
    });

    socket.on('sections', function(sections) {
      $timeout(function() {
        $scope.sections = sections;
      });
    });

    socket.on('saved', function() {
      $timeout(function() {
        $scope.savedMsg = 'Saved at ' + Date().toLocaleString();
      });
    });

    $scope.sections = [];
    $scope.proposalBody = "";
    $scope.savedMsg = "";
    $scope.searchString = "";
    $scope.proposalTitles = [];
    $scope.proposalTitle = {};

    $scope.search = function() {
      var q = $scope.searchString;
      var limit = config.limit || 20;

      if (q.length > 1) {
        socket.emit('search', {string: $scope.searchString, limit: limit});
      } else {
        $timeout(function() {
          $scope.sections = [];
        });
      }
    };

    $scope.addSection = function(sectionIndex) {
      $scope.proposalBody += '<h2>' + $scope.sections[sectionIndex].title + '</h2>';
      $scope.proposalBody += $scope.sections[sectionIndex].body + '<br/><br/>';
    };

    $scope.options = {
      height: 300,
      focus: true,
      airMode: false,
      toolbar: [
            ['edit',['undo','redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link','picture','video','hr']],
            ['view', ['fullscreen', 'codeview']],
            ['help', ['help']]
        ]
    };

    /* summernote events */
    $scope.init = function() { console.log('Summernote is launched'); }
    $scope.enter = function() { console.log('Enter/Return key pressed'); }
    $scope.focus = function(e) { console.log('Editable area is focused'); }
    $scope.blur = function(e) { console.log('Editable area loses focus'); }
    $scope.paste = function(e) { console.log('Called event paste'); }
    $scope.change = function(contents) {
      console.log('contents are changed:', contents, $scope.editable);
      saveProposal();
    };
    $scope.keyup = function(e) { console.log('Key is released:', e.keyCode); }
    $scope.keydown = function(e) { console.log('Key is pressed:', e.keyCode); }
    $scope.imageUpload = function(files) {
      console.log('image upload:', files);
      console.log('image upload\'s editable:', $scope.editable);
    }

    var saveProposal = function() {
      if (!($scope.proposalTitle.selected)) {
        console.error('Proposal Title required');
        $timeout(function() {
          saveProposal();
        }, 5000);
        return;
      }

      if (proposalSaveQueued === false) {
        proposalSaveQueued = true;
        $timeout(function() {
          socket.emit('save', { title: $scope.proposalTitle.selected, body: $scope.proposalBody });
          proposalSaveQueued = false;
        }, 5000);
      }
    }

    /* Get the contents of a saved proposal */
    var getProposal = function(title) {
      loadingModal.open();
      socket.emit('getproposal', title, function(proposal) {
        $scope.proposalBody = proposal.body;
        loadingModal.close();
      });
    };

    /* Retrieve a list of proposal titles from the database */
    $scope.getProposalTitles = function(search) {
      var newTitles = $scope.proposalTitles.slice();
      if (search && newTitles.indexOf(search) === -1) {
        newTitles.unshift(search);
      }
      return newTitles;
    };

    $scope.titleSelected = function(title) {
      if (previousSelectedTitle != title) {
        getProposal(title);
      }
    };

    /* Get a list of existing Proposal titles */
    socket.emit('gettitles', function(titles) {
      angular.copy(titles, $scope.proposalTitles);
    });
  }]);

/** @ngInject */
function loadingModal($uibModal) {
  var methods = {};
  var opened = false;

  return {
    open: function() {
      if (!opened) {
        methods = $uibModal.open({
          animation: true,
          templateUrl: 'app/widgets/proposalcreator/src/loadingModal.html',
          keyboard: false,
          backdrop: 'static'
        });
        opened = true;
      } else {
        throw Error('loading modal opened now');
      }
    }, 
    close: function() {
      if (opened) {
        methods.close();
        opened = false;
      } else {
        throw Error('loading modal is not active');
      }
    }
  }
}
loadingModal.$inject = ["$uibModal"];;


angular.module("DevopsDashboard.widget.bizops-proposals").run(["$templateCache", function($templateCache) {$templateCache.put("app/widgets/bizops-proposals/src/edit.html","<form role=form><div class=form-group><label for=limit>Proposal upload URL</label> <input type=text class=form-control id=uploadurl ng-model=config.uploadurl></div></form>");
$templateCache.put("app/widgets/bizops-proposals/src/view.html","<script src=bower_components/bootstrap/dist/js/bootstrap.min.js></script><div class=ng-cloak><h3>Working Proposal</h3><div class=form-group><ui-select ng-model=proposalTitle.selected on-select=titleSelected($item) class=\"btn-group bootstrap-select form-control\" ng-disabled=false append-to-body=true><ui-select-match placeholder=\"Select or search for a Proposal title ...\">{{$select.selected}}</ui-select-match><ui-select-choices repeat=\"title in getProposalTitles($select.search) | filter: $select.search\"><div ng-bind=title></div></ui-select-choices></ui-select><summernote config=options ng-model=proposalBody on-init=init() on-enter=enter() on-focus=focus(evt) on-blur=blur(evt) on-paste=paste() on-keyup=keyup(evt) on-keydown=keydown(evt) on-change=change(contents) on-image-upload=imageUpload(files)></summernote><span class=pull-right>{{ savedMsg }}</span></div><hr><div class=form-group><h3>Proposal Search</h3><input type=text class=form-control ng-model=searchString placeholder=\'Search: e.g. \"hunt service\" or \"training\"\' ng-change=search()><br><div ng-repeat=\"section in sections\" class=row style=\"border: 1px dotted; padding-top: 5px;\"><div class=col-sm-12><h4>{{ section.title }}</h4><p ng-bind-html=\"section.body | highlight:this\"></p><br><ul id=comments><li></li></ul><a class=learn-more ng-click=addSection($index) style=\"cursor: pointer;\">Add to Proposal</a><div id=rating class=pull-right><span>{{ section.date }}</span></div></div></div></div><hr><div class=form-group><h3>Proposal Upload</h3><input bizops-proposal-upload type=file name=file></div></div><style>\n.highlightedText {\n    background: yellow;\n}\n</style>");}]);})(window);
