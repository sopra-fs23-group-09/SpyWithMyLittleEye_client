import {useEffect, useState} from 'react';
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
                //onChange={e => props.onChange(e.target.value)}
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
    var [game, setGame] = useState(null);
    let roundId = localStorage.getItem("roundId")
    var [round, setRound] = useState(null);


    /*useEffect(() => {
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
            subscribeToRoundInformation();
        });
    }

    function subscribeToRoundInformation() {
        subscribe("/games/" + gameId + "/round" + roundId,(response) => {
            setRound(new Round(response.data));

        });
    }*/

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users', {headers: {Token: localStorage.getItem("token")}});

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

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
                    You're a: ?
                </div>
            </div>
            <div className="guessing container">
                <div className="guessing header-container">
                    <div className="guessing header">
                        Guesses
                    </div>
                    <div className="guessing hint-container">
                        <div className="guessing hint-text">
                            Hint: The object is ?
                        </div>
                    </div>
                    <div className="guessers wrong-container">
                        <div className="guessers name">
                            Name
                        </div>
                        <div className="guessers wrong-guess">
                            Guess
                        </div>
                    </div>
                    <div className="guessers correct-container">
                        <div className="guessers name">
                            Name
                        </div>
                        <div className="guessers correct-guess">
                            GUESSED RIGHT
                        </div>
                    </div>
                </div>
                <FormField
                    placeholder="Enter your guess..."
                    type = "text"
                />
            </div>
        </BaseContainer>
    );

};

export default Guessing;
