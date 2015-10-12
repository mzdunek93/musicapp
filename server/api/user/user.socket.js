/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var user = require('./user.model');

exports.register = function(socket) {
  user.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  user.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  user.findOne({_id: socket.decoded_token._id}, function(err, user) {
    user.connections += 1;
    user.save();
  });

  socket.on('disconnect', function () {
    user.findOne({_id: socket.decoded_token._id}, function(err, user) {
      user.connections -= 1;
      user.save();
    });
  });
}

function onSave(socket, doc, cb) {
  socket.emit('user:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('user:remove', doc);
}
