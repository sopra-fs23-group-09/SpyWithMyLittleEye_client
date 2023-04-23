import 'styles/views/RoundOver.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';
import {api} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";

const RoundOver = () => {
    const history = useHistory();
    const gameId = localStorage.getItem("gameId"); // TODO this is equal to lobbyId
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    // TODO empty local storage
    let [keyword, setKeyword] = useState(null);
    let [roundOverStatus, setRoundOverStatus] = useState(null);
    let [role, setRole] = useState(null)

    let [first, setFirst] = useState({username: "", points: ""})
    let [second, setSecond] = useState({username: "", points: ""})
    let [third, setThird] = useState({username: "", points: ""})


    useEffect(async () => {
        let response = await api.get("/game/" + gameId + "/roleForUser/" + userId, {headers: {Token: token}});
        setRole(response["data"]);

        response = await api.get("/games/" + gameId + "/round/results", {headers: {Token: token}});
        setRoundOverStatus(response.data["roundOverStatus"]);
        setKeyword(response.data["keyword"]);
        let playerPoints = response.data["playerPoints"];

        playerPoints.push({username: "winner", points: 100})
        playerPoints.sort((a, b) => {
            return b.points - a.points;
        });

        setFirst(playerPoints[0]);
        setSecond(playerPoints[1]);

        if (playerPoints.length > 2) {
            setThird(playerPoints[2]);
        }
        }, []);

    // TODO add fourth
    // TODO set profile picture

    return (
        <BaseContainer>
            <div class="code left-field">
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
            <div className="roundover container">
                <div className="roundover header">
                    ROUND ? IS OVER
                </div>
                <div className="roundover solution">
                    The object was "{keyword}"
                </div>
                <div className="roundover time-left">
                    ?
                </div>
                <div className="roundover leaderboard-text">
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

        </BaseContainer>
    );

};

export default RoundOver;