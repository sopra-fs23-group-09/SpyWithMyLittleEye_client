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
import {Alert} from "@mui/material";
import {api, getErrorMessage} from "../../helpers/api";
const MuteButton = ({ audio }) => {
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true" || false);

  const handleMuteClick = () => {
    if (isMuted) {
      audio.volume = 1; // Unmute the audio
      audio.muted = false; // Unmute the button sound
    } else {
      audio.volume = 0; // Mute the audio
      audio.muted = true; // Mute the button sound
    }

    setIsMuted(!isMuted);
    localStorage.setItem("isMuted", !isMuted); // Store the updated isMuted state in local storage
  };

  useEffect(() => {
    // Set the initial mute state of the audio and button sound when the component mounts
    audio.volume = isMuted ? 0 : 1;
    audio.muted = isMuted;
  }, [audio, isMuted]);
    return (
      <div className="mute-button" style={{ position: "absolute", top: "92vh", left: "1vw", backgroundColor: "transparent", border: "none" }}>
        <button onClick={handleMuteClick} style={{ backgroundColor: "transparent", border: "none" }}>
                      {isMuted ? (
                        <Icon icon="ph:speaker-slash-bold" color="white" style={{ fontSize: '6vh' }} />
                      ) : (
                        <Icon icon="ph:speaker-high-bold" color="white" style={{ fontSize: '6vh' }} />
                      )}
        </button>
      </div>
    );
  };
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
  async function exitLobby() {
    try {
      const requestBody = JSON.stringify({ token });
      await api.put(`/lobbies/${lobbyId}/exit/${userId}`, requestBody, {
        headers: { Token: token },
      });
      history.push(`/home`);
      audio.play();
    } catch (error) {
      console.error('Exit lobby failed:', error);
      let msg = getErrorMessage(error);
      setDrop_out_alert_message(<Alert className="login alert-message" severity="error"><b>Something went wrong while leaving the lobby :</b> {msg}</Alert>);
    }
  }
    // KEEP ALIVE: to tell if an user has become idle
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (!(localStorage.getItem("intervalId")) && (token)) {

            let intervalId = setInterval(async () => {
                try {
                    await api.put("/users/keepAlive", {}, {headers: {Token: token}})
                    console.log("I am alive!!! " + token)
                } catch (e) {
                    console.log(getErrorMessage(e))
                    history.push("/start");
                }
            }, 2000)
            localStorage.setItem("intervalId", String(intervalId));
            console.log("Localstorage : " + localStorage.getItem("intervalId") + " actual: " + intervalId);
        }
        if ((!(localStorage.getItem("token"))) || (!(localStorage.getItem("username")))) { // ure dropped out?
            console.log("I don't have the info anymore!!!!")
            history.push("/start");
        }
    }, [history])

    useEffect(() => {
        if (!(localStorage.getItem("lobbyId"))) {
            setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                             onClose={() => {
                                                 setDrop_out_alert_message(<div
                                                     className="lobby drop-out-alert-message"></div>);
                                                 unsubscribe("/topic/lobbies/" + lobbyId);
                                                 unsubscribe("/topic/games/" + lobbyId+ "/userDropOut");
                                                 history.push("/code");
                                             }}>
                Are you sure you entered the code for a lobby?</Alert>);
        }
    }, [history, lobbyId]);


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
                        console.log(username)
                        setHostId(data.hostId);
                        setPlayers(data.playerNames);
                        setProfilePics(data.profilePictures);
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
                console.log(data.name)
                console.log(data.name.toString() === username.toString())
                if (data.name.toString() === username.toString()) { // u're the one dropping out!
                    console.log("BYEE")
                    localStorage.removeItem('token');
                    history.push("/start")

                } else {
                    if (data.host) {
                        console.log("HOST DROPPED OUT")
                        setHostId(data.newHostId);
                        setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                         onClose={() => {
                                                             setDrop_out_alert_message(<div
                                                                 className="lobby drop-out-alert-message"></div>);
                                                         }}>
                            <b>{data.name}</b> has left the game! A new host has been assigned. </Alert>);
                    } else if (data.endGame) {
                        setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                         onClose={() => {
                                                             setDrop_out_alert_message(<div
                                                                 className="lobby drop-out-alert-message"></div>);
                                                             unsubscribe("/topic/lobbies/" + lobbyId);
                                                             unsubscribe("/topic/games/" + lobbyId+ "/userDropOut");
                                                             history.push("/game/"+lobbyId+"/score");
                                                         }}>
                            <b>{data.name}</b> has left the game! The game is over.</Alert>);
                    } else {
                        console.log("USER DROPPED OUT")
                        setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                         onClose={() => {
                                                             setDrop_out_alert_message(<div
                                                                 className="lobby drop-out-alert-message"></div>);
                                                         }}>
                            <b>{data.name}</b> has left the game! </Alert>);
                    }
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
    }, [lobbyId, history, token, username, hostId]);

    function startGameButtonClick() {
        try {
            audio.play();
        } catch (e) {
            console.log("Failed to play sound.")
        }

        startGame(lobbyId, token); // from stompClient
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
                  <Icon icon="lucide:clipboard-copy" color="white" style={{ fontSize: '1.5vw' }} />
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
                                    src={getProfilePic(profilePics[counter])}
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
            <Button className="lobby exit-lobby"  onClick={() => exitLobby()}>
                            <div className="lobby exit-text">
                            <Icon icon="majesticons:door-exit-line" color="white" />
                            </div>
                        </Button>
            <MuteButton audio={audio}/>
            {content}
            <div className="lobby lobby-text">
                LOBBY
            </div>
            <div className="lobby drop-out-alert-div">
                {drop_out_alert_message}
            </div>

        </BaseContainer>
    );

};

export default LobbyView;

