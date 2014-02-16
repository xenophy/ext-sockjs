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

        var provider, uuid, url, addr;

        url     = 'http://localhost:8085/eventbus';
        addr    = 'demo.orderMgr';

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

                                    var data = [];

                                    Ext.iterate(clients, function(key, item) {
                                        item = Ext.decode(item);
                                        data.push({
                                            uuid: key,
                                            name: item.name
                                        });
                                    });

                                    Ext.widget('window', {
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
                                            store: {
                                                fields  : ['uuid', 'name'],
                                                data    : {'items': data},
                                                proxy: {
                                                    type: 'memory',
                                                    reader: {
                                                        type: 'json',
                                                        root: 'items'
                                                    }
                                                }
                                            },
                                            columns: [
                                                { text: 'Name',  dataIndex: 'name' },
                                                { text: 'UUID', dataIndex: 'uuid', flex: 1 }
                                            ],
                                        }],
                                        buttons: [{
                                            text: 'Publish',
                                            handler: function() {

                                                provider.publish('demo.orderMgr', "hogehoge");

                                            }
                                        }]
                                    });
                                });
                            }
                        });
                    },
                    'data': function(e) {
                        console.log(e);
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
