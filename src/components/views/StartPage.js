import {Button} from 'components/ui/Button';
import 'styles/views/StartPage.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
import React, {useState,useEffect} from "react";
import {disconnect} from "../../helpers/stompClient";

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
      <div className="mute-button" style={{ position: "absolute", top: "2vh", left: "1vw", backgroundColor: "transparent", border: "none" , zIndex:900}}>
        <button onClick={handleMuteClick} style={{ backgroundColor: "transparent", border: "none" , zIndex:900}}>
                      {isMuted ? (
                        <Icon icon="ph:speaker-slash-bold" color="white" style={{ fontSize: '6vh', zIndex: 900 }} />
                      ) : (
                        <Icon icon="ph:speaker-high-bold" color="white" style={{ fontSize: '6vh', zIndex:900 }} />
                      )}
        </button>
      </div>
    );
  };
const StartPage = () => {
    const history = useHistory();
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

    useEffect(() => {
        // clear local storage
        disconnect();
        console.log("I am no longer alive....")
        clearInterval(parseInt(localStorage.getItem('intervalId')));
        localStorage.clear();
    }, []);

    return (
    <body id="home">
        <BaseContainer>
        <MuteButton audio={audio}/>
        <div className="start-page container">
            <div className="start-page game-title">
                I spy with my little eye
            </div>
            <div className="start-page eye-left">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4.5vw'}}/>
            </div>
            <div className="start-page eye-right">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4.5vw'}}/>
            </div>
            <div className="start-page nose">
                Y
            </div>
            </div>
            <Button className="login-button-start-page" onClick={() => {
            try {
                audio.play();
            } catch (e) {
                console.log("Failed to play sound.")
            }
            history.push('/login');
            }}>
                <div className="start-page login-button-text">
                    Log in
                </div>
            </Button>
            <Button className="signup-button-start-page" onClick={() => {
            try {
                audio.play();
            } catch (e) {
                console.log("Failed to play sound.")
            }
            history.push('/signup');
            }}>
                <div className="start-page signup-button-text">
                    Sign up
                </div>
            </Button>
            <div className="start-page instructions-container">
                <div className="start-page header-intro">
                    Looking for a game that will keep you and your friends entertained for hours?
                </div>
                <div className="start-page introduction-text">
                    Look no further than "I Spy with My Little Eye"! This classic game has been enjoyed by generations
                    of children and adults and it's sure to provide hours of excitement and laughter. With every round,
                    you'll be on the edge of your seat, trying to figure out the clues and beat your opponents.
                    And the best part is, you will never get bored:  Thanks to the Google Maps API our game
                    never gets old, and there's always a new and exciting place on this earth for you to discover.
                </div>
                <div className="start-page header-rules">
                    Rules
                </div>
                <div className="start-page rules-text">
                    After logging in, you can directly start the game and generate a code. Up to 10 friends or family
                    members can join you, by entering the code. It’s up to you how many rounds you want to play! If you
                    started the game, you will be the first spier. Decide on an object in the 360° google view. Enter
                    the object and a hint, and let the guessers guess.The faster one guesses, the more points one will
                    get. Don’t forget to compare your scores afterwards!
                </div>
            </div>
            <div className="start-page credits"> Software Engineering Lab FS2023 
            </div>
        </BaseContainer>
        </body>
    );

};

export default StartPage;