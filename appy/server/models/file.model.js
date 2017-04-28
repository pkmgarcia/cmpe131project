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
          type: "ONE_ONE",
          model: "folder"
        }
      }
    }
  };
  
  return Schema;
};