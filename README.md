ext-sockjs
==========

SockJS Wrapper Classes for Sencha Ext JS

This project is just using SockJS and Vert.x eventbus on Sencha Ext JS.

beacuse Ext.sockjs.Manager and Ext.sockjs.EventBus is very simple.

Adjust your code as needed.

thx.

## example

    Ext.SockJS.addEventBus({
        url     : 'http://[your SockJS Server addr]:8081/eventbus',
        addr    : 'demo.orderMgr'
    });

    var addr = 'demo.orderMgr',
        eb = Ext.SockJS.get(addr),
        win, lock = false;

    eb.on('receive', function(o) {
        if(!lock) {
            win.suspendEvents(false);
            if(o.x || o.y) {
                win.setPosition(o.x, o.y);
            } else if(o.width || o.height) {
                win.setSize(o.width, o.height);
            }
            win.resumeEvents();
        }
        lock = false;
    });

    this.control({
        'button[action=createwindow]': {
            click: function() {

                win = Ext.widget('window', {
                    itemId: 'hoge',
                    autoShow: true,
                    width: 300,
                    height: 200
                });

                win.on({
                    move: function(win, x, y) {
                        lock = true;
                        eb.publish({
                            x: x,
                            y: y
                        });
                    },
                    resize: function(win, width, height) {
                        lock = true;
                        eb.publish({
                            width: width,
                            height: height
                        });
                    }
                });
            }
        }
    });


