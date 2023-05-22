import React, {useState, useEffect} from 'react';
import {api, getErrorMessage} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Icon} from '@iconify/react';
import 'styles/views/Code.scss';
import {Alert} from "@mui/material";
import eyeClosedIcon from '@iconify-icons/ph/eye-closed-bold';
import eyeOpenIcon from '@iconify-icons/ph/eye-bold';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      {props.password ? (
      <div className="login password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            className="login input-password"
            placeholder={props.placeholder}
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            onKeyDown={e => props.onKeyPress(e)}
          />
          <div className="login password-toggle" onClick={handleTogglePassword}>
            <Icon
              icon={showPassword ? eyeOpenIcon : eyeClosedIcon}
              color="gray"
              style={{ fontSize: '4vh'}}
            />
          </div>
      </div>
      ) : (
        <input
          type="text"
          className="login input-username"
          placeholder={props.placeholder}
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
          onKeyDown={e => props.onKeyPress(e)}
        />
      )}
    </div>
  );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    password: PropTypes.string,
    onKeyPress: PropTypes.func
};

const Login = () => {
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
    let [alert_message, setAlert_Message] = useState(<div className="login alert-message"></div>);

    const doLogin = async () => {
        try {
            audio.play();
        } catch (e) {
            console.log("Failed to play sound.")
        }

        try {
            const response = await api.get('/users/login?username=' + username + '&pass=' + password);
            const token = response.headers.token;
            const id = response.headers.id;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', id);
            localStorage.setItem("username", username);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/home`);
        } catch (error) {
            let msg = getErrorMessage(error);
            console.log(msg);
            setAlert_Message(<Alert className="login alert-message" severity="error"><b>Something went wrong during
                login:</b> {msg}</Alert>);
        }
    };

    function handleKeyPress(event) {
        if(event.key === "Enter" && username && password) {
            doLogin()
        }
    }

    return (
        <BaseContainer>
            <div className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{fontSize: '4vw'}}/>
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
            <div className="login container">
                <div className="login form">
                    <div className="login login-title">
                        Login
                    </div>
                    <FormField
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                        onKeyPress={handleKeyPress}

                    />
                    <FormField
                        password="password"
                        placeholder="*******"
                        value={password}
                        onChange={n => setPassword(n)}
                        onKeyPress={handleKeyPress}

                    />
                    {alert_message}
                    <div className="login button-container">
                        <Button className="login-button-loginpage"
                                disabled={!username || !password}
                                onClick={() => doLogin()}
                        >
                            <div className="login login-text">
                                Login
                            </div>
                        </Button>
                    </div>
                    <div className="login login-line">
                    </div>
                    <div className="login register-text">
                        Don’t have an account yet? <a href="/Register">Sign up</a>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
