/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ SockJS Server

/**
 * SockJS Server
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
(function() {

    var vertx, eb, console, server, sockJSServer, addr;

    addr            = 'demo.orderMgr';
    vertx           = require('vertx');
    eb              = require('vertx/event_bus');
    console         = require('vertx/console');
    server          = vertx.createHttpServer();
    sockJSServer    = vertx.createSockJSServer(server);


 //   sockJSServer.on('connection', function(conn) {
//        console.log('    [+] broadcast open ' + conn);
        /*
        broadcast[conn.id] = conn;
        conn.on('close', function() {
            delete broadcast[conn.id];
            console.log('    [-] broadcast close' + conn);
        });
        conn.on('data', function(m) {
            console.log('    [-] broadcast message', m);
            for(var id in broadcast) {
                broadcast[id].write(m);
            }
        });
       */
  //  });



    var myHandler = function(body) {

        var type    = body.type,
            message = body.message,
            map     = vertx.getMap('clients');

        if (type === 'choose_uuid') {

            var uuid = message;

            if (!map.get(uuid)) {

                map.put(uuid, true);

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

            var uuid = message.uuid,
                data = message.data,
                map  = vertx.getMap('clients');

            if (map.get(uuid)) {
                map.put(uuid, JSON.stringify(data));
            }

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
