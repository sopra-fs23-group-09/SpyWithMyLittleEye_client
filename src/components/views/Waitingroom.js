import 'styles/views/Waitingroom.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {connect, getConnection, subscribe, unsubscribe} from "../../helpers/stompClient";
import React, {useEffect} from "react";
import {api} from "../../helpers/api";
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';

const Waitingroom = () => {
    const history = useHistory();
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let guesser = false;


    useEffect(async () => {
        const response = await api.get("/game/" + gameId + "/roleForUser/" + userId, {headers: {Token: token}});
        const role = response["data"];
        if (role.toString() === ("SPIER").toString()) {
            console.log("You're a spier this round.")
            history.push("/game/" + gameId + "/location")
        } else if (role.toString() === ("GUESSER").toString()){
            console.log("You're a guesser this round.")
            guesser = true;
            console.log("Connected: " + getConnection())
            if (getConnection()) {
                subscribeToSpiedObjectInformation()
            } else {
                connect(subscribeToSpiedObjectInformation)
            }
        } else {
            console.log("WARNING: Your role is not defined.")
        }
    }, []);

    function subscribeToSpiedObjectInformation() {
        subscribe("/topic/games/" + gameId + "/spiedObject", data => {
            console.log("Inside callback");
            console.log(data["location"]);
            console.log(data["color"]);
            localStorage.setItem("location", JSON.stringify(data["location"]));
            localStorage.setItem("color", JSON.stringify(data["color"]))
            redirectToRound();
        });
        unsubscribe("/topic/games/" + gameId + "/spiedObject");
    }

    function redirectToRound() {
        history.push("/game/" + gameId);
    }

    let messageForGuessers = (<div></div>)
    if (guesser) {
        messageForGuessers = (<div></div>)
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
            <div className="waitingroom header">
                WAITING...
            </div>
            {messageForGuessers}
            <div className="start-page rules-text">
                You are a GUESSER this round!
                As soon as the SPIER has picked their object, you will be redirected to the game page.
            </div>
        </BaseContainer>
    );

};

export default Waitingroom;
