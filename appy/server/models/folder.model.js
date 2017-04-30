'use strict';

module.exports = function (mongoose) {
  var modelName = "folder";
  var Types = mongoose.Schema.Types;
  var Schema = new mongoose.Schema({
    name: {
      type: Types.String,
      required: true,
      unique: true
    },
    path: {
      type: Types.String,
      required: true
    },
    parent:{
      type: Types.String,
      required: false
    },
    isRoot:{
      type: Types.Boolean,
      required: false,
      default: false
    }
  });
  
  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      associations: {
        files:{
          type:"ONE_MANY",
          model:"file"
        },
        users: {
          type: "MANY_MANY",
          model: "user"
        },
        folders:{
          type:"ONE_MANY",
          model: "folder"
        }
      }
    }
  };
  
  return Schema;
};