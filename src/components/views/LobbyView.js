import {Button} from 'components/ui/Button';
import 'styles/views/LobbyView.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useEffect, useState} from 'react';
import {connect, getConnection, subscribe} from "../../helpers/stompClient";


const LobbyView = () => {
    let userId = localStorage.getItem("id");
    var [lobby, setLobby] = useState(null);
    var [host, setHost] = useState(null);
    var [users, setUsers] = useState(null);
    let lobbyId = localStorage.getItem("lobbyId");
    const history = useHistory();
    const [rounds, setRounds] = useState("");

    useEffect(() => {
        if (getConnection()) {
            subscribeToLobbyInformation();
        } else {
            connect(subscribeToLobbyInformation)
        }
    },[]);

    function startGame() {
        startGame(lobbyId);
        // TODO get gameId
        history.push(`/game/` + 1);
    }

    function subscribeToLobbyInformation() {
        subscribe("/lobbies/" + lobbyId,(data) => {
            setLobby(data);
            setHost(lobby.host);
            setUsers(lobby.users);
            setRounds(lobby.rounds);
            console.log(data);
        });
    }

    let button_startGame = (<div></div>);
    if((host) && (host.id === userId) && (users.length >= 2)) {
        button_startGame = (<Button className="primary-button" onClick = {() => startGame()}
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
            <ul className="game user-list">
                {users.map(user => (
                    <div className="lobby player">
                        <div className="lobby profile-picture">
                        </div>
                        <div className="lobby player-name">
                        user.username
                        </div>
                    </div>
                ))}
            </ul>
            {button_startGame}
        </BaseContainer>
    );

};

export default LobbyView;
