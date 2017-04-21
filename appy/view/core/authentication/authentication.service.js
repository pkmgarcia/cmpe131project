angular.module('core.authentication')
.service('Auth', [
  '$http',
  '$window',
  '$timeout',
  '$q',
  function Auth($http, $window, $timeout, $q) {

    var self = this;
    var age = 10;
    var data = { 
      lastUpdated: [], 
    };

    this.saveToken = function (token){
      $window.localStorage['token'] = token;
    };

    this.getToken = function () {
      return $window.localStorage['token'];
    };

    this.getId = function () {
      return $window.localStorage['_id'];
    };
      
    this.getFirstName = function () {
      return $window.localStorage['firstName'];
    };

    this.getLastName = function () {
      return $window.localStorage['lastName'];
    };

    this.getFiles = function() {
      var userId = this.getId();
      headers: {
        authorization: $window.localStorage['token']
      }
      return $http.get('/user/' + userId + '/file');
    }

    this.setAge = function(age) {
      age = age;
    }

    this.getAge = function() {
      return age;
    }

    this.getData = function() {
      return data;
    }

    this.updateTimer = function() {
      this.getFiles().then(function successCallback(result) {
          if(data.lastUpdated === null) {
            console.log("data.lastUpdated is null");
          }
          data.lastUpdated = [];
          for (i = 0; i < result.data.docs.length; i++) {
            data.lastUpdated.push(result.data.docs[i]);
          }
          console.log(data.lastUpdated)
        }, function errorCallback(result) {
          console.log("Error in Auth.updateTimer.");
          console.log(result);
          data.lastUpdated = [];
        })
    };

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
          if(response.data['refreshToken']){
            $window.localStorage['token'] = response.data['refreshToken'];
            $window.localStorage['_id'] = response.data.user['_id'];
            $window.localStorage['firstName'] = response.data.user['firstName'];
            $window.localStorage['lastName'] = response.data.user['lastName'];
            var data = [];
            for (i = 0; i < response.data.user.files.length; i++) {
              data[i] = response.data.user.files[i];
            }
            $window.localStorage.setItem('files', JSON.stringify(data));
            $http.defaults.headers.common.Authorization = response.data['refreshToken'];
          }
          return response;
        }, function errorCallback(response) {
          return response;
        });
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
      $window.localStorage.removeItem('_id');
      $http.defaults.headers.common.Authorization = null;
      return $http(config)
        .then(function successCallback(response) {
          return response;
        }, function errorCallback(response) {
          return response;
        }
      );
    };

    this.createFile = function(file) {

      return $q(function(resolve, reject) {
        setTimeout(function() {
          // Create data for requests
          var userId = self.getId();
          var params = {
            name: file.name,
            type: file.type
          }
          
          // Create the file
          $http.post('/file', params)
            // On success, change the path of the file to the download url
            .then(function successCallback(result) {
              var fileId = result.data._id;
              var params = [fileId];
              
              var data = {
                path: "http://sjsu.cmpe131.phub.s3.amazonaws.com/" + fileId
              };

              var config = {
                headers: {
                  authorization: self.getToken()
                }
              };

              $http.put('/file/' + fileId, data)
                // On success, add file to user
                .then(function successCallback(result) {
                  $http.post('/user/' + userId + '/file', params)
                    // On success
                    .then(function successCallback(result) {
                      console.log("Successfully created file.");
                      resolve(fileId);
                    }, function errorCallback(result) {
                      console.log("Error in Auth.createFile(file): $http.post('/user/' + userId + '/file/' + fileId)");         
                      reject("Error in Auth.createFile(file): $http.post('/user/' + userId + '/file/' + fileId)");
                    });
                }, function errorCallback(result) {
                  console.log("Error in Auth.createFile(file): $http.put('/file/' + fileId)");
                  reject("Error in Auth.createFile(file): $http.put('/file/' + fileId)");
                });
            // On failure
            }, function errorCallback(result) {
              console.log("Error in Auth.createFile(file): $http.post('/file/', params)");
              reject("Error in Auth.createFile(file): $http.post('/file/', params)");
            });
        }, 1000);
      });
    };

    // config is an array of strings to sort by
    this.getSortedFiles = function(userId, config) {
      var query = config.join('%24sort=');
      return $http.post('/user/' + userId + '/file?%24sort=' + query);
    };
 }
]);
