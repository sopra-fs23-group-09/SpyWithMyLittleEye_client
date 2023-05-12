import React, {useEffect, useRef, useState} from 'react';
import {api, handleError} from 'helpers/api';
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
            />
        </div>
    );
};

FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
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
//    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
 //   const [audio2] = useState(new Audio('https://drive.google.com/uc?export=download&id=1ydNFfCdRiPYINcTpu5LiccoTy0SJKz-Z'));
 //   const [playedCorrectAudio, setPlayedCorrectAudio] = useState(false);

    const history = useHistory();

    const [playerInput, setPlayerInput] = useState(null);
    const [hint, setHint] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);
    const [correctGuessPlayer, setCorrectGuessPlayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    console.log("TIME LEFT: " + timeLeft);
    const minutes = Math.floor(timeLeft/ 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const isLast10Seconds = timeLeft <= 10;

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
            }  catch (error) {
                console.log("Couldn't fetch round\n" + handleError(error));
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
                alert("Someone dropped out!");
                console.log(data);
                // go to waiting room, abort round

            });
        }

        function subscribeToGuessInformation() {
            subscribe("/topic/games/" + lobbyId + "/guesses",(response) => {
                console.log("Response: " + response);
                const lastUsername = response[response.length -1]["guesserName"]
                const lastGuess = response[response.length - 1]["guess"]
                setGuesses(prevGuesses => [...prevGuesses, [lastUsername, lastGuess]]);
                if (lastGuess === "CORRECT") {
                    setCorrectGuessPlayer(lastUsername);
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
                    console.log("ENTER HERE WHEN TIME IS UP OR ALL GUESSED CORRECTLY");
                    history.push("/game/"+lobbyId+"/rounds/score");
                }
                else if(cr === ar) {
                    console.log("ENTER HERE WHEN GAME IS OVER");
                    history.push("/game/"+lobbyId+"/score");
                }
            });
            unsubscribe("/topic/games/" + lobbyId + "/endRound");
        }

        /*function subscribeToTimeInformation() {
            subscribe("/topic/games/" + lobbyId + "/spiedObject",(response) => {
                const d = response["duration"];
                setTimeLeft(d * 60);


            });
            unsubscribe("/topic/games/" + lobbyId + "/spiedObject");
        }*/

        const makeSubscription = ()  => {
            subscribeToHintInformation();
            subscribeToGuessInformation();
            subscribeToEndRoundInformation();
            subscribeToUserDropOut();
            //subscribeToTimeInformation();
        }

        displayCurrentRound();
        displayTimer();
        if (!getConnection()) {
            connect(makeSubscription);
        }
        else {
            makeSubscription();
        }

    }, [history]);

    const submitInput = () => {
        if (role === "SPIER") {
            notifyHint(lobbyId, playerInput, token);
            console.log("Hint: " + playerInput);
            setPlayerInput("");
        }else if( role === "GUESSER") {
            if (correctGuessPlayer === playerUsername) {
                return;
            }
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
    }

    //Implementation to display timer in seconds
    /*useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((time) => time - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);*/

    /*useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);*/

    /*const formatTime = (time) => {
        return `${Math.floor(time / 60)
            .toString()
            .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;
    }*/


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
                <div className="guessing container-guesses" style={{ maxHeight: "1000px", overflowY: "auto" }}>
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

                                    <div className="guessers wrong-guess">
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
                    else if (role === "GUESSER"  && correctGuessPlayer !== playerUsername) {
                        pl = "Enter your guess..."
                    }
                    return (
                        <FormField
                            placeholder= {pl}
                            value={playerInput}
                            onChange={i => setPlayerInput(i)}
                        />
                    )
                })()}
            </div>
        </BaseContainer>
    );

};

export default Guessing;