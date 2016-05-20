'use strict';

var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();

console.log('Loading function');

function display(object) {
    return JSON.stringify(object, null, 2)
}

module.exports.handler = function(event, context) {
    console.log('Event: ', display(event));
    console.log('Context: ', display(context));
    var operation = event.operation;
    if (event.tableName) {
        event.payload.TableName = event.tableName;
    }
    switch (operation) {
        case 'create':
            var uuid = require('node-uuid');
            event.payload.Item.id = uuid.v1();
            console.log('Payload: ', display(event.payload));
            dynamo.putItem(event.payload);
            break;
        default:
            context.fail(new Error('Unrecognized operation "' + operation + '"'));
    }
};