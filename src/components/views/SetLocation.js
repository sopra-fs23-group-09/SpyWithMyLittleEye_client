import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/SetLocation.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Round from "../../models/Round";
import Lobby from 'models/Lobby.js';
import {notifySpiedObject,connect,getConnection,subscribe} from "../../helpers/stompClient";
import {useParams} from 'react-router-dom';
import { Loader } from "@googlemaps/js-api-loader"


let map: google.maps.Map;
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
                type = {props.type}
            />
        </div>
    );
};
const FormFieldColor= props => {
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
                type = {props.type}
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
  let lobbyId = localStorage.getItem("lobbyId");
  let gameId = localStorage.getItem("gameId");
  const [location, setlocation] = useState("");
  const [color, setColor] = useState("");
  const [object, setObject] = useState("");
  const [map, setMap] = useState(null);
  const loader = new Loader({
    apiKey: 'AIzaSyANPbeW_CcEABRwu38LTYSi_Wc43QV-GuQ', // Replace with your Google Maps API key
    version: 'weekly',
  });
  useEffect(() => {
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.36667, lng: 8.55 },
        zoom: 8,
      });
      const streetView = map.getStreetView();
      setMap(map);

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

    function subscribeToSetLocationInformation() {
    }
  useEffect(() => {
        console.log("Connected: " + getConnection())
        if (getConnection()) {
            subscribeToSetLocationInformation();
        } else {
            connect(subscribeToSetLocationInformation)
        }
    },[]);
      const handleColorChange = (event) => {
        setColor(event.target.value);
        console.log("Color set to:", event.target.value);
      };

      const handleObjectChange = (event) => {
        setObject(event.target.value);
        console.log("Hint set to:", event.target.value);
      };
  function startGame() {
    notifySpiedObject(lobbyId, location, color, object);
    history.push(`game/ + lobbyId`);
    };

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
            <div className="setlocation header">
                Choose a location by dragging the figurine into it
            </div>
            <div className="setlocation container">
                    <div id="map"style={{ height: '100%', width: '100%' }}></div>
            </div>
            <div className="setlocation role-container">
                <div className="setlocation role-text">
                    You're a: Spier
                </div>
            </div>
            <div className="setlocation rounds">
                Round: ?/?
            </div>
            <FormFieldColor
                label="Enter color of the object:"
                placeholder="The color of my object is..."
                value={color}
                onChange={handleColorChange}
                type = "text"
            />
            <FormFieldObject
                label="Enter your object:"
                placeholder="Your object..."
                value={object}
                onChange={handleObjectChange}
                type = "text"
            />
            <div className= "setlocation readytext">
            Ready?
            </div>
            <Button className="start-button"
            disabled={!color || !object}
            onClick={()=>startGame()}

            >
                <div className="setlocation start-button-text">
                    Start
                </div>
            </Button>
        </BaseContainer>
    );
};

export default SetLocation;