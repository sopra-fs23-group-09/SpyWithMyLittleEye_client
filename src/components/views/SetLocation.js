import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/SetLocation.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {api, handleError} from 'helpers/api';
import {Icon} from '@iconify/react';
import 'styles/views/Code.scss';
import {notifySpiedObject, connect, getConnection, subscribe, unsubscribe} from "../../helpers/stompClient";
import {Loader} from "@googlemaps/js-api-loader"


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
    const token = localStorage.getItem("token");

    const [location, setlocation] = useState("");
    const [color, setColor] = useState("");
    const [object, setObject] = useState("");
    const [currentRound, setCurrentRound] = useState(null);
    const [amountOfRounds, setAmountOfRounds] = useState(null);

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
            subscribeToSetLocationInformation();
        } else {
            connect(subscribeToSetLocationInformation)
        }

        function subscribeToSetLocationInformation() {
            subscribe("/topic/games/" + gameId + "/spiedObject", data => {});
        }
    }, [gameId]);

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
                const response = await api.get('/game/' + lobbyId + '/roundnr/', {headers: {Token: token}});
                const currentRound = response.data["currentRound"];
                const amountOfRounds = response.data["totalRounds"];
                setCurrentRound(currentRound);
                setAmountOfRounds(amountOfRounds);
            } catch (error) {
                alert(`Something went wrong: \n${handleError(error)}`);
            }
        };

        displayCurrentRound();
    }, []);

    function startGame() {
        const lobbyId = localStorage.getItem("lobbyId");
        localStorage.setItem("location", JSON.stringify(location));
        localStorage.setItem("color", JSON.stringify(color));
        notifySpiedObject(lobbyId, location, color, object, token);
        unsubscribe("/topic/games/" + gameId + "/spiedObject");
        history.push("/game/" + lobbyId);
    }

    return (
        <BaseContainer>
            <div className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{fontSize: '4rem'}}/>
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
        </BaseContainer>
    );
}

export default SetLocation;