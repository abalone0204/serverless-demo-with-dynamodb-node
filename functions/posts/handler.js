'use strict';

console.log('Loading function');

function display(object) {
    return JSON.stringify(object, null, 2)
}

module.exports.handler = function(event, context) {
  console.log('Event: ', display(event));
  console.log('Context: ', display(context));
  context.succeed({
    message: 'ok, it works'
  })
};
