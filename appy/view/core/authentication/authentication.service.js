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

    this.saveRootFolderId = function(rootFolderId){
      $window.localStorage['rootFolderId'] = rootFolderId;
    };

    this.getRootFolderId = function(){
      return $window.localStorage['rootFolderId'];
    }

    this.saveFolderId = function(folderId) {
      $window.localStorage['folderId'] = folderId;
    }

    this.getFolderId = function() {
      return $window.localStorage['folderId'];
    }

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

    this.getFolders = function() {
      var userId = this.getId();
      headers: {
        authorization: $window.localStorage['token']
      };
      return $http.get('/user/'+userId + '/file')
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
            $window.localStorage['rootFolderId'] = response.data.user['rootFolder'];
            $window.localStorage['folderId'] = response.data.user['rootFolder'];
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
      $window.localStorage.removeItem('firstName');
      $window.localStorage.removeItem('lastName');
      $window.localStorage.removeItem('rootFolderId');
      $window.localStorage.removeItem('folderId');
      $http.defaults.headers.common.Authorization = null;
      return $http(config)
        .then(function successCallback(response) {
          return response;
        }, function errorCallback(response) {
          return response;
        }
      );
    };

    this.createFile = function(file, folderId) {

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
              console.log("File Id: " + fileId);
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
                    // On success add file to current folder
                    .then(function successCallback(result) {
                      if(self.getFolderId() === self.getRootFolderId()) {
                        $http.post('/rootFolder/' + self.getRootFolderId() + '/file', params)
                          .then(function successCallback(result) {
                            console.log(result);
                            console.log("Successfully created file and added to current user/folder.");
                            resolve(fileId);
                          }, function errorCallback(result) {
                            console.log("Error in Auth.createFile(file, folderId): $http.post('/rootFolder/' + self.getRootFolderId() + '/file', [result.config.data[0]]");
                          });
                      }
                      else{
                        console.log("Adding file to non-root folder.");
                      }
                    }, function errorCallback(result) {
                      console.log("Error in Auth.createFile(file, folderId): $http.post('/user/' + userId + '/file/' + fileId)");         
                      reject("Error in Auth.createFile(file, folderId): $http.post('/user/' + userId + '/file/' + fileId)");
                    });
                }, function errorCallback(result) {
                  console.log("Error in Auth.createFile(file, folderId): $http.put('/file/' + fileId)");
                  reject("Error in Auth.createFile(file, folderId): $http.put('/file/' + fileId)");
                });
            // On failure
            }, function errorCallback(result) {
              console.log("Error in Auth.createFile(file, folderId): $http.post('/file/', params)");
              reject("Error in Auth.createFile(file, folderId): $http.post('/file/', params)");
            });
        }, 1000);
      });
    };

    this.createFolder = function(folder, folderpath) {
      var userId = self.getId(); 
      //make that body of the request to appy 
      var params = { 
        name: folder.name, 
        path: folderpath,
        parent: folder.parent 
      }
      //make the request 
      $http.post('/folder', params)
        .then(function successCallback(result) {
        //use the results of the request to add the folder to the user 

          console.log(result.data._id);
          var folderId = result.data._id;
          var params = [folderId];
          $http.post('/user/' + userId + '/folder', params)
            .then(function successCallback(result) {
              console.log("Successfully created folder and added to current user.");
            }, function errorCallback(result) {
              $window.alert("Error creating folder.");
            });
          }, function errorCallback(result) {
            console.log("Error in Auth.createFolder(folder, folderpath): $http.post('/folder', params)");
            console.log(result);
          })
    };

    this.createRootFolder = function() {
      var userId = self.getId();
      //make that body of the request to appy 
      var params = [{
        user: userId
      }];
      //make the request 
      $http.post('/rootFolder', params)
        .then(function successCallback(result) {
        //use the results of the request to add the rootfolder to the user
          console.log(result);
          var rootFolderId = result.data[0]._id;
          console.log(rootFolderId);
          self.saveRootFolderId(rootFolderId);
          var req = {
            method: 'PUT',
            url: '/user/' + userId,
            data: {
              rootFolder: rootFolderId
            },
            headers: {
              Authorization: self.getToken()
            }
          };
          $http(req)
            .then(function successCallback(result) {
              console.log("Successfully created rootFolder and added to current user.");
            }, function errorCallback(result) {
              $window.alert("Error creating rootFolder.");
            });
          }, function errorCallback(result) {
            console.log("Error in Auth.createRootFolder(): $http.(req)");
            console.log(result);
          })
    };

    this.deleteFile = function (fileId) {
      var params = {
        "fileId": fileId
      }
      console.log(params);
      // Delete file from S3
      $http.post("/deleteFromS3", params)
        .then(function successCallback(result) {
          console.log("Successfully deleted from S3");

          var key = result.data.Deleted[0].Key;

          var config = {
            headers: {
              Authorization: self.getToken()
            }
          }
          // Remove file from user.
          $http.delete('/user/' + self.getId() + '/file/' + result.data.Deleted[0].Key, config)
            .then(function successCallback(result) {
              console.log("Successfully removed file from user");
                var config = {
                  data: [ {
                    _id : key,
                    hardDelete: true
                  }],
                  headers: {
                    Authorization: self.getToken()
                  }
                }
              // Remove file from its folders.
              // Delete file from database.
              $http.delete('/file', config)
                .then(function successCallback(result) {
                  console.log("Successfully deleted file from database.");
                }, function errorCallback(result) {
                  console.log("Error deleting file from database.");
                  console.log(result);
                });
              self.updateTimer();
            }, function errorCallback(result) {
              console.log("Error removing file from user.");
            });
        }, function errorCallback(result) {
          console.log("Error deleting from S3");
          console.log(result);
        })
    };
    this.addFileToFolder = function(fileID, folderID){
        //add file to a folder 
        var params = [fileId];
        return $http.post('/folder/' + folderId + '/file', params);
    };
    // config is an array of strings to sort by
    this.getSortedFiles = function(userId, config) {
      var query = config.join('%24sort=');
      return $http.post('/user/' + userId + '/file?%24sort=' + query);
    };
 }
]);
