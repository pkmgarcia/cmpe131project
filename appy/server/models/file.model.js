'use strict';

module.exports = function (mongoose) {
  var modelName = "file";
  var Types = mongoose.Schema.Types;
  var Schema = new mongoose.Schema({
    name: {
      type: Types.String,
      required: true
    },
    type: {
      type: Types.String,
      required: true
    },
    path: {
      type: Types.String,
      required: false
    },
    folder: {
      type: Types.ObjectId,
      ref: 'folder'
    }
  });
  
  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      associations: {
        users: {
          type: "MANY_MANY",
          model: "user"
        },
        folders: {
          type: "MANY_ONE",
          model: "folder"
        },
        rootFolders:{
          type: "MANY_MANY",
          model: "rootFolder"
        }
      }
    }
  };
  
  return Schema;
};