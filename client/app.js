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

        var provider, uuid, url, addr, win;

        url     = 'http://localhost:8085/eventbus';
        addr    = 'demo.orderMgr';

        var store = Ext.create('Ext.data.Store', {
            storeId: 'clients',
            fields  : ['uuid', 'name'],
            data    : {'items': []},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });

        Ext.Msg.prompt('Name', 'Please enter your name:', function(btn, text) {

            if (btn == 'ok') {

                provider = Ext.SockJS.addProvider({
                    url     : url,
                    addr    : addr
                });

                provider.on({
                    'open': function(newid) {

                        uuid = newid;

                        // set client data on server side Shared Data.
                        provider.setClientData(uuid, {name: text}, function(success) {

                            if (success) {

                                // get currenly connected clients.
                                provider.getClients(function(clients) {

                                    var data = [],
                                        store = Ext.data.StoreManager.lookup('clients');

                                    Ext.iterate(clients, function(key, item) {
                                        item = Ext.decode(item);
                                        data.push({
                                            uuid: key,
                                            name: item.name
                                        });
                                    });

                                    store.loadData(data);

                                    win = Ext.widget('window', {
                                        title: 'ext-sockjs messanger',
                                        width: 500,
                                        height: 350,
                                        autoShow: true,
                                        layout: 'border',
                                        items: [{
                                            xtype: 'grid',
                                            padding: 5,
                                            region: 'center',
                                            autoScroll: true,
                                            store: store,
                                            columns: [
                                                { text: 'Name',  dataIndex: 'name' },
                                                { text: 'UUID', dataIndex: 'uuid', flex: 1 }
                                            ],
                                        }, {
                                            xtype: 'textarea',
                                            padding: 5,
                                            region: 'south',
                                            name: 'message',
                                            height: 100
                                        }],
                                        buttons: [{
                                            text: 'Send',
                                            handler: function() {

                                                //provider.publish('demo.orderMgr', "hogehoge");

                                                provider.broadcast('demo.orderMgr', "Broadcast Message!");

                                            }
                                        }]
                                    });
                                });
                            }
                        });
                    },
                    'close': function() {

                        alert('Disconnected server. Please reload this page.');
                        win.close();

                    },
                    'addclient': function(uuid) {

                        var store = Ext.data.StoreManager.lookup('clients');

                        store.add({
                            name: 'Unknown',
                            uuid: uuid
                        });
                    },
                    'updateclient': function(data) {

                        var store = Ext.data.StoreManager.lookup('clients'),
                            uuid = data.uuid,
                            name = data.data.name,
                            find;

                        find = store.getAt(store.find('uuid', uuid));

                        if (find) {
                            find.set({
                                'name': name
                            });
                        }
                    },
                    'data': function(e) {
                    }
                });
            }
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
