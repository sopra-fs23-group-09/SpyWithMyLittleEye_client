import 'styles/views/LobbyView.scss';
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
        callback(JSON.parse(data.body)); // This is already the body!!!
    });
}

export const unsubscribe = (mapping) => {
    ws.unsubscribe(mapping, function (data) {});
}
export let getConnection = () => connection;

export const disconnect = () => {
    if (ws != null) ws.disconnect();
    connection = false
    console.log("Disconnected websocket.");
}

export const startGame = (lobbyId, token) => {
    const requestBody = JSON.stringify({lobbyId});
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/games/" + lobbyId, headers, requestBody);
}

export const notifyLobbyJoined = (lobbyId, token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/lobbies/"+lobbyId+"/joined", headers);
}
export const notifySpiedObject = (lobbyId, location, color, object, token) =>{
    const requestBody = JSON.stringify({location, color, object});
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/games/" +lobbyId+"/spiedObject", headers, requestBody);
}

export const notifyHint = (lobbyId, hint, token) => {
    const requestBody = JSON.stringify({hint});
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/games/"+lobbyId+"/hints", headers, requestBody);
}

export const notifyGuess = (lobbyId, id, guess, token) => {
    const requestBody = JSON.stringify({id, guess});
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/games/"+lobbyId+"/guesses", headers, requestBody);
}

export const notifyStartTime = (lobbyId) => {
    ws.send("/app/games/"+lobbyId+"/startRound", {});
}

export const notifyNextRoundButtonClicked = (gameId, token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/games/"+gameId+"/nextRound", headers);
}

export const notifyGameEndedButtonClicked = (gameId, token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    ws.send("/app/games/"+gameId+"/gameOver", headers);
}