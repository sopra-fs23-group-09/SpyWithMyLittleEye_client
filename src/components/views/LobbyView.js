import {Button} from 'components/ui/Button';
import 'styles/views/LobbyView.scss';
import {useHistory} from "react-router-dom";
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
import {getProfilePic} from "../../helpers/utilFunctions";
import {api} from "../../helpers/api";

const LobbyView = () => {
    let userId = localStorage.getItem("userId");
    var [lobby, setLobby] = useState(null);
    var [players, setPlayers] = useState(null);

    let lobbyId = localStorage.getItem("lobbyId");
    let token = localStorage.getItem("token");
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    // KEEP ALIVE: to tell if an user has become idle
    useEffect(()=>{
        if (!(localStorage.getItem("intervalId"))) {
            let token = localStorage.getItem("token");

            let intervalId = setInterval(async () => {
                try {
                    await api.put("/users/keepAlive", {}, {headers: {Token: token}})
                    console.log("I am alive!!! " + token)
                } catch (e) {
                    history.push("/start");
                }
            }, 2000)
            localStorage.setItem("intervalId", String(intervalId));
            console.log("Localstorage : " + localStorage.getItem("intervalId") + " actual: " + intervalId);
        }
    }, [history])

    useEffect( () => {
        // ignore this for now, ill use this to remove someone from the lobby in the callback for userDropOut
        let username = "ff";
        if (lobby && lobby.playerNames && lobby.playerNames.includes(username)) {
            const index = lobby.playerNames.indexOf(username) ;
            if (index > -1) {
                console.log("removing")
               // lobby.playerNames = lobby.playerNames.filter(e => e !== username);
                setPlayers(lobby.playerNames)
                console.log(lobby.playerNames)
            }
        }
    }, [lobby])


    useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            subscribeToLobbyInformation();
        } else {
            connect(subscribeToLobbyInformation)
        }

        // Get information if someone new joins, or the host starts the game
        function subscribeToLobbyInformation() {
            subscribe("/topic/lobbies/" + lobbyId, data => {
                console.log("Inside callback");
                let event = data["event"];
                console.log(data);
                if (event) {
                    if (event.toString() === ("joined").toString()) {
                        console.log("JOINED")
                        setLobby(data);
                        setPlayers(data.playerNames);
                        // TODO set profile pictures!!!!!
                    } else if (event.toString() === ("started").toString()) {
                        console.log("STARTED");
                        redirectToGame();
                    }
                } else {
                    console.log("NO EVENT DEFINED!");
                }

            });

            notifyLobbyJoined(lobbyId, token);
            subscribeToUserDropOut();

        }

        // Be notified if someone drops out if they close the tab / browser
        function subscribeToUserDropOut() {
            subscribe("/topic/games/" + lobbyId+ "/userDropOut", data => {
                alert("Someone dropped out!");
                console.log(data);

                /**
                // Remove this person from the lobby
                let username = "ff";
                if (players&& players.includes(username)) {
                    const index = players.indexOf(username) ;
                    if (index > -1) {
                        console.log("removing")
                        // lobby.playerNames = lobby.playerNames.filter(e => e !== username);
                        setPlayers(players)
                        console.log(players)
                    }
                }**/
            });
        }

        function redirectToGame() {
            let gameId = lobbyId;
            unsubscribe("/topic/lobbies/" + lobbyId);
            unsubscribe("/topic/games/" + lobbyId+ "/userDropOut");
            localStorage.setItem("gameId", gameId);
            history.push(`/game/` + lobbyId + "/waitingroom");
        }
    }, [lobbyId, history, token]);

    function startGameButtonClick() {
        audio.play();
        startGame(lobbyId, token); // from stompClient
        // TODO DUplicate code
        let gameId = lobbyId;
        unsubscribe("/topic/lobbies/" + lobbyId);
        unsubscribe("/topic/games/" + lobbyId+ "/userDropOut");
        localStorage.setItem("gameId", gameId);
        history.push(`/game/` + lobbyId + "/waitingroom");
    }



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
    if (lobby && players) {
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
                    {players.map(name => (
                        <li className="lobby player-container">
                            <img
                                src= {getProfilePic(name) /**TODO change from name to profilePic**/}
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
            <div class="code left-field">
              <Icon icon="ph:eye-closed-bold" color="white"style={{ fontSize: '4rem'}}/>
            </div>
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

