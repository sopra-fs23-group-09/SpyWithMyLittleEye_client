import React, {useEffect, useRef, useState} from 'react';
import {api, getErrorMessage} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Guessing.scss";
import { Icon } from '@iconify/react';
import 'styles/views/SetLocation.scss';
import { Loader } from '@googlemaps/js-api-loader';
import {
    connect,
    getConnection,
    notifyGuess,
    notifyHint,
    subscribe, unsubscribe
} from "../../helpers/stompClient";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {Alert} from "@mui/material";
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

const StreetView = () => {
    const mapRef = useRef(null);


    useEffect(() => {
        const location = JSON.parse(localStorage.getItem("location"));
        console.log("LOCATION: " + location);
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
        });

        loader.load().then(() => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: {lat: location["lat"], lng: location["lng"]},
                zoom: 18,
                streetViewControl: true,
                fullscreenControl: false,
            });

            const streetView = map.getStreetView();
            streetView.setPosition({ lat: location["lat"], lng: location["lng"]});
            streetView.setVisible(true);
            streetView.setOptions({
                motionTracking: false,
                clickToGo: false,
                motionTrackingControl: false,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: 'none',
                addressControl: false,
                linksControl: false,
                panControl: false,
                enableCloseButton: false,
            });
        });
    },[]);

    return (
        <div
            ref={mapRef}
            style={{ height: '100%', width: '100%' }}
        />
    );
};


////////////////////////////////////////////////////////////////////////////////////////

const FormField = props => {
    return (
        <div className="guessing field">
            <input
                className="guessing input"
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                onKeyDown={e => props.onKeyPress(e)}
            />
        </div>
    );
};

FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
};

////////////////////////////////////////////////////////////////////////////////////////

