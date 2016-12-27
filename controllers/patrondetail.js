"use strict";
var azure = require('azure');
module.exports = PatronDetailController;
function PatronDetailController(azureTable) {
    this.azureTable = azureTable;
}
PatronDetailController.prototype = {
    getPatronDetail: function (request, reply) {
        var self = this;
        var query = azure.TableQuery
            .select()
            .from(self.azureTable.tableName)
            .where('PartitionKey eq ?',
                 self.azureTable.partitionKey);
        self.azureTable.find(query,
     function itemsFound(error, items) {
           reply(items);
        });
    },
    insertPatronDetail: function insertPatronDetail(request, reply) {
        var self = this;
        var patron = {
            UnifiedPatronNumber : request.payload.UnifiedPatronNumber
            , Name: request.payload.Name
            , Class: request.payload.Class
        };
        self.azureTable.addItem(patron, 
       function itemAdded(error) {
            if(error) {
                reply(error);
            }
            else{ reply(patron);}
        });
    },
    updatePatronDetail: function updatePatronDetail(request, reply) {
        var self = this;
        var patron = {
            PartitionKey : self.azureTable.partitionKey
            , RowKey : request.params.rowkey
            , UnifiedPatronNumber : request.payload.UnifiedPatronNumber
            , Name: request.payload.Name
            , Class: request.payload.Class
        };
        self.azureTable.updateItem(patron, 
      function itemUpdated(error) {
            if(error) {
                reply(error);
            }
            else{ reply(patron);}
        });
    },
    deletePatronDetail: function deletePatronDetail(request, reply) {
        var self = this;
        self.azureTable.deleteItem(request.params.rowkey, 
        function itemDeleted(error) {
            if(error) {
                reply(error);
            }
            else{reply({ message : "Patron deleted"})}
        });
    }
}