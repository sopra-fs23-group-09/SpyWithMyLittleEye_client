import {Button} from 'components/ui/Button';
import 'styles/views/Code.scss';
import {Link,useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, getErrorMessage} from "../../helpers/api";
import { Icon } from '@iconify/react';
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

const FormField = props => {
    const history = useHistory();
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


    return (
        <div className="code field">
            <input
                type={props.accessCode}
                className="code input"
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    accessCode : PropTypes.string
};

const Code = () => {
    const history = useHistory();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const [audio] = useState(new Audio('https://storage.cloud.google.com/soundss/decidemp3-14575.mp3'));
    let [accessCode, setAccessCode] = useState(null);
    let [alert_message, setAlert_Message] = useState(<div className="code alert-message"></div>);

    const joinLobby = async () => {
        audio.play();
        const requestBody = JSON.stringify({accessCode});
        try {
            const response = await api.put('/lobbies/join/' + userId, requestBody, {headers: {Token: token}});
            console.log(response);
            const lobbyId = response.data["id"]
            localStorage.setItem('lobbyId', lobbyId);

            history.push("/lobby/" + accessCode);
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
            setAlert_Message(<Alert className ="code alert-message" severity="error"><b>Something went wrong while joining the lobby:</b> {msg}</Alert>);
        }
    };

    return (
        <BaseContainer>
            <Link to="/home" className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4vw' }} />
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
            <div className="code header">
                Code:
            </div>
            <FormField
                password = "accessCode"
                placeholder = "Enter your code..."
                value={accessCode}
                onChange={ac => setAccessCode(ac)}
            />
            <Button className="ok-button"
                    disabled={!accessCode}
                    onClick={() => {joinLobby()}}
            >
                <div className="code ok-button-text">
                    OK
                </div>
            </Button>
            <div className = "code alert-div">
                {alert_message}
            </div>
        </BaseContainer>
    );

};

export default Code;
