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
      <div className="mute-button" style={{ position: "absolute", top: "3vh", left: "8vw", backgroundColor: "transparent", border: "none" }}>
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
    var [lobby, setLobby] = useState(null);
    var [players, setPlayers] = useState(null);
    var [profilePics, setProfilePics]= useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    let lobbyId = localStorage.getItem("lobbyId");
    let token = localStorage.getItem("token");
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    let counter = -1;

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
                        console.log(data.profilePictures);
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
                  <Icon icon="lucide:clipboard-copy" color="white" style={{ fontSize: '1.75rem' }} />
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
                    {players.map(name =>
                    {   counter++;
                        console.log(profilePics[counter])
                        return (<li className="lobby player-container">
                            <img
                                src= {getProfilePic(profilePics[counter]) /**TODO change from name to profilePic**/}
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
                    )})
                    }
                </ul>
                {button_startGame}
            </div>
        );
    }

    return (
        <BaseContainer>
            <div className="code left-field">
              <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4vw'}}/>
            </div>
            <div className="base-container ellipse1">
            </div>
            <div className="base-container ellipse2">
            </div>
            <div className="base-container ellipse3">
            </div>
            <div className="base-container ellipse4">
            </div>
            <MuteButton audio={audio}/>
            {content}
            <div className="lobby lobby-text">
                LOBBY
            </div>
            {button_startGame}
        </BaseContainer>
    );

};

export default LobbyView;

