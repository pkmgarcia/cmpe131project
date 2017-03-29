angular.module('core.authentication')
.service('Auth', [
  '$http',
  '$window',
  function Auth($http, $window) {
    var saveToken = function (token){
      $window.localStorage['token'] = token;
    };

    var getToken = function () {
      return {
        'token' : $window.localStorage['token'],
      }
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
            $window.localStorage['token'] = response.data['refreshToken'];
            return response;
          }, function errorCallback(response) {
            return response;
          }
        );
    };

    logout = function() {
      $window.localStorage.removeItem('token');
    };

    return {
      saveToken : saveToken,
      getToken : getToken,
      register : register,
      login : login,
      logout : logout
    };
  }
]);
