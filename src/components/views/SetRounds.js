import {Button} from 'components/ui/Button';
import 'styles/views/Rounds.scss';
import {Link, useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, getErrorMessage} from "../../helpers/api";
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
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
const FormField = (props) => {
  const { type, placeholder, value, onChange } = props;
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

if (type === "number") {
  return (
    <div className="rounds field">
      <input
        type="number"
        className="rounds input" // Add the "rounds" class here
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue < 0) {
            onChange(0);
          } else if (newValue > 20) {
            onChange(20);
          } else {
            onChange(newValue);
          }
        }}
        onKeyPress={e => props.onKeyPress(e)}
      />
    </div>
  );
}

  if (type === "dropdown") {
    return (
      <div className="rounds field">
        <select
          className="rounds input" // Add the "rounds" class here
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="1">1 minute</option>
          <option value="1.5">1.5 minutes</option>
          <option value="2">2 minutes</option>
          <option value="3">3 minutes</option>
          <option value="4">4 minutes</option>
        </select>
      </div>
    );
  }

  return null;
};



FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
};

const SetRounds = () => {
    const history = useHistory();
    const [time, setTime] = useState(1);
    const [amountRounds, setAmountRounds] = useState(null);
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    let [alert_message, setAlert_Message] = useState(<div className="rounds alert-message"></div>);


    async function createLobby() {
        audio.play();
        let token = localStorage.getItem("token");
        const requestBody = JSON.stringify({amountRounds, time});
        try {
            const response = await api.post('/lobbies', requestBody, {headers: {Token: token}});
            console.log(response.data)
            const lobbyId = response.data["id"]
            localStorage.setItem('lobbyId', lobbyId);
            const accessCode = response.data["accessCode"]
            localStorage.setItem('accessCode', accessCode);
            history.push("/lobby/" + accessCode)
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
            setAlert_Message(<Alert className ="rounds alert-message" severity="error"><b>Something went wrong while joining the lobby:</b> {msg}</Alert>);
        }
    }

    function handleKeyPress(event) {
        console.log("Pressed key: " + event.key)
        if(event.key === "Enter"){
            createLobby()
        }
    }

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
            <div className="rounds container">
            <div className="rounds form">
            <div className="rounds header">
                How many rounds do you want to play?
            </div>
            <FormField
                type= "number"
                placeholder="Enter your number (1-20)"
                value={amountRounds}
                onChange={r => setAmountRounds(r)}
                onKeyPress={handleKeyPress}
            />
            <div className="rounds header">
                How long should a round be?
            </div>
              <FormField
                type= "dropdown"
                placeholder="Enter amount of minutes..."
                value={time}
                onChange={t => setTime(parseFloat(t))}
              />
            <Button className="ok-button" onClick={() => createLobby()}>
                <div className="rounds ok-button-text">
                    OK
                </div>
            </Button>
           </div>
           </div>
            <div className = "rounds alert-div">
                {alert_message}
            </div>
        </BaseContainer>
    );

};

export default SetRounds;