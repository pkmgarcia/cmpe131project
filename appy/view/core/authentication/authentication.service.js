angular.module('core.authentication')
.service('Auth', [
  '$http',
  '$window',
  '$timeout',
  '$q',
  function Auth($http, $window, $timeout, $q) {

    var self = this;
    var age = 10;
    var files = { 
      lastUpdated: []
    };
    var folders = {
      lastUpdated: []
    };
    var currentFolder = '';

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

    this.getFolders = function() {
      console.log("getFolders calling updateFolders");
      self.updateFolders();
      return folders;
    };

    this.getFiles = function() {
      self.updateFiles();
      return files;
    };

    this.setAge = function(age) {
      age = age;
    };

    this.getAge = function() {
      return age;
    };
    this.updateFiles = function() {
      var userId = this.getId();
      headers: {
        authorization: $window.localStorage['token']
      }
      $http.get('/user/' + userId + '/file')
        .then(function successCallback(result) {
          if(result.data.docs !== undefined){
            if(files.lastUpdated === null) {
              console.log("files.lastUpdated is null");
            }
            files.lastUpdated = [];
            for (i = 0; i < result.data.docs.length; i++) {
              files.lastUpdated.push(result.data.docs[i]);
            }
            console.log("In updateTimer: ");
            console.log(files.lastUpdated);
          }
        }, function errorCallback(result) {
          console.log("Error in Auth.updateTimer.");
          console.log(result);
          files.lastUpdated = [];
        });;
    };

    this.updateFolders = function() {
      if(currentFolder !== ''){
        headers: {
          authorization: $window.localStorage['token']
        }
        $http.get('/folder/' + currentFolder + '/folder')
          .then(function successCallback(result) {
            if(result.data.docs !== undefined){
              console.log("docs not null");
              if(folders.lastUpdated === null) {
                console.log("folders.lastUpdated is null");
              }
              folders.lastUpdated = [];
              for (i = 0; i < result.data.docs.length; i++) {
                folders.lastUpdated.push(result.data.docs[i]);
              }
              console.log(folders.lastUpdated)
            }
          }, function errorCallback(result) {
            console.log("Error in Auth.updateTimer.");
            console.log(result);
            folders.lastUpdated = [];
          });
      } else {
        console.log("Checking for root folder");
        $http.get('/folder?user=' + self.getId() + '&name=root')
          .then(function successCallback(result) {
            if(result.data.docs.length === 1){
              currentFolder = result.data.docs[0]._id;
              self.updateFolders();
            } else {
              self.createRootFolder().then(function(result) {
                currentFolder = result;
              });            
            }
          }, function errorCallback(result) {
              currentFolder = '';
          });
      }
    };
/*
    this.updateFiles = function() {
      var userId = this.getId();
      headers: {
        authorization: $window.localStorage['token']
      }
      return $http.get('/user/' + userId + '/file');
    };

    this.updateFolders = function() {
      if(currentFolder !== ''){
        headers: {
          authorization: $window.localStorage['token']
        }
        return $http.get('/folder/' + currentFolder + '/folder');
      } else {
        console.log("Checking for root folder");
        $http.get('/folder?user=' + self.getId() + '&name=root')
          .then(function successCallback(result) {
            if(result.data.docs.length === 1){
              currentFolder = result.data.docs[0]._id;
              return $http.get('/folder/' + currentFolder + '/folder');
            } else {
              self.createRootFolder().then(function(result) {
                console.log("Returning from updateFolders with undefined");
                currentFolder = result;
                return $http.get('/folder/' + currentFolder + '/folder');
              });            
            }
          }, function errorCallback(result) {
              currentFolder = '';
          });
      }

    };

    this.updateTimer = function() {
      this.updateFiles().then(function successCallback(result) {
          if(result.data.docs !== undefined){
            if(files.lastUpdated === null) {
              console.log("files.lastUpdated is null");
            }
            files.lastUpdated = [];
            for (i = 0; i < result.data.docs.length; i++) {
              files.lastUpdated.push(result.data.docs[i]);
            }
            console.log("In updateTimer: ");
            console.log(files.lastUpdated);
          }
        }, function errorCallback(result) {
          console.log("Error in Auth.updateTimer.");
          console.log(result);
          files.lastUpdated = [];
        });

      console.log("Finished updating files. CurrentFolder: " + currentFolder);
      console.log("Updating folders.");

     // if(currentFolder !== ''){
        console.log("Updating folders list.");
        this.updateFolders().then(function successCallback(result) {
            if(result.data.docs !== undefined){
              console.log("docs not null");
              if(folders.lastUpdated === null) {
                console.log("folders.lastUpdated is null");
              }
              folders.lastUpdated = [];
              for (i = 0; i < result.data.docs.length; i++) {
                folders.lastUpdated.push(result.data.docs[i]);
              }
              console.log(folders.lastUpdated)
            }
          }, function errorCallback(result) {
            console.log("Error in Auth.updateTimer.");
            console.log(result);
            folders.lastUpdated = [];
          });
        
      // } else {
      //   console.log("Checking for root folder in updateTimer()");
      //   var query = self.getId() + '&name=root';
      //   return $http.get('/folder?user=' + query)
      //     .then(function successCallback(result) {
      //       console.log(result);
      //       if(result.data.docs.length === 1){
      //         currentFolder = result.data.docs[0]._id;
      //         console.log("UpdateTimer called from UpdateTimer");
      //         self.updateTimer();
      //         console.log("Root folder present.");
      //         console.log("Root folder id: " + currentFolder);
      //       } else {
      //         self.createRootFolder();
      //       }
      //     }, function errorCallback(result){
      //       console.log("Error Checking for root folder.");
      //       console.log(result);
      //     });
      // };
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
          if(response.data['refreshToken']){
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
      $window.localStorage.removeItem('firstName');
      $window.localStorage.removeItem('lastName');
      currentFolder = '';
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
            type: file.type,
            user: userId
          };
          
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

    this.createFolder = function(folder) {
      return $q(function(resolve, reject) {
        setTimeout(function() {
          // Create data for requests
          var userId = self.getId();
          console.log(userId + " Inside createFolder");
          var params = { 
            name: folder.name,
            user: userId,
            parent: currentFolder
          };
          // Create the folder
          $http.post('/folder', params)
            // On success, add folder to user
            .then(function successCallback(result) {
              console.log(result);
              var folderId = result.data._id;
              var params = [folderId];
              $http.post('/user/' + userId + '/folder', params)
                // On success, add folder to currentFolder
                .then(function successCallback(result) {
                  console.log(currentFolder);
                  if(currentFolder !== '') {
                    var params = [folderId];
                    $http.post('/folder/' + currentFolder + '/folder', params)
                      // On success, return with folderId
                      .then(function successCallback(result) {
                        console.log("Successfully created folder with no parent.");
                        resolve(folderId);
                      }, function errorCallback(result) {
                        console.log("Error in Auth.createFolder(folder): $http.post('/user/' + userId + '/folder/' + folderId)");         
                        reject("Error in Auth.createFolder(folder): $http.post('/user/' + userId + '/folder/' + folderId)");
                      });
                  } else {
                    currentFolder = folderId;
                  }
                }, function errorCallback(result) {
                  console.log("Error in Auth.createFolder(folder): $http.post('/user/' + userId + '/folder/' + folderId)");         
                  reject("Error in Auth.createFolder(folder): $http.post('/user/' + userId + '/folder/' + folderId)");
                });
            }, function errorCallback(result) {
              console.log("Error in Auth.createFolder(folder): $http.put('/folder/' + folderId)");
              reject("Error in Auth.createFolder(folder): $http.put('/folder/' + folderId)");
            });
            // On failure
        }, 1000);
      });
    };

    this.createRootFolder = function() {
      var folder = {
        name : "root",
        parent: ""
      };
      return self.createFolder(folder);
    };

      this.addFileToFolder = function(fileID, folderID){
      //add file to a folder 
        var params = [fileId];
        return $http.post('/folder/' + folderId + '/file', params)
      };

      /*
      this.getMyFolders = function() {
        var query = self.getId();
        return $http.get('/folder?owner=' + query);
      };

      // config is an array of strings to sort by
      this.getSortedFiles = function(userId, config) {
        var query = config.join('%24sort=');
        return $http.post('/user/' + userId + '/file?%24sort=' + query);
      };
      */
 }
]);
