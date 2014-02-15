/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ SockJS Server

/**
 * SockJS Server
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
(function() {

    var vertx, eb, console, server, sockJSServer, addr, clients, map;

    addr            = 'demo.orderMgr';
    vertx           = require('vertx');
    eb              = require('vertx/event_bus');
    console         = require('vertx/console');
    map             = vertx.getMap('clients');
    clients         = {},
    server          = vertx.createHttpServer();
    sockJSServer    = vertx.createSockJSServer(server);

    (function() {

        var clientKeys = [];

        clients.put = function(key, data) {

            if (!clientKeys.some(function(v){ return v === key })) {
                console.log(key);
                clientKeys.push(key);
            }

            map.put(key, data);
        }

        clients.get = function(key) {
            return map.get(key);
        }

        clients.remove = function(key) {
            delete clientKeys[key];
            map.remove(key);
        }

        clients.getKeys = function() {
            return clientKeys;
        }

    })();

    var myHandler = function(body) {

        var type    = body.type,
            message = body.message;

        if (type === 'choose_uuid') {

            var uuid = message;

            if (!clients.get(uuid)) {

                clients.put(uuid, true);

                eb.publish(addr, {
                    type: 'decided_uuid',
                    message: uuid
                });

            } else {

                eb.publish(addr, {
                    type: 'reorder_uuid',
                    message: uuid
                });

            }

        } else if (type === 'set_client_data') {

            var uuid            = message.uuid,
                data            = message.data,
                replyAddress    = message.replyAddress,
                success         = false;

            if (clients.get(uuid)) {
                clients.put(uuid, JSON.stringify(data));
                success = true;
            }

            eb.publish(addr, {
                type: 'set_client_data_reply',
                message: {
                    replyAddress: replyAddress,
                    success: success
                }
            });

        } else if (type === 'get_clients') {

            var replyAddress = message.replyAddress,
                keys = clients.getKeys();

            // TODO keysをもとにクライアント情報を抜き出す


            eb.publish(addr, {
                type: 'get_clients_reply',
                message: {
                    replyAddress: replyAddress,
                    clients: keys
                }
            });

        } else {
            console.log('I received a message ' + JSON.stringify(body));
        }

    }
    eb.registerHandler(addr, myHandler);

    sockJSServer.bridge({
        prefix : '/eventbus'
    }, [{
        address : addr
    }], [{
        address : addr
    }] );

    server.listen(8085);

})();

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
