import React, {useEffect, useState} from 'react';
import {api, getErrorMessage} from 'helpers/api';
import {Link,useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/EditPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useParams} from 'react-router-dom';
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
      <div className="mute-button" style={{ position: "absolute", top: "3vh", left: "8vw", backgroundColor: "transparent", border: "none" }}>
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
//        <FormField
//             label="Birthday"
//             value={birthday}
//             type = "date"
//             onChange={n => setBirthday(n)}
//           />
const FormFieldUsername = props => {
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
    <div className="user-edit-page username-field">
      <label className="user-edit-page username-label">
        {props.label}
      </label>
      <input
        className="user-edit-page username-input"
        placeholder={props.placeholder}
        value={props.value}
        type = {props.type}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

const FormFieldPassword = props => {
  return (
      <div className="user-edit-page password-field">
        <label className="user-edit-page password-label">
          {props.label}
        </label>
        <input
            className="user-edit-page password-input"
            placeholder={props.placeholder}
            value={props.value}
            type = {props.type}
            onChange={e => props.onChange(e.target.value)}
        />
      </div>
  );
};

FormFieldUsername.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

FormFieldPassword.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

const EditPage = () => {
  const history = useHistory();
  const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
  const [birthday] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const {userId} = useParams();

    let [alert_message, setAlert_Message] = useState(<div className="code alert-message"></div>);


    const doUpdate = async () => {
  audio.play();
    try {
      const requestBody = JSON.stringify({username, password, birthday});
      await api.put('/users/'+ userId, requestBody, {headers: {Token: localStorage.getItem("token")}});
      history.push(`/users/${userId}`);
    } catch (error) {
        let msg = getErrorMessage(error);
        console.log(msg);
        setAlert_Message(<Alert className ="code alert-message" severity="error"><b>Something went wrong while editing your profile:</b> {msg}</Alert>);
    }
  };

  /*if (localStorage.getItem("id") !== userId) {
    history.push("/home");
  }*/

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
      <MuteButton audio={audio}/>
      <div className="user-edit-page container">
          <FormFieldUsername
            label="Enter your new username:"
            placeholder="New username..."
            value={username}
            type = "text"
            onChange={un => setUsername(un)}
          />
          <FormFieldPassword
              label="Enter your new password:"
              placeholder="New password..."
              value={password}
              type = "text"
              onChange={pw => setPassword(pw)}
          />
          <Button className="edit-page-back-button"
              style={{marginRight: "2px"}}
              onClick={() => {
              audio.play();
              history.goBack();
              }}>
            <div className="user-edit-page back-button-text">
              Back
            </div>
          </Button>
          <Button className="edit-page-save-button"
              style={{marginLeft: "2px"}}
              disabled={!username && !password}
              onClick={() => doUpdate()}
          >
            <div className="user-edit-page save-button-text">
              Save
            </div>
          </Button>
      </div>
        <div className = "code alert-div">
            {alert_message}
        </div>
    </BaseContainer>);

};

export default EditPage;
