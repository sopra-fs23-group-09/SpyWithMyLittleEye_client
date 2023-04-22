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

const StreetView = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.YOUR_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: {lat: 47.373944, lng: 8.537667 },
        zoom: 18,
        streetViewControl: true,
        fullscreenControl: false,
      });

      const streetView = map.getStreetView();
      streetView.setPosition({ lat: 47.373944, lng: 8.537667 });
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

const Guessing = () => {
    const playerId = localStorage.getItem("userId");
    const lobbyId = localStorage.getItem("lobbyId");
    const token = localStorage.getItem("token");

    //console.log("Lobby ID: " + lobbyId);
    //console.log("Player ID: " + playerId);
    //console.log("Token: " + token);

    const [inputHint, setInputHint] = useState("");
    const [inputGuess, setInputGuess] = useState("");
    const [hint, setHint] = useState("");
    const [guess, setGuess] = useState("");

    const [role, setRole] = useState("");

    const [username, setUsername] = useState("");

    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);

    const [timeLeft, setTimeLeft] = useState("");

    const distributeRole = async () => {
        try {
            const requestBody = JSON.stringify({playerId});
            const response = await api.get('/game/'+lobbyId+'/roleForUser/'+playerId, requestBody, {headers: {Token: token}});
            const role = response.data
            setRole(role);
        }  catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }

    };

    const displayCurrentRound = async () => {
        try {
            const response = await api.get('/game/'+lobbyId+'/roundnr/', {headers: {Token: token}});
            const currentRound = response.data["currentRound"];
            const amountOfRounds = response.data["totalRounds"];
            setCurrentRound(currentRound);
            setAmountOfRounds(amountOfRounds);
        }  catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }

    };

    const handleHintSubmit = () => {
        console.log('hint submitted ✅');
        setInputHint("");
    }

    const handleGuessSubmit = () => {
        console.log('guess submitted ✅');
        setInputGuess("");
    }

    useEffect(() => {
        distributeRole()
        displayCurrentRound();
    }, []);

    /*useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Enter' && role === "GUESSER") {
                //console.log("THIS SHOULDNT GET DISPLAYED");
                event.preventDefault();
                /*if (inputGuess.trim() === "") {
                    return;
                }
                setGuess(event.target.value);
                console.log("SETTED GUESS: " + guess);

                // 👇️ call submit function here
                handleGuessSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [role]);*/

    useEffect(() => {
        const keyDownHandler = event => {
            //console.log("WTF")
            //console.log('User pressed: ', event.key);
            console.log("ROLE: " + role);
            if (event.key === 'Enter' && role === "SPIER") {
                event.preventDefault();
                /*if (inputHint.trim() === "") {
                    return;
                }*/
                setHint(event.target.value);
                console.log("HINT: " + hint);
                // 👇️ call submit function here
                handleHintSubmit();
            }
        };
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };

    }, [role]);

    function subscribeToHintInformation() {
        subscribe("/topic/games/" + lobbyId + "/hints",(response) => {
            const hint = response["hint"];
            setHint(hint);
        });
        notifyHint(lobbyId, hint);
    }
    function subscribeToGuessInformation() {
        subscribe("/topic/games/" + lobbyId + "/guesses",(response) => {
            const guess = response["guess"];
            const username = response["username"];
            setUsername(username);
            setGuess(guess);
        });
        notifyGuess(lobbyId, playerId, guess);
    }

    function subscribeToTimeInformation() {
        subscribe("/topic/games/" + lobbyId + "/startRound",(response) => {
            const timeLeft = response["duration"];
            setTimeLeft(timeLeft);
            console.log("START TIME: " + timeLeft);
        });
        notifyStartTime(lobbyId);
    }

    useEffect(() => {
        connect(subscribeToHintInformation)
    }, [hint]);

    /*useEffect(() => {
        connect(subscribeToGuessInformation);

    }, [guess]);*/

    /*useEffect(() => {
        connect(subscribeToTimeInformation);

    }, []);*/


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
            <div className="guessing container">
                <div className="guessing header-container">
                    <div className="guessing header">
                        Guesses
                    </div>
                    <div className="guessing hint-container">
                        <div className="guessing hint-text">
                            Hint: {hint}
                        </div>
                    </div>
                    {(() => {
                        if (guess === "CORRECT"){
                            return (
                                <div className="guessers correct-container">
                                    <div className="guessers name">
                                        {username}
                                    </div>
                                    <div className="guessers correct-guess">
                                        GUESSED RIGHT
                                    </div>
                                </div>
                            )
                        }
                        else if (guess !== "") {
                            return (
                                <div className="guessers wrong-container">
                                    <div className="guessers name">
                                        {username}
                                    </div>
                                    <div className="guessers wrong-guess">
                                        {guess}
                                    </div>
                                </div>
                            )
                        }
                    })()}
                </div>
                {(() => {
                    if (role === "SPIER"){
                        return (
                            <FormField
                                placeholder="Enter your hint..."
                                value={inputHint}
                                onChange={inputHint => setInputHint(inputHint)}

                            />
                        )
                    }
                    else if (role === "GUESSER"  && guess !== "CORRECT") {
                        return (
                            <FormField
                                placeholder="Enter your guess..."
                                value={inputGuess}
                                onChange={inputGuess => setInputGuess(inputGuess)}
                                //onSubmit={handleGuessSubmit}
                            />
                        )
                    }
                })()}
            </div>
        </BaseContainer>
    );

};

export default Guessing;
