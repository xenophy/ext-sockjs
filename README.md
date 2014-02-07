ext-sockjs
==========

SockJS Wrapper Classes for Sencha Ext JS

This project is just using SockJS and Vert.x eventbus on Sencha Ext JS.

beacuse Ext.sockjs.Manager and Ext.sockjs.EventBus is very simple.

Adjust your code as needed.

thx.

## Execute Sample

If you already installed **Sencha Cmd**, you can use below command.

    sencha web -port 8080 start

At first, please change to **client** directory, after you should do above command and you can see below URL.

    http://localhost:8080/

Secondly, you should do SockJS Server on your desktop.
please change to **client** directory, after you should do below command.

    vert run app.js

app.js will provide sockjs server features using port 8085.


## TODO

* Implement: auto re-connect
* Implement: pseudo-broadcast(using publish method);



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


