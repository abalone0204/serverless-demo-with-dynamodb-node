'use strict'

const DOC = require('dynamodb-doc')
const dynamo = new DOC.DynamoDB()

console.log('Loading function')

function display(object) {
    return JSON.stringify(object, null, 2)
}

module.exports.handler = (event, context) => {
    console.log('Event: ', display(event))
    console.log('Context: ', display(context))
    const operation = event.operation
    if (event.tableName) {
        event.payload.TableName = event.tableName
    }
    switch (operation) {
        case 'create':
            const uuid = require('node-uuid')
            event.payload.Item.id = uuid.v1()
            console.log('Payload: ', display(event.payload))
            dynamo.putItem(event.payload, (err, data) => {
                context.succeed(event.payload.Item)
            })
            break
        case 'read':
            dynamo.getItem(event.payload, (err, data) => {
                context.succeed(data)
            })
            break
        case 'update':
            dynamo.putItem(event.payload, (err, data)=> {
                context.succeed(event.payload)
            })
            break
        case 'destroy':
            dynamo.deleteItem(event.payload, context.done)
            break
        case 'list':
            dynamo.scan(event.payload, context.done)
            break
        default:
            context.fail(new Error('Unrecognized operation "' + operation + '"'))
    }
}