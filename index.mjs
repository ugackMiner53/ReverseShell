import { readFileSync } from 'fs';
import WebSocket, { WebSocketServer } from 'ws';
import * as readline from "readline";

const wss = new WebSocketServer({ port: 80 });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.clear();
console.log("Running ")
console.log("Waiting for connection...");

var sockets = [];
var currentSocket = null;

wss.on('connection', function connection(ws, req) {
    sockets.push(ws);
    ws.name = sockets.length - 1;
    if (sockets.length === 1) {
        currentSocket = ws;
        console.clear();
        userInput();
    }
    console.log('\x1b[33m%s\x1b[0m', "Connected to client " + req.socket.remoteAddress.replace("::ffff:", "")  + " with a socket ID of " + (sockets.length - 1));
    ws.on('message', function message(data) {
        console.log('\x1b[36m%s\x1b[0m', "Socket " + ws.name + ": " + data.toString());
    });
    ws.on('close', function closed() {
        // Needs to be able to get the socket from the list of sockets and set it to null or smth
        console.log('\x1b[33m%s\x1b[0m', "Socket " + ws.name + " disconnected");
    })
});

var userInput = function () {
    rl.question('', (value) => {
        if (value === "exit" || value === "q") {
            process.exit(1);
        }
        else if (value === "help" || value === 'h') 
        {
            console.log(` Commands:
            exit || q  --  exits the console
            help || h  --  shows this help menu
            clear || cls  -- clears the console
            socket || s  --  prints all currently connected sockets
            socket (0-9, *) || s (0-9, *)  --  specifies the socket to run commands on (* for all sockets)
            `)
        }
        else if (value === "s" || value === "socket") 
        {
            // Change to a ternary operator between OPEN and CLOSED (not 1 and 3)
            sockets.forEach(socket => {
                console.log("Socket " + socket.name + ": " + ((socket.readyState === 1) ? "OPEN" : "CLOSED"));
            });
        }
        else if (value.startsWith("s ") || value.startsWith("socket ")) {
            try {
                let newSocket = value.split(" ")[1];
                if (newSocket === '*') 
                {
                    currentSocket = '*';
                    console.log("Switched to all connected sockets");
                }
                else if (parseInt(newSocket) >= sockets.length) 
                {
                    throw "Socket specified is outside the bounds of the array!";
                }
                else {
                    currentSocket = sockets[parseInt(newSocket)];
                    console.log("Switched to socket " + newSocket + " on page " + currentSocket.name);
                }   
            }
            catch (error) 
            {
                console.error("Invalid socket number or malformed command: " + error);
            }
        }
        else if (value === "cls" || value === "clear") 
        {
            console.clear();
        }
        else if (currentSocket === '*') 
        {
            sockets.forEach(socket => {
                socket.send(value);
            });
        }
        else {
            currentSocket.send(value);
        }
        userInput();
    });
}