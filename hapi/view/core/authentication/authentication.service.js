angular.module('core.authentication')
.service('Auth', [
  '$http',
  '$window',
  function Auth($http, $window) {
    var updateToken = function (token) {
      $window.localStorage['token'] = token;
    }

    var saveSession = function (session){
      $window.localStorage['token'] = session['token'];
      $window.localStorage['_id'] = session['_id'];
    };

    var getSession = function () {
      return {
        'token' : $window.localStorage['token'],
        '_id' : $window.localStorage['_id']
      }
    };

    var isLoggedIn = function() {
      var session = getSession();
      $http.post('/tokenLogin', session)
        .then(function successCallback(response) {
          updateToken(response.headers['x-refresh-token']);
        }, function errorCallback(error) {
          console.log(error);
        });
    };
/*
    var currentUser = function() {
      if(isLoggedIn()){
        var session = getSession();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };
*/
    register = function(user) {
      return $http.post('/register', user)
        .then(function successCallback(response) {
            return response;
          }, function errorCallback(response) {
            return response;
          }
        );
    };

    login = function(user) {
      return $http.post('/login', user)
        .then(function successCallback(response) {
          var session = {
            'token' : response.data.refreshToken,
            '_id' : response.data.user._id
          }
          saveSession(session);
          }, function errorCallback(response) {
            return response;
          }
        );
    };

    logout = function() {
      $window.localStorage.removeItem('app-token');
      $window.localStorage.removeItem('_id');
    };

    return {
      saveSession : saveSession,
      getSession : getSession,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }
]);