const Guessing = () => {
    const color = localStorage.getItem("color");
    const playerId = localStorage.getItem("userId");
    const lobbyId = localStorage.getItem("lobbyId");
    const playerUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const duration = localStorage.getItem("duration");
    console.log("DURATION IS: " + duration);
    const role = localStorage.getItem("role");
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));


    let [alert_message, setAlert_Message] = useState(<div className="setlocation alert-message"></div>);
    let [drop_out_alert_message, setDrop_out_alert_message] =
        useState(<div className="guessing drop-out-alert-message"></div>);
    //useState(<Alert className ="lobby drop-out-alert-message" severity="warning" onClose={() => {setDrop_out_alert_message(<div className="lobby drop-out-alert-message"></div>)}}><b>친구</b> has left the game! </Alert>);

    const history = useHistory();

    const [playerInput, setPlayerInput] = useState(null);
    const [hint, setHint] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);
    //const [correctGuessPlayer, setCorrectGuessPlayer] = useState(null);
    const [correctGuess, setCorrectGuess] = useState((localStorage.getItem("guessedCorrectly"))?(localStorage.getItem("guessedCorrectly").toString() === "true") : false);
    const [timeLeft, setTimeLeft] = useState(() => {
        // Retrieve the stored timer value from localStorage,
        // or use the default duration if it doesn't exist
        const storedTime = localStorage.getItem('timeLeft');
        return storedTime ? parseInt(storedTime) : duration * 60;
    });

    console.log("TIME LEFT: " + timeLeft);
    const minutes = Math.floor(timeLeft/ 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const isLast10Seconds = timeLeft <= 10;
    //let [reload, setReload] = useState(0);


    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
    }, [guesses]);

    useEffect(() => {
        // Store the current timer value in localStorage
        localStorage.setItem('timeLeft', timeLeft.toString());

        // Update the stored value whenever the timer changes
    }, [timeLeft]);


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


    useEffect(() => {
        const lobbyId = localStorage.getItem("lobbyId");
        const token = localStorage.getItem("token");
        console.log("TOKEN: " + token);
        const displayCurrentRound = async () => {
            try {
                const response = await api.get('/games/'+lobbyId+'/roundnr/', {headers: {Token: token}});
                const currentRound = response.data["currentRound"];
                const amountOfRounds = response.data["totalRounds"];
                setCurrentRound(currentRound);
                setAmountOfRounds(amountOfRounds);
            }  catch (e) {
                let msg = getErrorMessage(e);
                console.log(msg);
                setAlert_Message(<Alert className ="setlocation alert-message" severity="error"><b>Something went wrong when fetching the data:</b> {msg}</Alert>);
            }
        };

        function subscribeToHintInformation() {
            subscribe("/topic/games/" + lobbyId + "/hints",(response) => {
                const h = response["hint"];
                console.log("hint received: " + h );
                setHint(h);

            });
            unsubscribe("/topic/games/" + lobbyId + "/hints");
        }

        function subscribeToUserDropOut() {
            subscribe("/topic/games/" + lobbyId+ "/userDropOut", data => {
                let username = localStorage.getItem("username");
                console.log(data);
                if (data.name.toString() === username.toString()) { // u're the one dropping out!
                    console.log("I DROPPED OUT???")
                    localStorage.setItem("guessedCorrectly","false");
                    localStorage.removeItem('token');
                    history.push("/start")
                } else if (data.endGame) {
                    unsubscribe("/topic/games/" + lobbyId + "/endRound");
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         redirectToGameOver();
                                                     }}>
                        <b>{data.name}</b> has left the game! The game is over.</Alert>);

                } else if (data.role.toString() === "SPIER") {
                    console.log("SPIER DROPPED OUT")
                    setDrop_out_alert_message(<Alert className="guessing drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         redirectToWaitingRoom();
                                                     }}>
                        <b>The SPIER {data.name}</b> has left the game! </Alert>);
                } else {
                    console.log("USER DROPPED OUT")
                    setDrop_out_alert_message(<Alert className="guessing drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="guessing drop-out-alert-message"></div>);
                                                     }}>
                        <b>{data.name}</b> has left the game! </Alert>);
                }
            });
        }


        function subscribeToGuessInformation() {
            subscribe("/topic/games/" + lobbyId + "/guesses",(response) => {
                console.log("Response: " + response);
                const lastUsername = response[response.length -1]["guesserName"]
                const lastGuess = response[response.length - 1]["guess"]
                const lastCorrect = response[response.length - 1]["correct"]
                setGuesses(prevGuesses => [...prevGuesses, [lastUsername, lastGuess]]);
                if (lastCorrect.toString() === "1") {
                    //setCorrectGuessPlayer(lastUsername);
                    if (lastUsername.toString() === playerUsername.toString()) {
                        setCorrectGuess(true);
                        localStorage.setItem("guessedCorrectly", "true");
                    }
                }
            });
            unsubscribe("/topic/games/" + lobbyId + "/guesses");
        }

        function subscribeToEndRoundInformation() {
            subscribe("/topic/games/" + lobbyId + "/endRound",(response) => {
                unsubscribe("/topic/games/" + lobbyId+ "/userDropOut");
                const cr = response["currentRound"];
                const ar = response["amountOfRounds"];
                console.log("CURRENT ROUND: " + cr);
                console.log("TOTAL AMOUNT OF ROUNDS : " + ar);
                if (cr < ar) {
                    redirectToRoundOver();
                }
                else if(cr === ar) {
                    redirectToGameOver();
                }
            });
            unsubscribe("/topic/games/" + lobbyId + "/endRound");
        }

        function redirectToRoundOver() {
            unsubscribe("/topic/games/" + lobbyId + "/guesses");
            unsubscribe("/topic/games/" + lobbyId + "/hints");
            unsubscribe("/topic/games/" + lobbyId + "/userDropOut");
            unsubscribe("/topic/games/" + lobbyId + "/endRound");
            localStorage.setItem("guessedCorrectly", "false");
            history.push("/game/"+lobbyId+"/rounds/score");
        }
        function redirectToGameOver() {
            unsubscribe("/topic/games/" + lobbyId + "/guesses");
            unsubscribe("/topic/games/" + lobbyId + "/hints");
            unsubscribe("/topic/games/" + lobbyId + "/userDropOut");
            unsubscribe("/topic/games/" + lobbyId + "/endRound");
            localStorage.setItem("guessedCorrectly", "false");
            history.push("/game/" + lobbyId + "/score");
        }

        function redirectToWaitingRoom() {
            unsubscribe("/topic/games/" + lobbyId + "/guesses");
            unsubscribe("/topic/games/" + lobbyId + "/hints");
            unsubscribe("/topic/games/" + lobbyId + "/userDropOut");
            unsubscribe("/topic/games/" + lobbyId + "/endRound");
            localStorage.setItem("guessedCorrectly","false");
            history.push(`/game/` + lobbyId + "/waitingroom");
        }

        const makeSubscription = ()  => {
            subscribeToHintInformation();
            subscribeToGuessInformation();
            subscribeToEndRoundInformation();
            subscribeToUserDropOut();
        }

        displayCurrentRound();
        displayTimer();
        if (!getConnection()) {
            connect(makeSubscription);
        }
        else {
            makeSubscription();
        }

    }, [history, playerUsername]);

    const submitInput = () => {
        if (role === "SPIER") {
            notifyHint(lobbyId, playerInput, token);
            console.log("Hint: " + playerInput);
            setPlayerInput("");
        }else if( role === "GUESSER") {
            //if (correctGuessPlayer === playerUsername) {return;}
            if (correctGuess) {return;}
            notifyGuess(lobbyId, playerId, playerInput, token);
            console.log("Guess: " + playerInput);
            setPlayerInput("");
        }
    }

    const displayTimer = () => {
        const intervalId = setInterval(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    };

    function handleKeyPress(event) {
        if(event.key === "Enter" && playerInput !== "" && !correctGuess){
            submitInput()
        }
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
            <div className="guessing streetview-container">
                <StreetView />
            </div>
            <div className="guessing rounds">
                Round: {currentRound}/{amountOfRounds}
            </div>
            <div className="guessing time-left">
            </div>
            <div className="guessing role-container">
                <div className="guessing role-text">
                    You're a: {role}
                </div>
            </div>
            <div className="guessing color-text">
                I spy with my little eye something that is...{color}
            </div>
            <div className="guessing time-text">
                <span className={`time ${isLast10Seconds ? 'guessing last-10-seconds' : ''}`}>
                    {minutes}:{seconds}
                 </span>
            </div>
            <div className="guessing container">
                <div className="guessing container-guesses" style={{ maxHeight: "55vh", overflowY: "auto"}} ref={containerRef}>
                    {guesses.map(gs => {
                        if (gs[1] === "CORRECT"){
                            return (
                                <div className="guessers correct-container">
                                    <div className="guessers name">
                                        {gs[0]}
                                    </div>
                                    <div className="guessers correct-guess">
                                        GUESSED RIGHT
                                    </div>
                                </div>
                            )
                        }
                        else {

                            return (
                                <div className="guessers wrong-container">
                                    <div className="guessers name">
                                        {gs[0]}
                                    </div>

                                    <div className="guessers wrong-guess" >
                                        {gs[1]}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                  <div className="guessing header-container">
                    <div className="guessing header">
                        Guesses
                    </div>
                    <div className="guessing hint-container">
                        <div className="guessing hint-text">
                            Hint: {hint}
                        </div>
                    </div>
                    <Button className="game-send-button"
                            disabled={playerInput === "" || correctGuess === true}
                            onClick={() => submitInput()}
                    >
                        <div className="guessing send-button-text">
                            Send
                        </div>
                    </Button>
                </div>
                {(() => {
                    let pl ="" ;
                    if (role === "SPIER"){
                        pl = "Enter your hint..."
                    }
                    else if (role === "GUESSER"  && !(correctGuess)) {
                        pl = "Enter your guess..."
                    }
                    return (
                        <FormField
                            placeholder= {pl}
                            value={playerInput}
                            onChange={i => setPlayerInput(i)}
                            onKeyPress={handleKeyPress}
                        />
                    )
                })()}
            </div>
            <div className = "setlocation alert-div">
                {alert_message}
            </div>
            <div className = "guessing drop-out-alert-div">
                {drop_out_alert_message}
            </div>
        </BaseContainer>
    );

};

export default Guessing;