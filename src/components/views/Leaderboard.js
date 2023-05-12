import {Button} from 'components/ui/Button';
import 'styles/views/Leaderboard.scss';
import BaseContainer from "../ui/BaseContainer";
import {Icon} from '@iconify/react';
import {Link, useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import "styles/views/Guessing.scss";
import {getProfilePic, logout} from "../../helpers/utilFunctions";

import React, {useEffect, useState} from "react";

// TODO profile pic, remove foo profiles
const Leaderboard = () => {
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    const userId = localStorage.getItem('userId');
    let [users, setUsers] = useState([]);
    let [usersByGamesWon, setUsersByGamesWon] = useState([]);
    let counter_highscore = 1;
    let counter_gamesWon = 1;

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
        async function fetchData() {
            try {
                // RANKING BY HIGHSCORE
                const response1 = await api.get('/users/ranking', {headers: {Token: localStorage.getItem("token")}});
                console.log(response1["data"]);
                setUsers(response1["data"])


                // RANKING BY GAMES WON
                const response2 = await api.get('/users/rankingGamesWon', {headers: {Token: localStorage.getItem("token")}});
                console.log(response2["data"]);
                setUsersByGamesWon(response2["data"])

            } catch (error) {
                alert(`Something went wrong fetching the ranking: \n${handleError(error)}`);
            }
        }

        fetchData();
    }, []);

    const goToProfile = () => {
        audio.play();
        history.push(`/users/${userId}`);
    };


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
            <div className="leaderboard-page navigation-bar">
                <Button className="ranking-button" onClick={() => {
                audio.play();
                history.push('/home');
                }}>
                    <div className="leaderboard-page ranking-text">
                        Home
                    </div>
                </Button>
                <Button className="profile-button" onClick={goToProfile}

                >
                    <div className="leaderboard-page profile-text">
                        Profile
                    </div>
                </Button>
                <Button className="logout-button" onClick={() => {
                    logout().then(r => history.push('/start'));

                }
                }>
                    <div className="leaderboard-page logout-text">
                        Log out
                    </div>
                </Button>
            </div>
            <div className="leaderboard-page header">
                Ranking
            </div>
            <div className="leaderboards">
                <div className="leaderboard-highscore container">
                    <div className="leaderboard-highscore header">
                        TOP USERS BY <span style={{color: "#DAA3EF"}}>POINTS EARNED</span>
                    </div>
                    <div className="ranking-header-row container">
                        <div className="ranking-header-row username">
                            USERNAME
                        </div>
                        <div className="ranking-header-row text">
                            TOTAL POINTS
                        </div>
                    </div>
                    <div className="leaderboard-highscore container-players"
                         style={{maxHeight: "60vh", overflowY: "auto", overflowX: "hidden"}}>
                        {users.map(user => {
                            if (counter_highscore === 1) { // You're the leader
                                return (
                                    <div className="leader container" onClick={() => history.push(`/users/${user.id}`)}>
                                        <div className="leader ranking">
                                            {counter_highscore++}
                                        </div>
                                        <img
                                            className="leader profile-picture"
                                            src= {getProfilePic(user.profilePicture)}
                                            alt="profile pic"
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div className="leader name">
                                            {user.username}
                                        </div>
                                        <div className="leader points">
                                            {user.highScore}
                                        </div>
                                    </div>
                                )
                            } else { // You're just a player
                        return (<div className="player container" onClick={() => history.push(`/users/${user.id}`)}>
                        <div className="player ranking">
                    {counter_highscore++}
                        </div>
                            <img
                                className="player profile-picture"
                                src= {getProfilePic(user.profilePicture)}
                                alt="profile pic"
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        <div className="player name">
                    {user.username}
                        </div>
                        <div className="player points">
                    {user.highScore}
                        </div>
                        </div>)
                    }
                        })}
                    </div>
                </div>
                <div className="leaderboard-gamesWon container">
                    <div className="leaderboard-gamesWon header">
                        TOP USERS BY <span style={{color: "#DAA3EF"}}>GAMES WON</span>
                    </div>
                    <div className="ranking-header-row container">
                        <div className="ranking-header-row username">
                            USERNAME
                        </div>
                        <div className="ranking-header-row text">
                            GAMES WON
                        </div>
                    </div>
                    <div className="leaderboard-gamesWon container-players"
                         style={{maxHeight: "60vh", overflowY: "auto", overflowX: "hidden"}}>
                        {usersByGamesWon.map(user => {
                            if (counter_gamesWon === 1) { // You're the leader
                                return (
                                    <div className="leader container" onClick={() => history.push(`/users/${user.id}`)}>
                                        <div className="leader ranking">
                                            {counter_gamesWon++}
                                        </div>
                                        <img
                                            className="leader profile-picture"
                                            src= {getProfilePic(user.profilePicture)}
                                            alt="profile pic"
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div className="leader name">
                                            {user.username}
                                        </div>
                                        <div className="leader points">
                                            {user.gamesWon}
                                        </div>
                                    </div>
                                )
                            } else { // You're just a player
                                return (
                                    <div className="player container" onClick={() => history.push(`/users/${user.id}`)}>
                                        <div className="player ranking">
                                            {counter_gamesWon++}
                                        </div>
                                        <img
                                            className="player profile-picture"
                                            src= {getProfilePic(user.profilePicture)}
                                            alt="profile pic"
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div className="player name">
                                            {user.username}
                                        </div>
                                        <div className="player points">
                                            {user.gamesWon}
                                        </div>
                                    </div>)
                            }
                        })}
                    </div>
                </div>
            </div>

        </BaseContainer>
    );

}
    ;
    export default Leaderboard;