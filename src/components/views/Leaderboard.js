import {Button} from 'components/ui/Button';
import 'styles/views/Leaderboard.scss';
import BaseContainer from "../ui/BaseContainer";
import {Icon} from '@iconify/react';
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {disconnect} from "../../helpers/stompClient";
import "styles/views/Guessing.scss";

import React, {useEffect, useState} from "react";

// TODO new server request, profile pic, remove foo profiles
const Leaderboard = () => {
    const history = useHistory();
    const userId = localStorage.getItem('userId');
    let [users, setUsers] = useState([]);
    let [usersByGamesWon, setUsersByGamesWon] = useState([]);
    let counter_highscore = 1;
    let counter_gamesWon = 1;


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users/ranking', {headers: {Token: localStorage.getItem("token")}});
                console.log(response["data"]);
                // TODO take out
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 5,
                    "highScore": 230,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "xena"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 4,
                    "highScore": 100,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "nina"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 1,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "claudia"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 3,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "thereza"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 10,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "loubna"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 5,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "xena"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 4,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "nina"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 1,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "claudia"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 3,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "thereza"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 10,
                    "highScore": 1707,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "loubna"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 5,
                    "highScore": 230,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "xena"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 4,
                    "highScore": 100,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "nina"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 1,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "claudia"
                })
                response["data"].push({
                    "birthday": null,
                    "creationDate": "2023-05-01",
                    "gamesPlayed": 0,
                    "gamesWon": 3,
                    "highScore": 0,
                    "id": 1,
                    "status": "ONLINE",
                    "username": "thereza"
                })
                setUsers(response["data"])

                // TODO maybe new REST request? Talk to nina!!
                let helper = [...response["data"]];
                helper.sort((a, b) => {
                    return b.gamesWon - a.gamesWon;
                });
                setUsersByGamesWon(helper)

            } catch (error) {
                alert(`Something went wrong during showing the user page: \n${handleError(error)}`);
            }
        }

        fetchData();
    }, []);

    const goToProfile = () => {
        history.push(`/users/${userId}`);
    };

    const logout = async () => { // TODO: duplicate functions?
        const title = {title: 'logout request'};
        const response = await api.put('/users/logout', title, {headers: {Token: localStorage.getItem("token")}});
        console.log(response);

        disconnect(); // TODO shall we do this?
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
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
            <div className="leaderboard-page navigation-bar">
                <Button className="ranking-button" onClick={() => history.push('/home')}

                >
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
                <Button className="logout-button" onClick={() => logout()}>
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
                         style={{maxHeight: "77%", overflowY: "auto", overflowX: "hidden"}}>
                        {users.map(user => {
                            if (counter_highscore === 1) { // You're the leader
                                return (
                                    <div className="leader container" onClick={() => history.push(`/users/${user.id}`)}>
                                        <div className="leader ranking">
                                            {counter_highscore++}
                                        </div>
                                        <img
                                            className="leader profile-picture"
                                            src="https://cdn.shopify.com/s/files/1/0535/2738/0144/articles/shutterstock_1290320698.jpg?v=1651099282"
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
                                src="https://cdn.shopify.com/s/files/1/0535/2738/0144/articles/shutterstock_1290320698.jpg?v=1651099282"
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
                    <div className="leaderboard-highscore header">
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
                    <div className="leaderboard-highscore container-players"
                         style={{maxHeight: "77%", overflowY: "auto", overflowX: "hidden"}}>
                        {usersByGamesWon.map(user => {
                            if (counter_gamesWon === 1) { // You're the leader
                                return (
                                    <div className="leader container" onClick={() => history.push(`/users/${user.id}`)}>
                                        <div className="leader ranking">
                                            {counter_gamesWon++}
                                        </div>
                                        <img
                                            className="leader profile-picture"
                                            src="https://cdn.shopify.com/s/files/1/0535/2738/0144/articles/shutterstock_1290320698.jpg?v=1651099282"
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
                                            src="https://cdn.shopify.com/s/files/1/0535/2738/0144/articles/shutterstock_1290320698.jpg?v=1651099282"
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