import {Button} from 'components/ui/Button';
import 'styles/views/LobbyView.scss';
import {Link,useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {Spinner} from 'components/ui/Spinner';
import React, {useEffect, useState} from 'react';
import {Icon} from '@iconify/react';
import 'styles/views/Code.scss';

import {
    connect,
    getConnection,
    subscribe,
    startGame,
    notifyLobbyJoined, unsubscribe
} from "../../helpers/stompClient";

const LobbyView = () => {
    let userId = localStorage.getItem("userId");
    var [lobby, setLobby] = useState(null);
    let lobbyId = localStorage.getItem("lobbyId");
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));



    useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            subscribeToLobbyInformation();
        } else {
            connect(subscribeToLobbyInformation)
        }

        function subscribeToLobbyInformation() {
            subscribe("/topic/lobbies/" + lobbyId, data => {
                console.log("Inside callback");
                let event = data["event"];
                console.log(data);
                if (event) {
                    if (event.toString() === ("joined").toString()) {
                        console.log("JOINED")
                        setLobby(data);
                    } else if (event.toString() === ("started").toString()) {
                        console.log("STARTED");
                        redirectToGame();
                    }
                } else {
                    console.log("NO EVENT DEFINED!");
                }

            });
            notifyLobbyJoined(lobbyId);
        }

        function redirectToGame() {
            let gameId = lobbyId;
            unsubscribe("/topic/lobbies/" + lobbyId);
            localStorage.setItem("gameId", gameId);
            history.push(`/game/` + lobbyId + "/waitingroom");
        }
    }, [lobbyId, history]);

    function startGameButtonClick() {
        audio.play();
        startGame(lobbyId); // from stompClient
        let gameId = lobbyId;
        unsubscribe("/topic/lobbies/" + lobbyId);
        localStorage.setItem("gameId", gameId);
        history.push(`/game/` + lobbyId + "/waitingroom");    }


    let button_startGame = (<div></div>);
    if ((lobby) && (lobby.hostId.toString() === userId.toString()) && (lobby.playerNames.length >= 2)) {
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
                <ul className="lobby player-list">
                    {lobby.playerNames.map(name => (
                        <li className="lobby player-container">
                            <img
                                src="https://cdn.shopify.com/s/files/1/0535/2738/0144/articles/shutterstock_1290320698.jpg?v=1651099282"
                                style={{
                                    borderRadius: '50%',
                                    height: '7em',
                                    width: '7em',
                                    objectFit: 'cover',
                                }}
                                alt="profile pic"
                            />
                            <div className="lobby player-name">
                                {name}
                            </div>
                        </li>
                    ))
                    }
                </ul>
                {button_startGame}
            </div>
        );
    }

    return (
        <BaseContainer>
            <Link to="/home" className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4rem' }} />
            </Link>
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

