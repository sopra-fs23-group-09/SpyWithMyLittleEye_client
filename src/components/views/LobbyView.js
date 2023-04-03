import {Button} from 'components/ui/Button';
import 'styles/views/LobbyView.scss';
import {useHistory, useParams} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useEffect, useState} from 'react';
import {api, handleError} from "../../helpers/api";

const Stomp = require('@stomp/stompjs');
var ws = null;
var connected = "Uninstantiated";
function setConnected(connected) {
    if (connected) {
        connected = "Connected";
    } else {
        connected = "Disconnected";
    }

}
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

const LobbyView = () => {
    let userId = localStorage.getItem("id");
    var [lobby, setLobby] = useState(null);
    var [host, setHost] = useState(null);
    var [users, setUsers] = useState(null);
    let lobbyId = localStorage.getItem("lobbyId");
    const history = useHistory();
    const [rounds, setRounds] = useState("");

    useEffect(() => {
        async function fetchData() {
            connect();
            ws.subscribe("/lobbies/" + lobbyId, function(data) {
                setLobby(data);
                setHost(lobby.host);
                setUsers(lobby.users);
                console.log(data);
            })
        }
        fetchData();
    },[lobbyId]);

    function startGame() {
        const requestBody = JSON.stringify({lobbyId});
        ws.send("/POST/games", {}, requestBody);
        history.push(`/register`);
    }

    let button_startGame = (<div></div>);
    if((host.id === userId) && (users.length >= 2)) {
        button_startGame = (<Button className="primary-button"
        >
            <div className="lobby button-text">
                Start game
            </div>
        </Button>)
    }


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
                    Code: {lobby.accessCode}
                </div>
            </div>
            <div className="lobby rounds-box">
                <div className="lobby rounds-text">
                    Rounds: {lobby.rounds}
                </div>
            </div>
            <div className="lobby player-amount-container">
                <div className="lobby player-amount-text">
                    {lobby.users.length}/10
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
            </div>
            {button_startGame}
        </BaseContainer>
    );

};

export default LobbyView;
