/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ SockJS Server

/**
 * SockJS Server
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
(function() {

    var vertx, server, sockJSServer;

    vertx           = require('vertx');
    server          = vertx.createHttpServer();
    sockJSServer    = vertx.createSockJSServer(server);

    sockJSServer.bridge({prefix : '/eventbus'}, [{
        address : 'demo.orderMgr'
    }], [{
        address : 'demo.orderMgr'
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
