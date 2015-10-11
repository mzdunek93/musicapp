/* global io */
'use strict';

angular.module('musicappApp')
  .factory('socket', function(socketFactory, $cookieStore) {

    // socket.io now auto-configures its connection when we ommit a connection url
    function connect() {
      var ioSocket = io('', {
        'query': 'token=' + $cookieStore.get('token'),
        path: '/socket.io-client'
      });

      ioSocket.connect();

      console.log(ioSocket)

      return socketFactory({
        ioSocket: ioSocket
      });
    }

    var socket = connect();

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      },

      connect: function () {
        socket = connect();
        console.log(socket);
      },

      disconnect: function () {
        socket.disconnect();
      }
    };
  });
