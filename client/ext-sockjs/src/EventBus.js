/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ Ext.sockjs.EventBus

/**
 * Ext.sockjs.EventBus
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
Ext.define('Ext.sockjs.EventBus', {

    // {{{ mixins

    mixins: {
        observable: 'Ext.util.Observable'
    },

    // }}}
    // {{{ constructor

    constructor: function(config) {

        var me = this;

        Ext.apply(me, config);

        Ext.applyIf(me, {
            id      : Ext.id(null, 'eventbus-'),
            conn    : new vertx.EventBus(config.url)
        });

        // イベントハンドラ設定
        Ext.apply(me.conn, {
            onopen      : Ext.Function.pass(me.onOpen, [], me),
            onmessage   : Ext.Function.pass(me.onMessage, [], me),
            onclose     : Ext.Function.pass(me.onClose, [], me)
        });

        me.mixins.observable.constructor.call(me, config);
    },

    // }}}
    // {{{ onOpen

    onOpen: function(eventbus) {

        var me = this;

        me.fireEvent('open');

        me.conn.registerHandler(me.addr, Ext.Function.pass(me.onReceive, [], me));
    },

    // }}}
    // {{{ onReceive

    onReceive: function(message) {

        var me = this;

        me.fireEvent('receive', message);

//        console.log('received a message: ' + JSON.stringify(message));
    },

    // }}}
    // {{{ onMessage

    onMessage: function(e) {

        var me = this;

        me.fireEvent('message', e);

        console.log('message', e.data);
    },

    // }}}
    // {{{ onClose

    onClose: function() {

        var me = this;

        me.fireEvent('close');

        console.log('close');

    },

    // }}}
    // {{{ publish

    publish: function(o) {

        var me = this;

        me.conn.publish(me.addr, o);
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
