import 'styles/views/Waitingroom.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import {connect, getConnection, requestRoundInformation, subscribe} from "../../helpers/stompClient";
import Lobby from "../../models/Lobby";

const Waitingroom = () => {
    const history = useHistory();
    const gameId = localStorage.getItem("gameId"); // TODO this is equal to lobbyId
    const userId = localStorage.getItem("userId");
    let guesser = false;


    useEffect(() => {
        // TODO REST request
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            subscribeToWaitingRoomInformation()
        } else {
            connect(subscribeToWaitingRoomInformation())
        }
    }, []);

    function subscribeToWaitingRoomInformation() {
        // TODO TO something else
        subscribe("/topic/games/" + gameId + "/round", data => {
            console.log("Inside callback");
            let event = data["event"];
            console.log(data);
            if (event) {
                if (event === "roleDistribution") {
                    console.log("INFORMATION ON ROLE DISTRIBUTION")
                    let roles = data["roles"]
                    let role = roles[userId]
                    if (role === "SPIER") {
                        history.push("/game/" + gameId + "/location")
                    } else {
                        guesser = true;
                    }
                } else if (event === "startedRound") {
                    console.log("STARTED ROUND");
                    redirectToRound();
                }
            } else {
                console.log("NO EVENT DEFINED!");
            }

        });
        requestRoundInformation(gameId);
    }

    function redirectToRound() {
        history.push("/game/" + gameId); // TODO is this right
    }

    let messageForGuessers = (<div></div>)
    if (guesser) {
        messageForGuessers = (<div></div>)
    }

    return (
        <BaseContainer>
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
