import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import {Link, useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {api} from 'helpers/api';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
import {disconnect} from "../../helpers/stompClient";
import React, { useState, useEffect } from 'react';

const HomePage = () => {
    useEffect(()=>{
        setInterval(async ()=>{
            await api.put("/users/keepAlive", {}, {headers: {Token: localStorage.getItem("token")}})
        }, 2000)
    }, [])
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
    const userId = localStorage.getItem('userId');
    const goToProfile = () => {
        history.push(`/users/${userId}`);
        audio.play();
    };
    const logout = async () => {
        audio.play();
        const title = {title: 'logout request'};
        const response = await api.put('/users/logout', title,{headers: {Token: localStorage.getItem("token")}});
        console.log(response);

        disconnect(); // TODO shall we do this?
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('profilePicture');
        history.push('/login');
    }

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
            <div className="home-page navigation-bar">
                    <Button className="ranking-button" onClick={() => {
                        audio.play();
                        history.push('/leaderboard');
                    }}>
                    <div className="home-page ranking-text">
                        Ranking
                    </div>
                </Button>
                <Button className="profile-button" onClick={goToProfile}

                >
                    <div className="home-page profile-text">
                        Profile
                    </div>
                </Button>
                <Button className="logout-button" onClick={() => logout()}>
                    <div className="home-page logout-text">
                        Log out
                    </div>
                </Button>
            </div>
            <Button className="join-lobby-button" onClick={() => {
            audio.play();
            history.push('/code');
            }}>

                <div className="home-page join-lobby-button-text">
                    Join a lobby
                </div>
            </Button>
            <Button className="create-lobby-button" onClick={() => {
            audio.play();
            history.push('/rounds');
            }}
            >
                <div className="home-page create-lobby-button-text">
                Create a lobby
                </div>
            </Button>
        </BaseContainer>
    );

};

export default HomePage;