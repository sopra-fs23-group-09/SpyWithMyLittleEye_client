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
    const username = localStorage.getItem("username");
    //let [reload,setReload] = useState(0);


    const [location, setlocation] = useState("");
    const [color, setColor] = useState("");
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));
    const [object, setObject] = useState("");
    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);

    let [alert_message, setAlert_Message] = useState(<div className="setlocation alert-message"></div>);
    //let [alert_message, setAlert_Message] = useState(<Alert className ="setlocation alert-message" severity="error"><b>Something went wrong when starting the game:</b> ddjjd</Alert>);
    let [drop_out_alert_message, setDrop_out_alert_message] =
        useState(<div className="lobby drop-out-alert-message"></div>);
    //useState(<Alert className ="lobby drop-out-alert-message" severity="warning" onClose={() => {setDrop_out_alert_message(<div className="lobby drop-out-alert-message"></div>)}}><b>친구</b> has left the game! </Alert>);


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

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your Google Maps API key
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
                localStorage.setItem("location", JSON.stringify(data["location"]));
                localStorage.setItem("color", JSON.stringify(data["color"]))
                unsubscribe("/topic/games/" + gameId + "/spiedObject");
                unsubscribe("/topic/games/" + lobbyId+ "/userDropOut");
                history.push("/game/" + gameId);
                //TODO Thereza: I need to test this properly before pushing
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
                                                         history.push("/game/"+lobbyId+"/score");
                                                     }}>
                        <b>{data.name}</b> has left the game! The game is over.</Alert>);
               /** } else if ((hostId) && data.host) {
                    console.log("HOST DROPPED OUT")
                    setHostId(data.newHostId);
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                     }}>
                        <b>{data.name}</b> has left the game! A new host has been assigned. </Alert>);**/
                }else {
                    console.log("USER DROPPED OUT")
                    setDrop_out_alert_message(<Alert className="lobby drop-out-alert-message" severity="warning"
                                                     onClose={() => {
                                                         setDrop_out_alert_message(<div
                                                             className="lobby drop-out-alert-message"></div>);
                                                         //setReload(reload+1);
                                                         // TODO : reload needed?
                                                     }}>
                        <b>{data.name}</b> has left the game! </Alert>);
                }
            });
        }
    }, [gameId, history, lobbyId, username]);



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
            <div className="setlocation header">
                Choose a location by dragging the figurine into it
            </div>
            <div className="setlocation container">
                <div id="map" style={{height: '100%', width: '100%'}}></div>
            </div>
            <div className="setlocation role-container">
                <div className="setlocation role-text">
                    You're a: Spier
                </div>
            </div>
            <div className="setlocation rounds">
                Round: {currentRound}/{amountOfRounds}
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
            <div className = "lobby drop-out-alert-div">
                {drop_out_alert_message}
            </div>
        </BaseContainer>
    );
}

export default SetLocation;