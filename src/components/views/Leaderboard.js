import {Button} from 'components/ui/Button';
import 'styles/views/Leaderboard.scss';
import BaseContainer from "../ui/BaseContainer";
import { Icon } from '@iconify/react';
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {disconnect} from "../../helpers/stompClient";
import "styles/views/Guessing.scss";

import React, {useEffect, useState} from "react";

const Leaderboard = () => {
    const history = useHistory();
    const userId = localStorage.getItem('userId');
    let [users, setUsers] = useState([]);
    let counter = 1;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get('/users/ranking', {headers: {Token: localStorage.getItem("token")}});
                console.log(response["data"]);
                setUsers(response["data"])
                //setUser(response.data);
            } catch (error) {
                alert(`Something went wrong during showing the user page: \n${handleError(error)}`);
            }
        }
        fetchData();
    },[]);

    const goToProfile = () => {
        history.push(`/users/${userId}`);
    };

    const logout = async () => { // TODO: duplicate functions?
        const title = {title: 'logout request'};
        const response = await api.put('/users/logout', title,{headers: {Token: localStorage.getItem("token")}});
        console.log(response);

        disconnect(); // TODO shall we do this?
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
    }

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
            <div className="leaderboard navigation-bar">
                <Button className="ranking-button" onClick={() => history.push('/leaderboard')}

                >
                    <div className="leaderboard ranking-text">
                        Ranking
                    </div>
                </Button>
                <Button className="profile-button" onClick={goToProfile}

                >
                    <div className="leaderboard profile-text">
                        Profile
                    </div>
                </Button>
                <Button className="logout-button" onClick={() => logout()}>
                    <div className="leaderboard logout-text">
                        Log out
                    </div>
                </Button>
            </div>
            <div className="leaderboard container">
                <div className="leaderboard header">
                    Leaderboard
                </div>
                <div className="leaderboard container-players"   style={{maxHeight: "50%", overflowY: "auto" }}>
                    {users.map(user => {
                        if (false) { // You're the leader
                            return (
                            <div className="leader container">
                                <div className="leader name">
                                    {user.username}
                                </div>
                                <div className="leader points">
                                    {user.highScore}
                                </div>
                                <div className="leader points-text">
                                    Points
                                </div>
                            </div>
                            )
                        } else { // You're just a player
                            return (<div className="player container">
                                <div className="player ranking">
                                    {counter++}
                                </div>
                                <div className="player name">
                                    {user.username}
                                </div>
                                <div className="player points">
                                    {user.highScore}
                                </div>
                                <div className="player points-text">
                                    Points
                                </div>
                            </div>)
                        }
                    })}
                </div>
                <Button className="leaderboard-back-button" style = {{top: "85%"}} onClick={() => history.push('/home')} // TODO axtually go back
                >
                    <div className="leaderboard back-button-text">
                        Go back
                    </div>
                </Button>
            </div>
        </BaseContainer>
    );

};
// TODO leader
// TODO position
export default Leaderboard;