angular.module('core.authentication')
.service('Auth', [
  '$http',
  '$window',
  function Auth($http, $window) {
    this.saveToken = function (token){
      $window.localStorage['token'] = token;
    };

    this.getToken = function () {
      return {
        token: $window.localStorage['token'],
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
    this.register = function(user) {
      return $http.post('/register', user)
        .then(function successCallback(response) {
            return response;
          }, function errorCallback(response) {
            return response;
          }
        );
    };

    this.login = function(user) {
      return $http.post('/login', user)
        .then(function successCallback(response) {
            $window.localStorage['token'] = response.data['refreshToken'];
            return response;
          }, function errorCallback(response) {
            return response;
          }
        );
    };

    this.logout = function() {
      var config = {
        url: '/logout',
        method: 'DELETE',
        headers: {
          authorization: $window.localStorage['token']
        }
      };

      $window.localStorage.removeItem('token');
      return $http(config)
        .then(function successCallback(response) {
          return response;
        }, function errorCallback(response) {
          return response;
        }
      );
    };
  }
]);
