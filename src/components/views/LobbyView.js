import {Button} from 'components/ui/Button';
import 'styles/views/LobbyView.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import {Spinner} from 'components/ui/Spinner';
import React, {useEffect, useState} from 'react';
import Lobby from 'models/Lobby.js';
import {
    connect,
    getConnection,
    subscribe,
    startGame,
    notifyLobbyJoined,
    notifyHint,
    subscribeGame
} from "../../helpers/stompClient";
import User from "../../models/User";

const LobbyView = () => {
    let userId = localStorage.getItem("userId");
    var [lobby, setLobby] = useState(null);
    var rounds = 0;
    var [host, setHost] = useState(null);
    var [users, setUsers] = useState([]);
    let lobbyId = localStorage.getItem("lobbyId");
    const history = useHistory();


    useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            subscribeToLobbyInformation();
        } else {
            connect(subscribeToLobbyInformation)
        }
    }, []);

    function startGameButtonClick() {
        startGame(lobbyId); // from stompClient
        // TODO get gameId
        var gameId = "0";
        localStorage.setItem("gameId", gameId);
        history.push(`/game/` + lobbyId);
    }

    function subscribeToLobbyInformation() {
        subscribe("/topic/lobbies/" + lobbyId, response => {
            console.log("Inside callback");
            //console.log(response)
            setLobby(response);
            lobby = new Lobby(response);
            console.log(lobby)
            // TODO set Users, set Rounds
            // TODO set Host
        });
        notifyLobbyJoined(lobbyId);
    }

    function lobbyViewCallback(response) {
        //console.log("Inside callback");
        console.log(response["accessCode"]);
        setLobby(response);
        lobby = new Lobby(response);
        // TODO set Users, set Rounds
        // TODO set Host
    }

    let button_startGame = (<div></div>);
    if ((host) && (host.id === userId) && (users.length >= 2)) {
        button_startGame = (<Button className="primary-button" onClick={() => startGameButtonClick()}
        >
            <div className="lobby button-text">
                Start game
            </div>
        </Button>)
    }

    let content = <Spinner/>;
    if (lobby) {
        content = (
            <div>
                <div className="lobby lobby-code">
                    <div className="lobby lobby-code-text">
                        Code: {lobby.accessCode}
                    </div>
                </div>
                <div className="lobby rounds-box">
                    <div className="lobby rounds-text">
                        Rounds: {lobby.amountRounds}
                    </div>
                </div>
                <div className="lobby player-amount-container">
                    <div className="lobby player-amount-text">
                        {lobby.playerNames.length}/10
                    </div>
                </div>
                <ul className="lobby">
                    {lobby.playerNames.map(name => (
                        <div className="lobby player-name">
                            {name}
                        </div>
                    ))}
                </ul>

            </div>
        );
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
            {content}
            <div className="lobby lobby-text">
                LOBBY
            </div>
            {button_startGame}
        </BaseContainer>
    );

};

export default LobbyView;

