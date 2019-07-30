(function(window, undefined) {'use strict';


angular.module('DevopsDashboard.widget.proposalcreator', ['adf.provider', 'summernote'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('proposalcreator', {
        title: 'Proposal Creator',
        description: 'Quickly build new proposals from historic proposal data',
        authorizedGroups: ['myorg_all'],
        templateUrl: 'app/widgets/proposalcreator/src/view.html',
        edit: {
          templateUrl: 'app/widgets/proposalcreator/src/edit.html'
        },
        controller: 'proposalCtrl'
      });
  }])
  .controller('proposalCtrl', ["$scope", function($scope) {

    var socket = io('/proposals');

    socket.on('error', function(err) {
      console.error('Error:', err);
    });

    socket.on('results', function(results) {
      console.log('results', results);
      $scope.sections = results;
    });

    $scope.searchString = "";

    $scope.search = function() {
      var q = $scope.searchString;
      if (q.length > 0) {
        socket.emit('search', $scope.searchString);
      }
    };

    $scope.addSection = function(sectionIndex) {
      $scope.text += '<h2>' + $scope.sections[sectionIndex].title + '</h2><br/>';
      $scope.text += $scope.sections[sectionIndex].body;
    };

    $scope.sections = [];

    $scope.text = "";
    //$scope.search = "";

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

    $scope.init = function() { console.log('Summernote is launched'); }
    $scope.enter = function() { console.log('Enter/Return key pressed'); }
    $scope.focus = function(e) { console.log('Editable area is focused'); }
    $scope.blur = function(e) { console.log('Editable area loses focus'); }
    $scope.paste = function(e) { console.log('Called event paste'); }
    $scope.change = function(contents) {
      console.log('contents are changed:', contents, $scope.editable);
    };
    $scope.keyup = function(e) { console.log('Key is released:', e.keyCode); }
    $scope.keydown = function(e) { console.log('Key is pressed:', e.keyCode); }
    $scope.imageUpload = function(files) {
      console.log('image upload:', files);
      console.log('image upload\'s editable:', $scope.editable);
    }

  }]);

angular.module("DevopsDashboard.widget.proposalcreator").run(["$templateCache", function($templateCache) {$templateCache.put("app/widgets/proposalcreator/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("app/widgets/proposalcreator/src/view.html","<h3>Working Proposal</h3><summernote config=options ng-model=text></summernote><hr><h3>Proposal Search</h3><input type=text class=form-control ng-model=searchString placeholder=\'Search: e.g. \"\" or \"\"\' ng-change=search()><ul ng-repeat=\"section in sections\"><li><div>{{ section.title }}</div><div>{{ section.body }}</div><div>{{ section.user }}</div><div>{{ section.date }}</div><div>{{ section.meta.rating }}</div><div>{{ section.meta.used }}</div><ul ng-repeat=\"comment in section.meta.comments\"><li>{{ comment }}</li></ul><ul ng-repeat=\"tag in section.meta.tags\"><li>{{ tag }}</li></ul></li><button ng-click=addSection($index)>Add Section</button></ul>");}]);})(window);
