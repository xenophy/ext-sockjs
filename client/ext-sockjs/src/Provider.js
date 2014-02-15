/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

// {{{ Ext.sockjs.Provider

/**
 * Ext.sockjs.Provider
 *
 * Copyright (c) 2014 Xenophy.CO.,LTD All rights Reserved.
 * http://www.xenophy.com
 *
 * @abstract
 */
Ext.define('Ext.sockjs.Provider', (function() {

    // {{{ Private Members

    var SockJSConn = false,
        registers = {},
        state, pingInterval, pingTimerID;

    // {{{ onOpen

    function onOpen() {

        var me = this,
            uuid_candidate = uuid(),
            addr = me.addr;

        me.uuid = uuid_candidate;

        if (!registers[addr]) {

            SockJSConn.send(Ext.encode({
                type    : 'register',
                address : addr
            }));

            registers[addr] = true;
        }

        sendPing();
        pingTimerID = setInterval(sendPing, pingInterval);
        state = Ext.sockjs.Provider.OPEN;

        // choose uuid
        sendChooseUUID(addr, uuid_candidate);

    }

    // }}}
    // {{{ sendChooseUUID

    function sendChooseUUID(addr, uuid) {

        SockJSConn.send(Ext.encode({
            type        : 'publish',
            address     : addr,
            body        : {
                type    : 'choose_uuid',
                message : uuid
            }
        }));

    }

    // }}}
    // {{{ onClose

    function onClose() {

        var me = this;

        state = Ext.sockjs.Provider.CLOSED;

        // TODO:setInservalやめる

        // TODO: leaveイベント発火(他のクライアントにいなくなったことがわかるように)

        me.fireEvent('close');
    }

    // }}}
    // {{{ onMessage

    function onMessage(e) {

        var me = this,
            data = Ext.decode(e.data),
            body = data.body,
            msg  = data.message,
            type = body.type,
            addr = data.address;


        if (type === 'set_client_data') {

            // だれかのクライアント情報が更新

            return;
        }

        if (type === 'choose_uuid' || type === 'set_client_data') {
            return;
        }

        if (type === 'decided_uuid') {

            if (body.message === me.uuid) {
                me.fireEvent('open', me.uuid);
            } else {

                // TODO:connect new client!

            }
            return;
        }

        if (type === 'reorder_uuid') {

            var newid = uuid();

            while(newid == body.message) {
                newid = uuid();
            }

            sendChooseUUID(addr, newid);
            return;
        }

        me.fireEvent('data', body);
    }

    // }}}
    // {{{ sendPing

    function sendPing() {

        SockJSConn.send(Ext.encode({
            type: 'ping'
        }));

    }

    // }}}
    // {{{ send

    function send(type, addr, message) {

        SockJSConn.send(Ext.encode({
            type        : type,
            address     : addr,
            body        : {
                type    : type,
                message : message
            }
        }));
    }

    // }}}
    // {{{ uuid

    function uuid(){
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function(a, b) {
                return b = Math.random()*16, (a=="y"?b&3|8:b|0).toString(16)
            })
    }

    // }}}
    // {{{ Public Members

    return {

        // {{{ alias

        alias: 'sockjs.provider',

        // }}}
        // {{{ isProvider

        isProvider: true,

        // }}}
        // {{{ mixins

        mixins: {
            observable: 'Ext.util.Observable'
        },

        // }}}
        // {{{ CONNECTING

        CONNECTING: 0,

        // }}}
        // {{{ OPEN

        OPEN: 1,

        // }}}
        // {{{ CLOSING

        CLOSING: 2,

        // }}}
        // {{{ CLOSED

        CLOSED: 3,

        // }}}
        // {{{ constructor

        constructor: function(config) {

            var me = this;

            Ext.apply(me, config);

            Ext.applyIf(me, {
                id      : Ext.id(null, 'provider-')
            });

            pingInterval = config.pingInterval || 5000;

            state = Ext.sockjs.Provider.CONNECTING;

            me.addEvents(

                /**
                 * @event open
                 * Fires when the Provider open to the websocket connection
                 *
                 * @param {Ext.sockjs.Provider} provider The {@link Ext.sockjs.Provider Provider}.
                 */
                'open',

                /**
                 * @event close
                 * Fires when the Provider close from the websocket connection
                 *
                 * @param {Ext.sockjs.Provider} provider The {@link Ext.sockjs.Provider Provider}.
                 */
                'close',

                /**
                 * @event message
                 * Fires when the Provider receives data from the websocket connection
                 *
                 * @param {Ext.sockjs.Provider} provider The {@link Ext.sockjs.Provider Provider}.
                 * @param {Ext.sockjs.Event} e The Ext.sockjs.Event type that occurred.
                 */
                'message',

                /**
                 * @event exception
                 * Fires when the Provider receives an exception from the websocket connection
                 */
                'exception'
            );

            // Execute {@link Ext.util.Observable} constructor
            me.mixins.observable.constructor.call(me, config);
        },

        // }}}
        // {{{ isConnected

        isConnected: function() {
            return SockJSConn ? true : false;
        },

        // }}}
        // {{{ connect

        connect: function() {

            var me = this;

            if (!SockJSConn) {

                SockJSConn = Ext.apply(new SockJS(me.url), {
                    onopen      : Ext.Function.pass(onOpen, [], me),
                    onmessage   : Ext.Function.pass(onMessage, [], me),
                    onclose     : Ext.Function.pass(onClose, [], me)
                });

            }

        },

        // }}}
        // {{{ send

        send: function(addr, message) {
            send('send', addr, message);
        },

        // }}}
        // {{{ publish

        publish: function(addr, message) {
            send('publish', addr, message);
        },

        // }}}
        // {{{ setClientData

        setClientData: function(uuid, data) {

            var me = this;

            SockJSConn.send(Ext.encode({
                type        : 'publish',
                address     : me.addr,
                body        : {
                    type    : 'set_client_data',
                    message : {
                        uuid: uuid,
                        data: data
                    }
                }
            }));

        }

        // }}}
    }

    // }}}

})());

// }}}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
