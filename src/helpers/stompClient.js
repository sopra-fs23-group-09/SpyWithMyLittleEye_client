import 'styles/views/LobbyView.scss';
import React, {useEffect, useState} from 'react';
import {getDomain} from "./getDomain";
import {over} from "stompjs";
import SockJS from "sockjs-client";



//const Stomp = require('@stomp/stompjs');
var ws = null;
var socket = null;
var connection = false;
const baseURL = getDomain();

export var connect = (callback) => {
    socket = new SockJS(baseURL+"/ws");
    ws = over(socket);
    ws.connect({}, () => {
        connection = true;
        callback();
       /* ws.subscribe("/queue/errors", function(message) {
            console.log("Error " + message.body);
        }); // Subscribe to error messages through this*/
    });
    ws.onclose = reason => {
        connection = false;
        console.log("Socket was closed, Reason: " + reason);
    }
}
export let subscribe = (mapping, callback) => {
    ws.subscribe(mapping, data => callback(data));
}
export let getConnection = () => connection;

function disconnect() {
    if (ws != null) ws.disconnect();
    connection = "Disconnected"
    console.log("Disconnected websocket.");
}

export const startGame = (lobbyId) => {
    const requestBody = JSON.stringify({lobbyId});
    ws.send("/app/POST/games", {}, requestBody);
}

export const notifyLobbyJoined = (lobbyId) => {
    const requestBody = JSON.stringify({lobbyId});
    ws.send("/app/lobbies/"+lobbyId+"/joined", {});
}