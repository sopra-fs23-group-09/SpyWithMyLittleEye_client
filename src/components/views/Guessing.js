import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Guessing.scss";
import Game from 'models/Game.js';
import {connect, getConnection, subscribe} from "../../helpers/stompClient";
import Lobby from "../../models/Lobby";
import Round from "../../models/Round";

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
    const [users, setUsers] = useState(null);
    let gameId = localStorage.getItem("gameId");
    let [game, setGame] = useState(null);
    let roundId = localStorage.getItem("roundId");
    let [round, setRound] = useState(null);
    let [guess, setGuess] = useState(null);
    let [dguess, setdGuess] = useState(null);


    const handleSubmit = () => {
        console.log('form submitted ✅');
        setdGuess(setGuess(guess));
        setGuess("");
        setGuess(null);
    }

    useEffect(() => {
        const keyDownHandler = event => {
            console.log('User pressed: ', event.key);

            if (event.key === 'Enter') {
                event.preventDefault();

                // 👇️ call submit function here
                handleSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);



    useEffect(() => {
        if (getConnection()) {
            subscribeToGameInformation();
        } else {
            connect(subscribeToGameInformation)
        }
    },[]);

    function subscribeToGameInformation() {
        subscribe("/games/" + gameId,(response) => {
            setGame(new Game(response.data));
            console.log(response.data);
            setRound(game.currentRound);
            setUsers(game.currentRound);
            subscribeToRoundInformation();
        });
    }

    function subscribeToRoundInformation() {
        subscribe("/games/" + gameId + "/round" + roundId,(response) => {
            setRound(new Round(response.data));


        });
    }

    /*useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                console.log("Enter key was pressed. Run your function.");
                event.preventDefault();

            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, []);*/

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
                    You're a: users.role
                </div>
            </div>
            <div className="guessing container">
                <div className="guessing header-container">
                    <div className="guessing header">
                        Guesses
                    </div>
                    <div className="guessing hint-container">
                        <div className="guessing hint-text">
                            Hint: The object is round.hints
                        </div>
                    </div>
                    {(() => {
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
                    })()}
                    {(() => {
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
                    })()}
                </div>
                <FormField
                    placeholder="Enter your guess..."
                    value={guess}
                    onChange={g => setRound(g)}
                    onSubmit={handleSubmit}
                />
            </div>
        </BaseContainer>
    );

};

export default Guessing;
