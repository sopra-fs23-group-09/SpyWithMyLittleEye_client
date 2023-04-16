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
        ws.subscribe('/topic/greetings', function (greeting) {
            console.log(JSON.parse(greeting.body).content);
            console.log("Socket was connected.")
        });
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
export const subscribe = (mapping, callback) => {
    ws.subscribe(mapping, function (data) {
       // console.log("Inside subscribe")
        //console.log(JSON.parse(data.body));
        callback(JSON.parse(data.body));
    });
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
    ws.send("/app/lobbies/"+lobbyId+"/joined", {});
}

export const notifyRole = (lobbyId, playerId) => {
    ws.send("/app/game/"+"1"+"/round/"+"1", {});
}

export const notifyHint = (lobbyId, hint) => {
    const requestBody = JSON.stringify({hint});
    ws.send("/app/game/"+lobbyId+"/hints", {}, requestBody);
}

export const notifyGuess = (lobbyId, playerId, guess) => {
    const requestBody = JSON.stringify({playerId, guess});
    ws.send("/app/game/"+lobbyId+"/guesses", {}, requestBody);
}
