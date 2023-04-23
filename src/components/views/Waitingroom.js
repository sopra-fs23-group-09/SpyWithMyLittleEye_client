import 'styles/views/Waitingroom.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import {connect, getConnection, subscribe} from "../../helpers/stompClient";
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';

const Waitingroom = () => {
    const history = useHistory();
    const gameId = localStorage.getItem("gameId"); // TODO this is equal to lobbyId
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let guesser = false;


    useEffect(async () => {
        const response = await api.get("/game/" + gameId + "/roleForUser/" + userId, {headers: {Token: token}});
        const role = response["data"];
        if (role === "SPIER") {
            console.log("You're a spier this round.")
            history.push("/game/" + gameId + "/location")
        } else if (role === "GUESSER"){
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
            <div className="start-page rules-text">
                You are a GUESSER this round!
                As soon as the SPIER has picked their object, you will be redirected to the game page.
            </div>
        </BaseContainer>
    );

};

export default Waitingroom;
