'use strict';

module.exports = function (mongoose) {
  var modelName = "folder";
  var Types = mongoose.Schema.Types;
  var Schema = new mongoose.Schema({
    name: {
      type: Types.String,
      required: true,
    },
    parent:{
      type: Types.String,
      required: false
    },
    user:{
      type: Types.ObjectId,
      ref: "user"
    }
  });

  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      associations: {
        files:{
          type:"ONE_MANY",
          foreignField: "folder",
          model:"file"
        },
        user: {
          type: "MANY_ONE",
          model: "user"
        },
        folders:{
          type:"ONE_MANY",
          foreignField: "parent",
          model: "folder"
        }
      }
    }
  };

  return Schema;
};
