import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Guessing.scss";
import {
    connect,
    getConnection,
    notifyGuess,
    notifyHint,
    subscribe
} from "../../helpers/stompClient";

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
    const history = useHistory();
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

    const distributeRole = async () => {
        try {
            const requestBody = JSON.stringify({playerId});
            const response = await api.get('/game/'+lobbyId+'/roleForUser/'+playerId, requestBody, {headers: {Token: token}});
            const role = response.data
            //localStorage.setItem('userId', role);
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
        //console.log('hint submitted ✅');
        setInputHint("");
    }

    const handleGuessSubmit = () => {
        console.log('guess submitted ✅');
        setInputGuess("");
    }

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Enter' && role === "GUESSER") {
                //console.log("THIS SHOULDNT GET DISPLAYED");
                event.preventDefault();
                setGuess(event.target.value);

                // 👇️ call submit function here
                handleGuessSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [inputGuess]);

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Enter' && role === "SPIER") {
                event.preventDefault();
                setHint(event.target.value);

                // 👇️ call submit function here
                handleHintSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [inputHint]);

    //TODO better solution?
    useEffect(() => {
        if (getConnection()) {
            subscribeToHintInformation();

        } else {
            connect(subscribeToHintInformation);
        }
    }, [hint]);

    useEffect(() => {
        if (getConnection()) {
            subscribeToGuessInformation();

        } else {
            connect(subscribeToGuessInformation);
        }
    }, [guess]);

    useEffect(() => {
        distributeRole();
        displayCurrentRound();
    }, []);

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
            <div className="guessing rounds">
                Round: {currentRound}/{amountOfRounds}
            </div>
            <div className="guessing time-left">
                Time-left
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
                                onChange={i => setInputHint(i)}
                                onSubmit={handleHintSubmit}
                            />
                        )
                    }
                    else if (role === "GUESSER"  && guess !== "CORRECT") {
                        return (
                            <FormField
                                placeholder="Enter your guess..."
                                value={inputGuess}
                                onChange={g => setInputGuess(g)}
                                onSubmit={handleGuessSubmit}
                            />
                        )
                    }
                })()}
            </div>
        </BaseContainer>
    );

};

export default Guessing;
