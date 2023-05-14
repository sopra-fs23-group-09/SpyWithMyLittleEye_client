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
import {Alert} from "@mui/material";

const LobbyView = () => {
    let userId = localStorage.getItem("userId");
    let username = localStorage.getItem("username");
    var [lobby, setLobby] = useState(null);
    var [players, setPlayers] = useState(null);
    var [profilePics, setProfilePics] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    let [hostId, setHostId] = useState(null);
    let lobbyId = localStorage.getItem("lobbyId");
    let token = localStorage.getItem("token");
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    let [drop_out_alert_message, setDrop_out_alert_message] =
        useState(<div className="lobby drop-out-alert-message"></div>);
    //useState(<Alert className ="lobby drop-out-alert-message" severity="warning" onClose={() => {setDrop_out_alert_message(<div className="lobby drop-out-alert-message"></div>)}}><b>친구</b> has left the game! </Alert>);

    let counter = -1;

    let [reload, setReload] = useState(0);

    // KEEP ALIVE: to tell if an user has become idle
    useEffect(() => {
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

    /**
     useEffect( () => {
    window.location.reload(true)
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
    }, [lobby])**/


    useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            makeSubscription();
        } else {
            connect(makeSubscription);
        }

        function makeSubscription() {
            subscribeToLobbyInformation()
            subscribeToUserDropOut();
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
                        setHostId(data.hostId);
                        setPlayers(data.playerNames);
                        setProfilePics(data.profilePictures);
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

        }

        // Be notified if someone drops out if they close the tab / browser
        function subscribeToUserDropOut() {
            subscribe("/topic/games/" + lobbyId + "/userDropOut", data => {
                console.log(data);
                if (data.name.toString() === username.toString()) { // u're the one dropping out!
                    history.push("/start")
                }
                if ((hostId) && data.host) {
                    console.log("HOST DROPPED OUT")
                    setHostId(data.newHostId);
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                     }}>
                        <b>{data.name}</b> has left the game! A new host has been assigned. </Alert>);
                } else {
                    console.log("USER DROPPED OUT")
                    setReload(reload+1);
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                     }}>
                        <b>{data.name}</b> has left the game! </Alert>);
                }
            });
        }

        function redirectToGame() {
            let gameId = lobbyId;
            unsubscribe("/topic/lobbies/" + lobbyId);
            unsubscribe("/topic/games/" + lobbyId + "/userDropOut");
            localStorage.setItem("gameId", gameId);
            history.push(`/game/` + lobbyId + "/waitingroom");
        }
    }, [lobbyId, history, token, username, reload, hostId]);

    function startGameButtonClick() {
        audio.play();
        startGame(lobbyId, token); // from stompClient
        // TODO DUplicate code
        let gameId = lobbyId;
        unsubscribe("/topic/lobbies/" + lobbyId);
        unsubscribe("/topic/games/" + lobbyId + "/userDropOut");
        localStorage.setItem("gameId", gameId);
        history.push(`/game/` + lobbyId + "/waitingroom");
    }


    let button_startGame = (<div></div>);
    if ((lobby) && (hostId) && (hostId.toString() === userId.toString()) && (lobby.playerNames.length >= 2)) {
        button_startGame = (<Button className="primary-button" onClick={() => startGameButtonClick()}
        >
            <div className="lobby button-text">
                Start game
            </div>
        </Button>)
    }
    const handleCopyClick = () => {
        navigator.clipboard.writeText(lobby.accessCode)
            .then(() => setCopySuccess(true))
            .catch((error) => console.error('Failed to copy:', error));
    };
    useEffect(() => {
        let timeoutId;
        if (copySuccess) {
            timeoutId = setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        }

        return () => clearTimeout(timeoutId);
    }, [copySuccess]);

    let content = <Spinner/>;
    if (lobby && players && profilePics) {
        content = (
            <div>
                <div className="lobby lobby-code">
                    <button className="icon-button" onClick={handleCopyClick}>
                        <Icon icon="lucide:clipboard-copy" color="white" style={{fontSize: '1.75rem'}}/>
                    </button>
                    <div className="lobby lobby-code-text">
                        Code: {lobby.accessCode}
                    </div>
                    {copySuccess && <div className="lobby success-message">Copied successfully!</div>}

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
                    {players.map(name => {
                        counter++;
                        return (<li className="lobby player-container">
                                <img
                                    src={getProfilePic(profilePics[counter]) /**TODO change from name to profilePic**/}
                                    style={{
                                        borderRadius: '50%',
                                        height: '6.5vw',
                                        width: '6.5vw',
                                        objectFit: 'cover',
                                    }}
                                    alt="profile pic"
                                />
                                <div className="lobby player-name">
                                    {name}
                                </div>
                            </li>
                        )
                    })
                    }
                </ul>
                {button_startGame}
            </div>
        );
    }

    return (
        <BaseContainer>
            <div className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{fontSize: '4vw'}}/>
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
            <div className="lobby drop-out-alert-div">
                {drop_out_alert_message}
            </div>
        </BaseContainer>
    );

};

export default LobbyView;

