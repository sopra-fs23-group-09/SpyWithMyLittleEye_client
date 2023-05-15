import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import {Link, useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {api, getErrorMessage} from 'helpers/api';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
import React, { useState, useEffect } from 'react';
import {logout} from "../../helpers/utilFunctions";
import {Alert} from "@mui/material";

const HomePage = () => {

    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
    const userId = localStorage.getItem('userId');

    let [logout_alert_message, setLogout_Alert_Message] = useState(<div className="home-page alert-message"></div>);
    //let [logout_alert_message, setLogout_Alert_Message] = useState(<Alert className="home-page alert-message" severity="error"><b>Something went wrong during logout: </b> Uuwuwuwuwuwuuw</Alert>);
    const goToProfile = () => {
        history.push(`/users/${userId}`);
        audio.play();
    };

    // KEEP ALIVE: to tell if an user has become idle
    useEffect(()=>{
        if (!(localStorage.getItem("intervalId"))) {
            let token = localStorage.getItem("token");

            let intervalId = setInterval(async () => {
                try {
                    await api.put("/users/keepAlive", {}, {headers: {Token: token}})
                    console.log("I am alive!!! " + token)
                } catch (e) {
                    console.log(getErrorMessage(e))
                    history.push("/start");
                }
            }, 2000)
            localStorage.setItem("intervalId", String(intervalId));
            console.log("Localstorage : " + localStorage.getItem("intervalId") + " actual: " + intervalId);
        }
    }, [history])




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
                <Button className="logout-button" onClick={() => {
                        logout().then(r => {
                            if (r.toString() === "Success".toString()){
                                console.log("Logout Successful!")
                                history.push("/start")
                            } else {
                                setLogout_Alert_Message(<Alert className="home-page alert-message"
                                                                           severity="error"><b>Something went wrong
                                    during logout: </b> {r}</Alert>);
                            }
                        });
                }
                }>
                    <div className="home-page logout-text">
                        Log out
                    </div>
                </Button>
            </div>
            <div className = "home-page alert-div">
                {logout_alert_message}
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