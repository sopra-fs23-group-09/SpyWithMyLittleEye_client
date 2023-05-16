import 'styles/views/Waitingroom.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {connect, getConnection, subscribe, unsubscribe} from "../../helpers/stompClient";
import React, {useEffect, useState} from "react";
import {api, getErrorMessage} from "../../helpers/api";
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
import {Alert} from "@mui/material";


const Waitingroom = () => {
    const history = useHistory();
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    let [reload, setReload] = useState(0);

    let [alert_message, setAlert_Message] = useState(<div className="waitingroom alert-message"></div>);
    //let [alert_message, setAlert_Message] = useState(<Alert className ="code alert-message" severity="error"><b>Something went wrong while joining the lobby:</b> nf</Alert>);
    let [drop_out_alert_message, setDrop_out_alert_message] =
        useState(<div className="waitingroom drop-out-alert-message"></div>);
    //useState(<Alert className ="lobby drop-out-alert-message" severity="warning" onClose={() => {setDrop_out_alert_message(<div className="lobby drop-out-alert-message"></div>)}}><b>친구</b> has left the game! </Alert>);

    let [role, setRole] = useState(null)

    useEffect(() => {
        const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/08/03/audio_a567664e9d.mp3?filename=waiting-music-116216.mp3");
        audio.loop = true;
        audio.play();
        return () => {
            audio.pause();
        }
    }, []);


    // TODO Duplicated code
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
        if ((!(localStorage.getItem("token"))) || (!(localStorage.getItem("username")))) { // ure dropped out?
            console.log("I don't have the info anymore!!!!")
            history.push("/start");
        }
    }, [history])


    useEffect( () => {
        async function fetchData() {
            try {
                const response = await api.get("/games/" + gameId + "/roleForUser/" + userId, {headers: {Token: token}});
                console.log(response)
                const role = response["data"];
                setRole(response["data"]);
                localStorage.setItem("role", role);
                if (role.toString() === ("SPIER").toString()) {
                    console.log("You're a spier this round.")
                   // if (getConnection()) { TODO Thereza: I need to test this properly before pushing
                       unsubscribe("/topic/games/" + gameId + "/userDropOut");
                       unsubscribe("/topic/games/" + gameId + "/spiedObject");
                    //}
                    history.push("/game/" + gameId + "/location")
                } else if (role.toString() === ("GUESSER").toString()) {
                    console.log("You're a guesser this round.")
                } else {
                    console.log("WARNING: Your role is not defined.")
                }
            } catch (e) {
                let msg = getErrorMessage(e);
                console.log(msg);
                setAlert_Message(<Alert className ="code alert-message" severity="error"><b>Something went wrong while fetching the data:</b> {msg}</Alert>);
            }
        }
        fetchData();
    }, [gameId, history, token, userId, reload]);

    useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            makeSubscription();
        } else {
            connect(makeSubscription)
        }

        function makeSubscription()  {
            subscribeToSpiedObjectInformation();
            subscribeToUserDropOut();
        }

        function subscribeToSpiedObjectInformation() {
            subscribe("/topic/games/" + gameId + "/spiedObject", data => {
                localStorage.setItem("location", JSON.stringify(data["location"]));
                localStorage.setItem("color", JSON.stringify(data["color"]))
                localStorage.setItem("duration", data["duration"])
                redirectToRound();
            });
        }

        function subscribeToUserDropOut() {
            subscribe("/topic/games/" + gameId+ "/userDropOut", data => {
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
                                                         unsubscribe("/topic/games/" + gameId + "/spiedObject");
                                                         unsubscribe("/topic/games/" + gameId+ "/userDropOut");
                                                         history.push("/game/"+gameId+"/score");
                                                     }}>
                        <b>{data.name}</b> has left the game! The game is over.</Alert>);
                } else {
                    if (data.role.toString() === "SPIER") {
                        console.log("SPIER DROPPED OUT")
                        setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                         onClose={() => {
                                                             setDrop_out_alert_message(<div
                                                                 className="lobby drop-out-alert-message"></div>);
                                                             setReload(reload+1);
                                                             // TODO : reload needed?
                                                         }}>
                            The SPIER <b>{data.name}</b> has left the game! </Alert>);
                    }
                    console.log("USER DROPPED OUT")
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                         setReload(reload+1);
                                                         // TODO : reload needed?
                                                     }}>
                        <b>{data.name}</b> has left the game! </Alert>);
                }
            });
        }

        function redirectToRound() {
            unsubscribe("/topic/games/" + gameId+ "/userDropOut");
            unsubscribe("/topic/games/" + gameId + "/spiedObject");
            history.push("/game/" + gameId);
        }

    }, [gameId, history, reload, username]);

    let messageForGuessers = (<div></div>)
    if ((role) && (role.toString() === ("GUESSER"))) {
        messageForGuessers = (<div></div>)
    }

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
            <div className="waitingroom header">
                WAITING...
            </div>
            {messageForGuessers}
            <div className="waitingroom information">
                You are a GUESSER this round.
                Enjoy this calming music and this adorable cat until the spier is ready to start!
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative', zIndex: '1' }}>
              <img
                src="https://media.tenor.com/4MsBgyiY65YAAAAi/cat-peach.gif"
                alt="Cat Peach Sticker - Cat Peach Tap Stickers"
                style={{ height: '15em', width: '15em', position: 'absolute', top:"22em" }}
              />
            </div>
            <div className = "waitingroom alert-div">
                {alert_message}
            </div>
            <div className = "waitingroom drop-out-alert-div">
                {drop_out_alert_message}
            </div>
        </BaseContainer>
    );

};

export default Waitingroom;
