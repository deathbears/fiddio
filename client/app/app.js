angular.module('fiddio', ['ui.ace', 'ui.router', 'ngFileUpload'])

  .run(['$rootScope', '$state', '$stateParams', 'Authentication', 'UserData',
      function ($rootScope, $state, $stateParams, Authentication, UserData) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //UserData.loadData();
        $rootScope.$on('$stateChangeStart',function(event, toState, toStateParams, fromState, fromStateParams) {
          $rootScope.toState = toState;
          $rootScope.toStateParams = toStateParams;
          //console.log('$stateChangeStart, event, toState, toStateParams, fromState, fromParams', event, toState, toParams, fromState, fromParams);
        });
      }]
  )

  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('site', {
        abstract: true,
        template: '<div ui-view />',
        resolve: {
          identity: ['Authentication', function(Authentication) {
            return Authentication.checkAuth();
          }]
        },
      })
      .state('site.authRequired', {
        abstract: true,
        parent: 'site',
        template: '<div ui-view />',
        resolve: {
          authenticate: ['Authentication', 'identity', function(Authentication, identity) {
            return Authentication.resolveAuth(identity);
          }]
        },
      })
      .state('site.authRequired.auth', {
        url: '/auth',
        parent: 'site.authRequired',
        template: '<div ui-view />'
      })
      .state('site.login', {
        url: '/login',
        parent: 'site',
        templateUrl: '../templates/login.html'
      })
      .state('site.home', {
        url: '/home',
        parent: 'site',
        templateUrl: '../templates/home.html'
      })
      .state('site.browse-questions', {
        url: '/questions',
        parent: 'site',
        templateUrl: '../templates/browseQuestions.html',
        resolve: {
          questions: ['QuestionsData', function(QuestionsData) {
            return QuestionsData.downloadQuestionsData();
          }]
        },
        controller: 'BrowseQuestions as browse'
      })
      .state('site.authRequired.ask', {
        url: '/ask',
        parent: 'site.authRequired',
        templateUrl: '../templates/askQuestion.html',
        controller: 'AskQuestion as ask',
      })
      .state('site.authRequired.answer', {
        url: '/question/:questionID/answer',
        parent: 'site.authRequired',
        templateUrl: '../templates/answerQuestion.html',
        resolve: {
          func: function() { console.log("Inside of answer resolve"); }
        },
        controller: 'AnswerController as answer'
      })
      .state('site.question', {
        url: '/question/:questionID',
        parent: 'site',
        templateUrl: '../templates/questionView.html',
        resolve: {
          question: ['QuestionsData','$stateParams', 'DataPackager', function(QuestionsData, $stateParams, DataPackager) {
            return QuestionsData.downloadFullQuestion($stateParams.questionID);
          }]
        },
        controller: 'QuestionController as qv'
      });

  });

// a RESTful factory for retrieving contacts from a .json file
  // .factory('questions', ['$http', function($http) {
  //   var path = 'questions.json';
  //   var questions = $http.get(path).then(function(response) {
  //     return response.data.questions;
  //   });
  //   var factory = {};

  //   factory.all = function() {
  //    return questions;
  //   };

  //   factory.findById = function(id) {
  //     return this.all().then(function(data) {
  //       for (var i = 0; i < data.length; i++) {
  //         if (data[i].id === id) {
  //           return data[i];
  //         }
  //       }
  //     });
  //   };

  //   return factory;
  // }]);
