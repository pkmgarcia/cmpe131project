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
      var currentFolder = {
        parent: [],
      }

      var folders = {
        folder: [],
      };



      this.saveToken = function(token) {
        $window.localStorage['token'] = token;
      };

      this.getToken = function() {
        return $window.localStorage['token'];
      };

      this.getId = function() {
        return $window.localStorage['_id'];
      };

      this.getFirstName = function() {
        return $window.localStorage['firstName'];
      };

      this.getLastName = function() {
        return $window.localStorage['lastName'];
      };

      this.getFiles = function() {
        var userId = this.getId();
        headers: {
          authorization: $window.localStorage['token']
        }
        return $http.get('/user/' + userId + '/file');
      };

      this.setAge = function(age) {
        age = age;
      };

      this.getAge = function() {
        return age;
      };

      this.getData = function() {
        return data;
      };

      this.getFolders = function(stat) {
        var userId = this.getId();
        headers: {
          authorization: $window.localStorage['token']
        }

        if (stat) {

          var param = {
            "name": "main",
          }
          return $http.get('/user/' + userId + '/folder', param)
        } else {

          return $http.get('/user/' + userId + '/folder')
        }

      }

      this.getCurrentFolder = function() {
        return currentFolder;
      };

      this.setCurrentFolder = function(folder) {
        var newCurrent = {
          name: folder.name,
          id: folder.id
        };

        currentFolder.parent = newCurrent;
      }

      this.checkRoot = function() {

        this.getFolders(false).then(function successCallback(result) {

          if (result.data.docs.length === 0) {
            self.createRootFolder();
          }
        }, function errorCallback(result) {
          console.log("ERROR");
        });
      };

      this.createRootFolder = function() {

        var params = {
          name: 'main',
          parent: '/'
        };

        headers: {
          authorization: this.getToken()
        }

        return $http.post('/folder', params)
          .then(function successCallback(result) {
            var currentFolder = {
              name: 'main',
              id: result.data._id
            };

            //self.setCurrentFolder(currentFolder);

            param = [result.data._id];
            $http.post('/user/' + self.getId() + '/folder', param)
              .then(function successCallback(result) {
                console.log('Folder added to user');
              }, function errorCallback(result) {
                console.log("Folder wasn't added to the user.");
              });
          }, function errorCallback(result) {

          });
      };

      this.updateFolders = function() {

        this.getFolders(false).then(function successCallback(result) {

          if (folders.folder === null) {
            console.log("folders are empty");
          }
          self.setCurrentFolder(result.data.docs[0]);
          folders.folder = [];
          for (i = 1; i < result.data.docs.length; i++) {
            folders.folder.push(result.data.docs[i]);
          }

        }, function errorCallback(result) {
          console.log(result);
          folders.folder = [];
        });

      };

      this.updateCurrentFolder = function() {
        // true is used for quertying root folder
        this.getFolders(true).then(function successCallback(result) {
          debugger
          var mainFolder = {
            name: result.data.docs[0].name,
            id: result.data.docs[0]._id
          }
          currentFolder.parent = [];
          currentFolder.parent.push(mainFolder);
          self.setCurrentFolder(mainFolder);
        }, function errorCallback(result) {
          console.log(result);
        });
      };

      this.updateTimer = function() {

        this.getFiles().then(function successCallback(result) {
          if (data.lastUpdated === null) {
            console.log("data.lastUpdated is null");
          }
          data.lastUpdated = [];
          for (i = 0; i < result.data.docs.length; i++) {
            data.lastUpdated.push(result.data.docs[i]);
          }
        }, function errorCallback(result) {
          console.log(result);
          data.lastUpdated = [];
        });
      };

      this.register = function(user) {
        return $http.post('/register', user)
          .then(function successCallback(response) {
            return response;
          }, function errorCallback(response) {
            return response;
          });
      };

      this.register = function(user) {
        return $http.post('/register', user)
          .then(function successCallback(response) {
            return response;
          }, function errorCallback(response) {
            return response;
          });
      };

      this.login = function(user) {
        return $http.post('/login', user)
          .then(function successCallback(response) {
            if (response.data['refreshToken']) {
              $window.localStorage['token'] = response.data['refreshToken'];
              $window.localStorage['_id'] = response.data.user['_id'];
              $window.localStorage['firstName'] = response.data.user['firstName'];
              $window.localStorage['lastName'] = response.data.user['lastName'];
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
          });
      };




      this.createFile = function(file) {

        var userId = self.getId();

        var params = {
          name: file.name,
          type: file.type
        };

        headers: {
          authorization: self.getToken()
        }
        return $http.post('/file', params)
          .then(function successCallback(result) {
            // add user - file association
            var fileId = result.data._id;
            var params = [fileId];
            return $http.post('/user/' + userId + '/file', params)
              .then(function successCallback(result) {

                self.associateWithFolder(params);
              })

          }, function errorCallback(result) {
            console.log("Error");
          });

      };

      this.createFolder = function(folderName) {

        var userId = self.getId();

        var params = {
          name: folderName,
          parent: currentFolder.name
        };

        headers: {
          authorization: self.getToken()
        }
        return $http.post('/folder', params)
          .then(function successCallback(result) {
            // add user - file association
            var folderId = result.data._id;
            var params = [folderId];
            return $http.post('/user/' + userId + '/folder', params)
              .then(function successCallback(result) {
                self.associateFolderWithFolder(result);
              })

          }, function errorCallback(result) {
            console.log("Error");
          });

      };

      this.associateFolderWithFolder = function(result) {

        var param = [result.data._id];

        headers: {
          authorization: self.getToken()
        }

        return $http.post('/folder/' + currentFolder.id + '/folder', param)
          .then(function successCallback(result) {
            self.updateFolders();
          }, function errorCallback(result) {
            console.log("Error");
          });

      }

      this.associateWithFolder = function(result) {

        var param = [result];

        headers: {
          authorization: self.getToken()
        }

        return $http.post('/folder/' + currentFolder.id + '/file', param)
          .then(function successCallback(result) {
            self.updateTimer();
          }, function errorCallback(result) {
            console.log("Error");
          });

      }

      // config is an array of strings to sort by
      this.getSortedFiles = function(userId, config) {
        var query = config.join('%24sort=');
        return $http.post('/user/' + userId + '/file?%24sort=' + query);
      };
    }
  ]);
