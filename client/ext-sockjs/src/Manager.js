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
        'Ext.util.MixedCollection'
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

        me.providers = new Ext.util.MixedCollection();

        me.mixins.observable.constructor.call(me);
    },

    // }}}
    // {{{ addProvider

    addProvider: function(provider) {

        var me          = this,
            args        = arguments,
            relayers    = me.relayers || (me.relayers = {}),
            i, len;

        if (args.length > 1) {
            for (i = 0, len = args.length; i < len; ++i) {
                me.addProvider(args[i]);
            }

            return;
        }

        Ext.applyIf(provider, {
            type    : '',
            url     : 'ws://127.0.0.1:80/my_prefix'
        });

        // if provider has not already been instantiated
        if (!provider.isProvider) {
            provider = Ext.create('Ext.sockjs.' + provider.type + 'Provider', provider);
        }

        me.providers.add(provider);
        provider.on('message', me.onProviderData, me);

        if (provider.relayedEvents) {
            relayers[provider.id] = me.relayEvents(provider, provider.relayedEvents);
        }

        if (!provider.isConnected()) {
            provider.connect();
        }

        return provider;

    },

    // }}}
    // {{{ getProvider

    getProvider: function(id) {
        return id.isProvider ? id : this.providers.get(id);
    },

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
