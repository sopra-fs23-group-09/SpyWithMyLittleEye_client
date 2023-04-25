import 'styles/views/GameOver.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
import 'styles/views/Code.scss';
import {api} from "../../helpers/api";
import {Button} from "../ui/Button";
import {
    connect,
    getConnection,
    notifyGameEndedButtonClicked,
    subscribe
} from "../../helpers/stompClient";

const GameOver = () => {
    // TODO add fourth place
    // TODO set profile picture
    const history = useHistory();
    const gameId = localStorage.getItem("gameId"); // TODO this is equal to lobbyId
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    let [keyword, setKeyword] = useState(null);
    //let [roundOverStatus, setRoundOverStatus] = useState(null);
    //let [role, setRole] = useState(null)
    let [hostId, setHostId] = useState(null)
    let [currentRoundNr, setCurrentRoundNr] = useState(null)

    let [first, setFirst] = useState({username: "", points: ""})
    let [second, setSecond] = useState({username: "", points: ""})
    let [third, setThird] = useState({username: "", points: ""})


    useEffect(async () => {
        let response = await api.get("/games/" + gameId + "/results", {headers: {Token: token}}); // TODO
        //setKeyword(response.data["keyword"]);
        setHostId(response.data["hostId"])
       // setCurrentRoundNr(response.data["currentRoundNr"])
        let playerPoints = response.data["playerPoints"];

        playerPoints.push({username: "winner", points: 100}) // TODO remove
        playerPoints.sort((a, b) => {
            return b.points - a.points;
        });

        setFirst(playerPoints[0]);
        setSecond(playerPoints[1]);

        if (playerPoints.length > 2) {
            setThird(playerPoints[2]);
        }

        //
        if (getConnection()) {
            subscribeToEndGame() // TODO this name is not good hehe
        } else {
            connect(subscribeToEndGame)
        }

        //let response = await api.get("/game/" + gameId + "/roleForUser/" + userId, {headers: {Token: token}});
        //setRole(response["data"]);
    }, []);

    function subscribeToEndGame() {
        subscribe("/topic/games/" + gameId + "/over", data => {
            console.log("Inside callback");
            // TODO empty local storage
            history.push(`/home/`);
        });
    }


    function endGame() {
        // empty local storage
        //localStorage.removeItem("location");
        //localStorage.removeItem("color");
        notifyGameEndedButtonClicked(gameId);
        //history.push(`/game/` + gameId + "/waitingroom");
    }

    let button_gameEnded = (<div></div>);


    if (hostId == userId) { // has to be == for it to work
        button_gameEnded = (
            <Button className="roundover primary-button" onClick={() => endGame()}
            >
                <div className="roundover button-text">
                    End Game
                </div>
            </Button>)
    }

    return (
        <BaseContainer>
            <div className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{fontSize: '4rem'}}/>
            </div>
            <div className="base-container ellipse1">
            </div>
            <div className="base-container ellipse2">
            </div>
            <div className="base-container ellipse3">
            </div>
            <div className="base-container ellipse4">
            </div>
            <div className="gameover container">
                <div className="gameover header">
                    THE GAME IS OVER
                </div>
                <div className="gameover header">
                    ROUND {currentRoundNr} IS OVER
                </div>
                <div className="gameover solution">
                    The object was "{keyword}"
                </div>
                <div className="gameover leaderboard-text">
                    Leaderboard
                </div>
                <div>
                    <div className="score name-1st">
                        {first.username}
                    </div>
                    <div className="score points-1st">
                        {first.points}
                    </div>
                    <div className="score name-2nd">
                        {second.username}
                    </div>
                    <div className="score points-2nd">
                        {second.points}
                    </div>
                    <div className="score name-3rd">
                        {third.username}
                    </div>
                    <div className="score points-3rd">
                        {third.points}
                    </div>
                </div>
            </div>
            {button_gameEnded}

        </BaseContainer>
    );

};

export default GameOver;