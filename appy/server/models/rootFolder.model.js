'use strict';

module.exports = function (mongoose) {
  var modelName = "rootFolder";
  var Types = mongoose.Schema.Types;
  var Schema = new mongoose.Schema({
    user: {
  	  type: Types.ObjectId,
  	  ref: "user"
	 },
  });
  
  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      associations: {
        files:{
          type:"MANY_MANY",
          model:"file"
        },
        user: {
          type: "ONE_ONE",
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