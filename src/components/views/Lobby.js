import {Button} from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, { useState } from 'react';

const Stomp = require('@stomp/stompjs');
var ws = null;

function connect() {
    var socket = new WebSocket("ws://localhost:8008/greetings");
    ws = Stomp.overSocket(socket);

    ws.connect({}, function(frame) {
        setConnected(true);
        console.log("Connected: "+frame);
        ws.subscribe("/greetings/reply", function(message) {
            console.log(JSON.parse(message.body).content);
        })
        ws.subscribe("/queue/errors", function(message) {
            alert("Error " + message.body);
        }); // Subscribe to error messages through this
    }, function(error) {
        alert("STOMP error " + error)
    });

}

function disconnect() {
    if (ws != null) ws.disconnect();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    ws.send("/app/hello", {}, JSON.stringify({"name": $("#name").val()}));
}

const Lobby = () => {
    const history = useHistory();
    const [rounds, setRounds] = useState("");



    return (
        <BaseContainer>
            <div className="base-container ellipse1">
            </div>
            <div className="base-container ellipse2">
            </div>
            <div className="base-container ellipse3">
            </div>
            <div className="base-container ellipse4">
            </div>
            <div className="lobby lobby-code">
                <div className="lobby lobby-code-text">
                    Code:
                </div>
            </div>
            <div className="lobby rounds-box">
                <div className="lobby rounds-text">
                    Rounds:
                </div>
            </div>
            <div className="lobby player-amount-container">
                <div className="lobby player-amount-text">
                    ?/10
                </div>
            </div>
            <div className="lobby lobby-text">
                LOBBY
            </div>
            <div className="lobby player">
                <div className="lobby profile-picture">
                </div>
                <div className="lobby player-name">
                    PlayerName
                </div>
                <div>
                    <p>WebSocket status: {readyState}</p>
                    <p>Last message: {lastMessage && lastMessage.data}</p>
                    <button onClick={handleMessageSend}>Send message</button>
                </div>
            </div>
            <Button className="primary-button"
            >
                <div className="lobby button-text">
                    Start game
                </div>
            </Button>
        </BaseContainer>
    );

};

export default Lobby;
