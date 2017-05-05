'use strict';

module.exports = function(mongoose) {
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
    user: {
      type: Types.ObjectId,
      ref: "user"
    },
    folder: {
      type: Types.ObjectId,
      ref: "folder"
    }
  });

  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      associations: {
        user: {
          type: "MANY_ONE",
          model: "user"
        },
        folder:{
          type:"MANY_ONE",
          model: "folder"
        }
      }
    }
  };
  return Schema;
};
