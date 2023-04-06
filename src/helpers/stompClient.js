import {Button} from 'components/ui/Button';
import 'styles/views/LobbyView.scss';
import {useHistory, useParams} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useEffect, useState} from 'react';
import {api, handleError} from "../../helpers/api";
import {getDomain} from "./getDomain";

const Stomp = require('@stomp/stompjs');
var ws = null;
var connection = false;
const baseURL = getDomain();

export const connect = (callback) => {
    var socket = new WebSocket(baseURL + "/ws");
    ws = Stomp.overSocket(socket);
    ws.connect({}, function() {
        console.log("Socket was connected.")
        connection = true;
        callback();
        ws.subscribe("/queue/errors", function(message) {
            console.log("Error " + message.body);
        }); // Subscribe to error messages through this
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
    ws.send("/POST/games", {}, requestBody);
}