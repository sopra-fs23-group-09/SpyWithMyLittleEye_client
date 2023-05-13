import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/SetLocation.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {api, getErrorMessage} from 'helpers/api';
import {Icon} from '@iconify/react';
import 'styles/views/Code.scss';
import {notifySpiedObject, connect, getConnection, subscribe, unsubscribe} from "../../helpers/stompClient";
import {Loader} from "@googlemaps/js-api-loader"
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

const FormFieldObject = props => {
    return (
        <div className="setlocation object-field">
            <label className="setlocation object-label">
                {props.label}
            </label>
            <input
                className="setlocation object-input"
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                type={props.type}
            />
        </div>
    );
};
const FormFieldColor = props => {
    return (
        <div className="setlocation color-field">
            <label className="setlocation color-label">
                {props.label}
            </label>
            <input
                className="setlocation color-input"
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                type={props.type}
            />
        </div>
    );
};
FormFieldObject.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string
};
FormFieldColor.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string
};
const SetLocation = (props) => {
    const history = useHistory();
    const gameId = localStorage.getItem("gameId");
    const lobbyId = localStorage.getItem("lobbyId");
    const token = localStorage.getItem("token");

    const [location, setlocation] = useState("");
    const [color, setColor] = useState("");
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
    const [object, setObject] = useState("");
    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);

    let [alert_message, setAlert_Message] = useState(<div className="setlocation alert-message"></div>);
    //let [alert_message, setAlert_Message] = useState(<Alert className ="setlocation alert-message" severity="error"><b>Something went wrong when starting the game:</b> ddjjd</Alert>);

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

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyANPbeW_CcEABRwu38LTYSi_Wc43QV-GuQ", // Replace with your Google Maps API key
            version: 'weekly',
        });
        loader.load().then(() => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: {lat: 47.36667, lng: 8.55},
                zoom: 8,
            });
            const streetView = map.getStreetView();

            // Add event listener for the click event on the map
            map.addListener('click', (event) => {
                const newLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                setlocation(newLocation);
                console.log("Location set to:", newLocation);
            });

            // Add event listener for the position_changed event on the street view object
            streetView.addListener('position_changed', () => {
                const newPosition = streetView.getPosition();
                setlocation({
                    lat: newPosition.lat(),
                    lng: newPosition.lng()
                });
                console.log("Street view position changed to:", {
                    lat: newPosition.lat(),
                    lng: newPosition.lng()
                });
            });
        });

    }, []);



    useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            makeSubscription();
        } else {
            connect(makeSubscription);
        }

        function makeSubscription() {
            subscribeToSetLocationInformation();
            subscribeToUserDropOut();
        }


        function subscribeToSetLocationInformation() {
            subscribe("/topic/games/" + gameId + "/spiedObject", data => {
                localStorage.setItem("duration", data["duration"]);
            });
            unsubscribe("/topic/games/" + gameId + "/spiedObject");

        }

        function subscribeToUserDropOut() {
            subscribe("/topic/games/" + gameId+ "/userDropOut", data => {
                alert("Someone dropped out!");
                console.log(data);
                // Shouldnt matter to u

            });
        }
    }, [gameId, history, lobbyId]);



    const handleColorChange = (event) => {
        setColor(event.target.value);
        console.log("Color set to:", event.target.value);
    };

    const handleObjectChange = (event) => {
        setObject(event.target.value);
        console.log("Hint set to:", event.target.value);
    };
    useEffect(() => {
        const lobbyId = localStorage.getItem("lobbyId");
        const token = localStorage.getItem("token");

        const displayCurrentRound = async () => {

            try {
                const response = await api.get('/games/' + lobbyId + '/roundnr/', {headers: {Token: token}});
                const currentRound = response.data["currentRound"];
                const amountOfRounds = response.data["totalRounds"];
                setCurrentRound(currentRound);
                setAmountOfRounds(amountOfRounds);
            } catch (e) {
                let msg = getErrorMessage(e);
                console.log(msg);
                setAlert_Message(<Alert className ="setlocation alert-message" severity="error"><b>Something went wrong when fetching the data:</b> {msg}</Alert>);
            }
        };

        displayCurrentRound();
    }, []);

    function startGame() {
        audio.play();
        localStorage.setItem("location", JSON.stringify(location));
        localStorage.setItem("color", JSON.stringify(color));
        notifySpiedObject(lobbyId, location, color, object, token);
    }

    return (
        <BaseContainer>
            <div className ="code left-field">
              <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4vw'}}/>
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
            <div className="setlocation header">
                Choose a location by dragging the figurine into it
            </div>
            <div className="setlocation container">
                <div id="map" style={{height: '100%', width: '100%'}}></div>
            </div>
            <div className="setlocation role-container">
                <div className="setlocation role-text">
                    You're a: SPIER
                </div>
            </div>
            <div className="setlocation rounds-container">
                <div className="setlocation rounds">
                    Round: {currentRound}/{amountOfRounds}
                </div>
            </div>
            <FormFieldColor
                label="Enter color of the object:"
                placeholder="The color of my object is..."
                value={color}
                onChange={handleColorChange}
                type="text"
            />
            <FormFieldObject
                label="Enter your object:"
                placeholder="Your object..."
                value={object}
                onChange={handleObjectChange}
                type="text"
            />
            <div className="setlocation readytext">
                Ready?
            </div>
            <Button className="start-button"
                    disabled={!color || !object}
                    onClick={() => startGame()}

            >
                <div className="setlocation start-button-text">
                    Start
                </div>
            </Button>
            <div className = "setlocation alert-div">
                {alert_message}
            </div>
        </BaseContainer>
    );
}

export default SetLocation;