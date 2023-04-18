import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Guessing.scss";
import Game from 'models/Game.js';
import {
    connect,
    getConnection,
    notifyGuess,
    notifyHint,
    notifyLobbyJoined,
    notifyRole, startGame,
    subscribe
} from "../../helpers/stompClient";
import Lobby from "../../models/Lobby";
import Round from "../../models/Round";

/*{(() => {
    if (dguess !== null){
        return (
            <div className="guessers wrong-container">
                <div className="guessers name">
                    users.username
                </div>
                <div className="guessers wrong-guess">
                    {dguess}
                </div>
            </div>
        )
    }
})()}*/

/*{(() => {
    if (dguess !== null){
        return (
            <div className="guessers correct-container">
                <div className="guessers name">
                    users.username
                </div>
                <div className="guessers correct-guess">
                    GUESSED RIGHT
                </div>
            </div>
        )
    }
})()}*/

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
    let playerId = localStorage.getItem("userId");
    let lobbyId = localStorage.getItem("lobbyId");
    console.log("Lobby ID: " + lobbyId)

    const [input, setInput] = useState("");
    const [hint, setHint] = useState("");
    const [guess, setGuess] = useState("");

    const [role, setRole] = useState("spier");

    const handleHintSubmit = () => {
        console.log('hint submitted ✅');
        setInput("");
    }

    const handleGuessSubmit = () => {
        console.log("Guess: " + guess);
        console.log('guess submitted ✅');
        setInput("");
    }

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Shift') {
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
    }, []);

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Enter') {
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
    }, []);

    useEffect(() => {
        if (getConnection()) {
            subscribeToHintInformation();
        } else {
            connect(subscribeToHintInformation)
        }
    }, [hint]);

    /*function subscribeToGameInformation() {
        subscribe("/games/" + gameId,(response) => {
            setGame(new Game(response.data));
            console.log(response.data);
            setRound(game.currentRound);
            setUsers(game.currentRound);
            subscribeToRoundInformation();
        });
    }*/

    /*function subscribeToRoleInformation() {
        subscribe("/game/" + "1" + "/round/" + "1",(response) => {
            //setRound(new Round(response.data));
            const role = response
            setRole(role);
            console.log(role);
        });
        notifyRole(lobbyId, playerId);
    }*/

    /*function subscribeToGameInformation() {
        subscribe("/games/" + lobbyId,(response) => {
            startGame(lobbyId);
            subscribeToGuessInformation();
        });
    }*/

    function subscribeToHintInformation() {
        subscribe("/game/" + lobbyId + "/hints",(response) => {
            const hint = response["hint"];
            setHint(hint);
        });

        notifyHint(lobbyId, hint);
    }

    /*function subscribeToGuessInformation() {
        subscribe("/game/" + lobbyId + "/guesses",(response) => {
            const guess = response["guess"];
            setGuess(guess);
            console.log(guess);
        });
        notifyGuess(lobbyId, playerId, guess);
    }*/


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
                Round: round.currentRound/round.amountOfRounds
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
                                        users.username
                                    </div>
                                    <div className="guessers correct-guess">
                                        GUESSED RIGHT
                                    </div>
                                </div>
                            )
                        }
                    })()}
                </div>
                {(() => {
                    if (role === "spier"){
                        return (
                            <FormField
                                placeholder="Enter your hint..."
                                value={input}
                                onChange={i => setInput(i)}
                                onSubmit={handleHintSubmit}
                            />
                        )
                    }
                    return (
                        <FormField
                            placeholder="Enter your guess..."
                            value={input}
                            onChange={g => setInput(g)}
                            onSubmit={handleGuessSubmit}
                        />
                    )
                })()}
            </div>
        </BaseContainer>
    );

};

export default Guessing;
