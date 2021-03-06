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
    var rootFolder = '';

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

    this.getCurrentFolder = function() {
      return currentFolder;
    };

    this.getRootFolder = function () {
      return $q(function(resolve, reject) {
        setTimeout(function() {
          $http.get('/folder?user=' + self.getId() + '&name=root')
            .then(function successCallback(result) {
              if(result.data.docs.length === 1){
                resolve(result.data.docs[0]._id);
              } else {
                console.log("Error: Number of folders named root is " + result.data.docs.length);         
                reject(result);
              }
            }, function errorCallback(result) {
              console.log("Could not retrieve root folder.");
              console.log(result);
              reject(result);
            });
        }, 1000);
      });
    };

    this.getFolders = function() {
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
      if(currentFolder !== '') {
          headers: {
            authorization: $window.localStorage['token']
          }
          $http.get('/folder/' + currentFolder + '/file')
            .then(function successCallback(result) {
              if(result.data.docs !== undefined){
                if(files.lastUpdated === null) {
                  console.log("files.lastUpdated is null");
                }
                files.lastUpdated = [];
                for (i = 0; i < result.data.docs.length; i++) {
                  files.lastUpdated.push(result.data.docs[i]);
                }
                console.log(files.lastUpdated);
              }
            }, function errorCallback(result) {
              console.log("Error in Auth.updateTimer.");
              console.log(result);
              files.lastUpdated = [];
            });        
      } else {
        this.getRootFolder()
          .then(function(result) {
            currentFolder = result;
            self.updateFiles();
          });
      }

      /*
      // Original implementation of retrieving files from user.
      var userId = self.getId();
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
        });
      */
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
              rootFolder = result;
              self.updateFolders();
            } else {
              self.createRootFolder().then(function(result) {
                currentFolder = result;
                rootFolder = result;
              });            
            }
          }, function errorCallback(result) {
              currentFolder = '';
          });
      }
    };

    this.updateRootFolder = function() {
      if(rootFolder === ''){
        $http.get('/folder?user=' + self.getId() + '&name=root')
          .then(function successCallback(result) {
            if(result.data.docs.length === 1){
              rootFolder = result.data.docs[0]._id;
            } else {
              console.log("Error: Number of folders named root is " + result.data.docs.length);         
            }
          }, function errorCallback(result) {
            console.log("Could not retrieve root folder.");
            console.log(result);
          });
      } else {
        self.updateRootFolder();
      }
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
                // On success, add file to folder
                .then(function successCallback(result) {
                  $http.post('/folder/' + currentFolder + '/file', params)
                    //On success
                    .then(function successCallback(result) {
                      console.log("Successfully created file and added to currentFolder.");
                      resolve(fileId);
                    }, function errorCallback(result) {
                      console.log("Error adding file to folder.");
                      console.log(result);
                      reject(result);
                    });
                }, function errorCallback(result) {
                  console.log("Error updating file path.");
                  console.log(result);
                  reject(result);
                });
              /*
                // Original implementation of adding file directly to user.
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
              */
            // On failure
            }, function errorCallback(result) {
              console.log("Error creating file.");
              console.log(result);
              reject(result);
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

    this.changeFolder = function (folderId) {
      return $q(function(resolve, reject) {
        setTimeout(function() {
          currentFolder = folderId;
          console.log("Changed current folder to " + currentFolder);
          resolve(folderId);
        }, 1000);
      });
    };

    this.deleteFolder = function(folderId) {
      return $q(function(resolve, reject) {
        setTimeout(function() {
          $http.get('/folder/' + folderId + '/file')
            .then(function successCallback(result) {
              if(result.data.docs.length === 0) {
                $http.get('/folder/' + folderId + '/folder')
                  .then(function successCallback(result) {
                    if(result.data.docs.length === 0) {
                      var config = {
                        data: [{
                            "_id" : folderId,
                            "hardDelete": true
                          }]
                      };
                      $http.delete('/folder', config)
                        .then(function successCallback(result) {
                          self.updateFolders();
                          resolve("Folder successfully deleted.");
                        }, function errorCallback(result) {
                          reject("Error deleting folder.");
                        });
                    } else {
                      reject("Only empty folders can be deleted.");
                    }
                  }, function errorCallback(result) {
                    console.log("Error getting folders of a folder.");
                  });
              } else {
                reject("Only empty folders can be deleted.");
              }
            }, function errorCallback(result) {
              console.log("Error getting files of a folder.");
              reject(result);
            });
        }, 1000);
      });
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
