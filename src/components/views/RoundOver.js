import 'styles/views/RoundOver.scss';
import {Link, useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
import 'styles/views/Code.scss';
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import {connect, getConnection, notifyNextRoundButtonClicked, subscribe, unsubscribe} from "../../helpers/stompClient";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import {getProfilePic} from "../../helpers/utilFunctions";


const RoundOver = () => {
    // TODO add fourth place
    // TODO set profile picture
    const history = useHistory();
    const gameId = localStorage.getItem("gameId"); // TODO this is equal to lobbyId
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    let [keyword, setKeyword] = useState(null);
    let [hostId, setHostId] = useState(null)
    let [currentRoundNr, setCurrentRoundNr] = useState(null)

    let [first, setFirst] = useState({username: "", points: ""})
    let [second, setSecond] = useState({username: "", points: ""})
    let [third, setThird] = useState({username: "", points: ""})

    useEffect( () => {
        async function fetchData() {
            let response = await api.get("/games/" + gameId + "/round/results", {headers: {Token: token}});
            setKeyword(response.data["keyword"]);
            setHostId(response.data["hostId"])
            setCurrentRoundNr(response.data["currentRoundNr"])
            let playerPoints = response.data["playerPoints"];

            playerPoints.sort((a, b) => { // TODO comes sorted already
                return b.points - a.points;
            });
            setFirst(playerPoints[0]);
            setSecond(playerPoints[1]);

            if (playerPoints.length > 2) {
                setThird(playerPoints[2]);
            }
        }
        fetchData();

        }, [gameId, token]);

    useEffect(() => {
        if (getConnection()) {
            subscribeToContinueToNextRound() // TODO this name is not good hehe
        } else {
            connect(subscribeToContinueToNextRound)
        }

        function subscribeToContinueToNextRound() {
            subscribe("/topic/games/" + gameId + "/nextRound", data => {
                console.log("Inside callback");
                localStorage.removeItem("location");
                localStorage.removeItem("color");
                unsubscribe("/topic/games/" + gameId + "/nextRound");
                history.push(`/game/` + gameId + "/waitingroom");
            });
        }
    }, [gameId, history]);




    function startNewRound() {
        audio.play();
        notifyNextRoundButtonClicked(gameId, token);
    }

    let button_newRound = (<div></div>);


    if ((hostId)&& (userId) &&(hostId.toString() === userId.toString())) { // has to be == for it to work
        button_newRound = (
            <Button className="roundover primary-button" onClick={() => startNewRound()}
        >
            <div className="roundover button-text">
                Continue
            </div>
            </Button>)
    }

    let picture1 = getProfilePic(first.profilePicture);
    let picture2 = getProfilePic(second.profilePicture);
    let picture3 = getProfilePic(third.profilePicture);
    return (
        <BaseContainer>
            <Link to="/home" className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4rem' }} />
            </Link>
            <div className="base-container ellipse1">
            </div>
            <div className="base-container ellipse2">
            </div>
            <div className="base-container ellipse3">
            </div>
            <div className="base-container ellipse4">
            </div>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                colors={['#A7AEF9', '#DAA3EF', '#DDCCF8', '#F5C9C9', '#CEBBFA', '#A7AEF9',  '#FF72B6', '#F5C9D9',
                    '#97E1D4', '#8359E3']}
            />
            <div className="roundover container">
                <div className="roundover header">
                    ROUND {currentRoundNr} IS OVER
                </div>
                <div className="roundover solution">
                    The object was "{keyword}"
                </div>
                <div className="roundover leaderboard-text">
                    Leaderboard
                </div>
                <div>
                    <img className="score profile-picture-1st" src = {picture1} alt ="profilePicture">
                    </img>
                    <div className="score name-1st">
                        {first.username}
                    </div>
                    <div className="score points-1st">
                        {first.points}
                    </div>
                    <img className="score profile-picture-2nd" src = {picture2} alt ="profilePicture">
                    </img>
                    <div className="score name-2nd">
                        {second.username}
                    </div>
                    <div className="score points-2nd">
                        {second.points}
                    </div>
                    <img className="score profile-picture-3rd" src = {picture3} alt ="profilePicture">
                    </img>
                    <div className="score name-3rd">
                        {third.username}
                    </div>
                    <div className="score points-3rd">
                        {third.points}
                    </div>
                </div>
            </div>
            {button_newRound}

        </BaseContainer>
    );

};

export default RoundOver;

