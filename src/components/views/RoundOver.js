import 'styles/views/RoundOver.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {Icon} from '@iconify/react';
import React, {useEffect, useState} from 'react';
import 'styles/views/Code.scss';
import {api, getErrorMessage} from "../../helpers/api";
import {Button} from "../ui/Button";
import {connect, getConnection, notifyNextRoundButtonClicked, subscribe, unsubscribe} from "../../helpers/stompClient";
import Confetti from 'react-confetti'
import {getProfilePic} from "../../helpers/utilFunctions";
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
const RoundOver = () => {
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

    let [alert_message, setAlert_Message] = useState(<div className="setlocation alert-message"></div>);
    let [drop_out_alert_message, setDrop_out_alert_message] =
        useState(<div className="lobby drop-out-alert-message"></div>);
    //useState(<Alert className ="lobby drop-out-alert-message" severity="warning" onClose={() => {setDrop_out_alert_message(<div className="lobby drop-out-alert-message"></div>)}}><b>친구</b> has left the game! </Alert>);

    //let [reload, setReload] = useState(0);


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


    useEffect( () => {
        async function fetchData() {
            try{
                let response = await api.get("/games/" + gameId + "/round/results", {headers: {Token: token}});
                console.log(response);
                setKeyword(response.data["keyword"]);
                setHostId(response.data["hostId"])
                setCurrentRoundNr(response.data["currentRoundNr"])
                let playerPoints = response.data["playerPoints"];


                setFirst(playerPoints[0]);
                if (playerPoints.length > 1) {
                    setSecond(playerPoints[1]);
                }
                if (playerPoints.length > 2) {
                    setThird(playerPoints[2]);
                }
            } catch (e) {
                let msg = getErrorMessage(e);
                console.log(msg);
                setAlert_Message(<Alert className ="roundover alert-message" severity="error"><b>Something went wrong when fetching the data:</b> {msg}</Alert>);
            }
        }
        fetchData();

        }, [gameId, token]);

    useEffect(() => {
        if (getConnection()) {
            makeSubscription()
        } else {
            connect(makeSubscription)
        }

        function makeSubscription() {
            subscribeToContinueToNextRound()
            subscribeToUserDropOut()
        }

        function subscribeToContinueToNextRound() {
            subscribe("/topic/games/" + gameId + "/nextRound", data => {
                console.log("Inside callback");
                localStorage.removeItem("location");
                localStorage.removeItem("color");
                localStorage.removeItem("timeLeft");
                unsubscribe("/topic/games/" + gameId + "/nextRound");
                unsubscribe("/topic/games/" + gameId + "/userDropOut");
                history.push(`/game/` + gameId + "/waitingroom");
            });
        }

        function subscribeToUserDropOut() {
            subscribe("/topic/games/" + gameId + "/userDropOut", data => {
                let username = localStorage.getItem("username");
                console.log(data);
                if (data.name.toString() === username.toString()) { // u're the one dropping out!
                    console.log("I DROPPED OUT???")
                    localStorage.removeItem('token');
                    history.push("/start")
                } else if (data.endGame) {
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                         unsubscribe("/topic/games/" + gameId + "/nextRound");
                                                         unsubscribe("/topic/games/" + gameId + "/userDropOut");
                                                         history.push("/game/" + gameId + "/score");
                                                     }}>
                        <b>{data.name}</b> has left the game! The game is over.</Alert>);
                } else if (data.host) {
                    console.log("HOST DROPPED OUT")
                    setHostId(data.newHostId);
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         //setReload(reload + 1);
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                     }}>
                        <b>{data.name}</b> has left the game! A new host has been assigned. </Alert>);
                } else {
                    console.log("USER DROPPED OUT")
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                         //setReload(reload + 1);
                                                     }}>
                        <b>{data.name}</b> has left the game! </Alert>);
                }
            });
        }
    }, [gameId, history]);




    function startNewRound() {
        try {
            try {
                audio.play();
            } catch (e) {
                console.log("Failed to play sound.")
            }
        } catch (e) {
            console.log("Failed to play sound.")
        }
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
    } else {
        button_newRound = (<div className = "roundover waiting-msg">
            (Please wait until the host advances to the next round.)
        </div>)
    }

    let picture1 = (first && first.profilePicture) ? getProfilePic(first.profilePicture):null;
    let picture2 = (second && second.profilePicture) ?getProfilePic(second.profilePicture):null;
    let picture3 = (third && third.profilePicture) ?getProfilePic(third.profilePicture):null;
    return (
        <BaseContainer>
            <div class="code left-field">
              <Icon icon="ph:eye-closed-bold" color="white"style={{ fontSize: '4rem'}}/>
            </div>
            <div className="base-container ellipse1">
            </div>
            <div className="base-container ellipse2">
            </div>
            <div className="base-container ellipse3">
            </div>
            <div className="base-container ellipse4">
            </div>
            <MuteButton audio={audio}/>
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
                    {second && second.username && (
                        <>
                        <img className="score profile-picture-2nd" src = {picture2} alt ="profilePicture">
                        </img>
                        <div className="score name-2nd">
                            {second.username}
                        </div>
                        <div className="score points-2nd">
                            {second.points}
                        </div>
                        </>
                    )}
                    {third && third.username && (
                        <>
                            <img className="score profile-picture-3rd" src={picture3} alt="profilePicture" />
                            <div className="score name-3rd">{third.username}</div>
                            <div className="score points-3rd">{third.points}</div>
                        </>
                    )}
                </div>
            </div>
            <div className = "roundover alert-div">
                {alert_message}
            </div>
            <div className = "lobby drop-out-alert-div">
                {drop_out_alert_message}
            </div>
            {button_newRound}

        </BaseContainer>
    );

};

export default RoundOver;

