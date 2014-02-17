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


