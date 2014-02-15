/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ Ext.Loader

Ext.Loader.setPath('Ext.sockjs', 'ext-sockjs/src');

// }}}
// {{{ Ext.Application

/*!
 * Ext.Application - SockJSApp
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
Ext.application({

    // {{{ requires

    requires: [
        'Ext.sockjs.Manager'
    ],

    // }}}
    // {{{ name

    name: 'SockJSApp',

    // }}}
    // {{{ launch

    launch: function() {

        var provider = Ext.SockJS.addProvider({
            url     : 'http://localhost:8085/eventbus',
            addr    : 'demo.orderMgr'
        });


        Ext.widget('window', {
            width: 200,
            height: 150,
            autoShow: true,
            buttons: [{
                text: 'Publish',
                handler: function() {

                    provider.publish('demo.orderMgr', "hogehoge");

        //            Ext.SockJS.get('demo.orderMgr').publish("teston");
                }
            }]
        });

    }

    // }}}

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
