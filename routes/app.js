var Joi = require("joi");
var azure = require('azure');
var PatronDetailController = require('./../controllers/patrondetail');
var AzureTable=require('./../lib/azuretable');
var nconf = require('nconf');
nconf.env().file({ file: 'config.json'});
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");
var tableService = azure.createTableService
                       (accountName, accountKey);
 
var azureTable = new AzureTable(azure.createTableService(
accountName, accountKey), tableName, partitionKey);
 
var patronDetailController = new PatronDetailController(azureTable);

var routes =
[
{
method: 'GET',
path: '/patron-detail',
config: {
    handler: patronDetailController.getPatronDetail
                             .bind(patronDetailController)
}
},
{
method: 'POST',
path: '/patron-detail',
config: {
   handler: patronDetailController.insertPatronDetail
                              .bind(patronDetailController),
   validate: {
       payload: {
            UnifiedPatronNumber : Joi.string(),
            Name: Joi.string(),
            Class: Joi.string()
       } }
  }
},
{
method: 'PUT',
path: '/patron-detail/{rowkey}',
config: {
   handler: patronDetailController.updatePatronDetail
                       .bind(patronDetailController),
   validate: {
       payload: {
           UnifiedPatronNumber : Joi.string(),
           Name: Joi.string(),
           Class: Joi.string()
       } }
  }
},
{
method: 'DELETE',
path: '/patron-detail/{rowkey}',
config: {
   handler: patronDetailController.deletePatronDetail
                                .bind(patronDetailController)
  }
}       
];
 
module.exports.routes = function (server) {
    server.route(routes);
};