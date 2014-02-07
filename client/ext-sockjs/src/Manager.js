/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ Ext.sockjs.Manager

/**
 * Ext.sockjs.Manager
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 */
Ext.define('Ext.sockjs.Manager', {

    // {{{ extend

    extend: 'Ext.AbstractManager',

    // }}}
    // {{{ requires

    requires: [
        'Ext.util.MixedCollection',
        'Ext.sockjs.EventBus'
    ],

    // }}}
    // {{{ mixins

    mixins: {
        observable: 'Ext.util.Observable'
    },

    // }}}
    // {{{ singleton

    singleton: true,

    // }}}
    // {{{ constructor

    constructor: function() {

        var me = this;

        me.eventbuses = new Ext.util.MixedCollection();

        me.mixins.observable.constructor.call(me);
    },

    // }}}
    // {{{ addEventBus

    addEventBus: function(config) {

        var me = this;

        config = config || {};

        Ext.applyIf(config, {
            url: '',
            addr: ''
        });

        me.eventbuses.add(
            config.addr,
            Ext.create('Ext.sockjs.EventBus', config)
        );
    },

    // }}}
    // {{{ get

    get: function(name) {

        var me = this;

        return me.eventbuses.get(name);
    }

    // }}}

}, function() {

    Ext.SockJS = Ext.sockjs.Manager;

});

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
