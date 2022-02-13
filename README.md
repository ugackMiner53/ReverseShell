
# ReverseShell
A true javascript reverse shell in NodeJS using Websockets

Inspired by [XSShell](https://github.com/raz-varren/xsshell), this project hosts a NodeJS server which allows you to run arbitrary javascript on connected clients

## Server Setup:
To setup the program, you're going to need the [ws](https://www.npmjs.com/package/ws) package, so download the repository, then run `npm i ws` to install ws. 
Then, simply run `node index.mjs` in order to start the server

##  Client Setup:
To connect the client to the server, simply copy the contents of `exploit.js` or `exploit-min.js`, and change the url from `ws://your.url.goes.here` to your server address. If your server is running over http *(default)*, then the url should use `ws://`. However, if you're using another server or server host that is running over https, you should use `wss://`

## Use:
Once a client connects, the server will start accepting input.
You can use the following commands to affect the server side:
```
exit || q -- exits the console

help || h -- shows a help menu

clear || cls -- clears the console

socket || s -- prints all currently connected sockets

socket (0-9, *) || s (0-9, *) -- specifies the socket to run commands on (* for all sockets)
```
Any input that isn't one of these commands will be sent to the currently selected client as a javascript command.
