/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ SockJS Server

/**
 * SockJS Server
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
(function() {

    var vertx, eb, console, server,
        sockJSServer, addr, clients, map,
        doHeartBeat;

    addr            = 'demo.orderMgr';
    vertx           = require('vertx');
    eb              = require('vertx/event_bus');
    console         = require('vertx/console');
    map             = vertx.getMap('clients');
    clients         = {},
    deadClients     = {},
    hbAcceptReceive = false,
    server          = vertx.createHttpServer();
    sockJSServer    = vertx.createSockJSServer(server);

    (function() {

        var clientKeys = [];

        clients.put = function(key, data) {

            if (!clientKeys.some(function(v){ return v === key })) {
                clientKeys.push(key);
            }

            map.put(key, data);
        }

        clients.get = function(key) {
            return map.get(key);
        }

        clients.remove = function(key) {

            var find = false;
            for (i = 0; i < clientKeys.length; i++) {
                if (clientKeys[i] === key) {
                    find = i;
                    break;
                }
            }

            if (find !== false) {
                clientKeys.splice(find, 1);
            }
            map.remove(key);
        }

        clients.getKeys = function() {
            return clientKeys;
        }

    })();


    doHeartBeat = function() {

        hbAcceptReceive = true;

        var keys = clients.getKeys(), i;

        for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            deadClients[key] = clients.get(key);
        }

        eb.publish(addr, {
            type: 'heartbeat'
        });

        hbTimerID = vertx.setPeriodic(10000, function() {

            vertx.cancelTimer(hbTimerID);
            hbAcceptReceive = false;

            for(var key in deadClients) {
                clients.put(key, false);
                clients.remove(key);
            }

            if (Object.keys(deadClients).length > 0) {
                eb.publish(addr, {
                    type: 'disconnect_clients',
                    clients: deadClients
                });
            }
            deadClients = {};

            console.log(JSON.stringify(clients.getKeys()));

            doHeartBeat();
        });

    }

    doHeartBeat();

    var myHandler = function(body) {

        var type    = body.type,
            message = body.message;

        if (type === 'heartbeat_reply' && hbAcceptReceive) {

            var uuid = message.uuid;

            if (deadClients[uuid]) {
                delete deadClients[uuid];
            }

        } else if (type === 'choose_uuid') {

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
                keys = clients.getKeys(),
                c = {}, i;

            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                c[key] = clients.get(key);
            }

            eb.publish(addr, {
                type: 'get_clients_reply',
                message: {
                    replyAddress: replyAddress,
                    clients: c
                }
            });

        } else {
            console.log('I received a message ' + JSON.stringify(body));
        }

    }
    eb.registerHandler(addr, myHandler);

    // heartbeat





    /*
                keys = clients.getKeys(),
                c = {}, i;

            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                c[key] = clients.get(key);
            }
    */



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
