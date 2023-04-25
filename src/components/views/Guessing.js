import React, {useEffect, useRef, useState} from 'react';
import {api, handleError} from 'helpers/api';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Guessing.scss";
import { Icon } from '@iconify/react';
import 'styles/views/SetLocation.scss';
import { Loader } from '@googlemaps/js-api-loader';
import 'styles/views/Code.scss';
import {
    connect,
    getConnection,
    notifyGuess,
    notifyHint, notifyStartTime,
    subscribe
} from "../../helpers/stompClient";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const StreetView = () => {
    const mapRef = useRef(null);
    const location = JSON.parse(localStorage.getItem("location"));

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.YOUR_API_KEY,
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
    }, []);

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
    const playerId = localStorage.getItem("userId");
    const lobbyId = localStorage.getItem("lobbyId");
    const token = localStorage.getItem("token");
    const color = localStorage.getItem("color");

    const history = useHistory();
    const [playerInput, setPlayerInput] = useState(null);
    const [hint, setHint] = useState("");
    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState("");
    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [response, setResponse] = useState("");

    const distributeRole = async () => {
        try {
            const requestBody = JSON.stringify({playerId});
            const response = await api.get('/game/'+lobbyId+'/roleForUser/'+playerId, requestBody, {headers: {Token: token}});
            const role = response.data
            setRole(role);
        }  catch (error) {
            console.log("Couldn't fetch role\n" + handleError(error));
        }

    };

    const makeSubscription = ()  => {
        subscribeToHintInformation();
        subscribeToGuessInformation();
        subscribeToEndRoundInformation();
    }

    useEffect(() => {
        distributeRole();
        displayCurrentRound();
        if (!getConnection()) {
            connect(makeSubscription);
        }
        else {
            makeSubscription();
        }

    }, []);

    const displayCurrentRound = async () => {
        try {
            const response = await api.get('/game/'+lobbyId+'/roundnr/', {headers: {Token: token}});
            const currentRound = response.data["currentRound"];
            const amountOfRounds = response.data["totalRounds"];
            setCurrentRound(currentRound);
            setAmountOfRounds(amountOfRounds);
        }  catch (error) {
            console.log("Couldn't fetch round\n" + handleError(error));
        }

    };


    const submitInput = () => {
        if (role === "SPIER") {
            notifyHint(lobbyId, playerInput);
            console.log("Hint: " + playerInput);
        }else if( role === "GUESSER"){
            notifyGuess(lobbyId, playerId, playerInput);
            console.log("Guess: " + playerInput);
        }
        setPlayerInput("");

    };


    function subscribeToHintInformation() {
        subscribe("/topic/games/" + lobbyId + "/hints",(response) => {
            const h = response["hint"];
            console.log("hint received: " + h );
            setHint(h);
        });

    }


    function subscribeToGuessInformation() {
        subscribe("/topic/games/" + lobbyId + "/guesses",(response) => {
            console.log("Response: " + response);
            const lastUsername = response[response.length -1]["guesserName"]
            const lastGuess = response[response.length - 1]["guess"]
            setUsername(lastUsername)
            setGuess(lastGuess);
            setGuesses(prevGuesses => [...prevGuesses, [lastUsername, lastGuess]]);


        });
    }

    function subscribeToEndRoundInformation() {
        subscribe("/topic/games/" + lobbyId + "/endRound",(response) => {
            console.log(response);
            const m = response["endRoundMessage"];
            console.log("message received" + m);
            setResponse(m);
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
    }

    return (
        <BaseContainer>
            <div className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4rem'}}/>
            </div>
            <div className="base-container ellipse1">
            </div>
            <div className="base-container ellipse2">
            </div>
            <div className="base-container ellipse3">
            </div>
            <div className="base-container ellipse4">
            </div>
            <div className="setlocation container">
                <StreetView />
            </div>
            <div className="guessing rounds">
                Round: {currentRound}/{amountOfRounds}
            </div>
            <div className="guessing time-left">
                {timeLeft}
            </div>
            <div className="guessing role-container">
                <div className="guessing role-text">
                    You're a: {role}
                </div>
            </div>
            <div className="guessing color-text">
                I spy with my little eye something that is...{color}
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
                            disabled={playerInput === "" || guess === "CORRECT"}
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
                    else if (role === "GUESSER"  && guess !== "CORRECT") {
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