/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ Ext.sockjs.VertxBusProvider

/**
 * Ext.sockjs.VertxBusProvider
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
Ext.define('Ext.sockjs.VertxBusProvider', {

    // {{{ extend

    extend: 'Ext.sockjs.Provider',

    // }}}
    // {{{ constructor

    constructor: function(config) {

        var me = this;

        Ext.apply(me, config);

        /*
        Ext.applyIf(me, {
            id      : Ext.id(null, 'eventbus-'),
            conn    : new vertx.EventBus(config.url)
        });
        console.dir(me.conn);

        // イベントハンドラ設定
        Ext.apply(me.conn, {
            onopen      : Ext.Function.pass(me.onOpen, [], me),
            onclose     : Ext.Function.pass(me.onClose, [], me)
        });
       */

        // 親クラスコンストラクタ実行
        me.callParent(arguments);
    },

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
