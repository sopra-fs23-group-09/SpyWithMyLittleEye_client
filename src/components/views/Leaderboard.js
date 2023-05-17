import {Button} from 'components/ui/Button';
import 'styles/views/Leaderboard.scss';
import BaseContainer from "../ui/BaseContainer";
import {Icon} from '@iconify/react';
import {Link, useHistory} from "react-router-dom";
import {api, getErrorMessage} from "../../helpers/api";
import "styles/views/Guessing.scss";
import {getProfilePic, logout} from "../../helpers/utilFunctions";

import React, {useEffect, useState} from "react";
import {Alert} from "@mui/material";
const MuteButton = ({ audio }) => {
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true" || false);

  const handleMuteClick = () => {
    if (isMuted) {
      audio.volume = 1; // Unmute the audio
      audio.muted = false; // Unmute the button sound
    } else {
      audio.volume = 0; // Mute the audio
      audio.muted = true; // Mute the button sound
    }

    setIsMuted(!isMuted);
    localStorage.setItem("isMuted", !isMuted); // Store the updated isMuted state in local storage
  };

  useEffect(() => {
    // Set the initial mute state of the audio and button sound when the component mounts
    audio.volume = isMuted ? 0 : 1;
    audio.muted = isMuted;
  }, [audio, isMuted]);
    return (
      <div className="mute-button" style={{ position: "absolute", top: "92vh", left: "1vw", backgroundColor: "transparent", border: "none" }}>
        <button onClick={handleMuteClick} style={{ backgroundColor: "transparent", border: "none" }}>
                      {isMuted ? (
                        <Icon icon="ph:speaker-slash-bold" color="white" style={{ fontSize: '6vh' }} />
                      ) : (
                        <Icon icon="ph:speaker-high-bold" color="white" style={{ fontSize: '6vh' }} />
                      )}
        </button>
      </div>
    );
  };
const Leaderboard = () => {
        const history = useHistory();
        const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

        const userId = localStorage.getItem('userId');
        let [users, setUsers] = useState([]);
        let [usersByGamesWon, setUsersByGamesWon] = useState([]);
        let counter_highscore = 1;
        let counter_gamesWon = 1;

        let [alert_message, setAlert_Message] = useState(<div className="leaderboard alert-message"></div>);


        // KEEP ALIVE: to tell if an user has become idle
        useEffect(() => {
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
                    let msg = getErrorMessage(error);
                    console.log(msg);
                    setAlert_Message(<Alert className="leaderboard-page alert-message" severity="error"><b>Something went wrong while
                        fetching the data:</b> {msg}</Alert>);
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
                    <Icon icon="ph:eye-closed-bold" color="white" style={{fontSize: '4vw'}}/>
                </Link>
                <div className="base-container ellipse1">
                </div>
                <div className="base-container ellipse2">
                </div>
                <div className="base-container ellipse3">
                </div>
                <div className="base-container ellipse4">
                </div>
                <MuteButton audio={audio}/>
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
                        logout().then(r => {
                            if (r.toString() === "Success".toString()){
                                console.log("Logout Successful!")
                                history.push("/start")
                            } else {
                                setAlert_Message(<Alert className="home-page alert-message"
                                                               severity="error"><b>Something went wrong
                                    during logout: </b> {r}</Alert>);
                            }
                        });
                    }
                    }>
                        <div className="leaderboard-page logout-text">
                            Log out
                        </div>
                    </Button>
                </div>
                <div className = "leaderboard-page alert-div">
                    {alert_message}
                </div>
                <div className="leaderboards">
                    <div className="leaderboard-highscore container">
                        <div className="leaderboard-highscore header">
                            TOP USERS BY <span style={{color: "#DAA3EF"}}>POINTS EARNED</span>
                        </div>
                        <div className="ranking-header-row container">
                            <div className="ranking-header-row rank">
                                RANK
                            </div>
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
                                                src={getProfilePic(user.profilePicture)}
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
                                    return (
                                        <div className="player container" onClick={() => history.push('/users/' + user.id)}>
                                            <div className="player ranking">
                                                {counter_highscore++}
                                            </div>
                                            <img
                                                className="player profile-picture"
                                                src={getProfilePic(user.profilePicture)}
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
                            <div className="ranking-header-row rank">
                                RANK
                            </div>
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
                                                src={getProfilePic(user.profilePicture)}
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
                                                src={getProfilePic(user.profilePicture)}
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