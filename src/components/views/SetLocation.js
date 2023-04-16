import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/SetLocation.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Round from "../../models/Round";
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
  let gameId = localStorage.getItem("gameId");
  const [location, setlocation] = useState("");
  const [color, setColor] = useState("");
  const [hint, setHint] = useState("");
  const [map, setMap] = useState(null);
  const loader = new Loader({
    apiKey: process.env.YOUR_API_KEY, // Replace with your Google Maps API key
    version: 'weekly',
  });

  useEffect(() => {
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.36667, lng: 8.55 },
        zoom: 8,
      });
      setMap(map);
            google.maps.event.addListener(map, 'click', function(event) {
              setlocation({lat: event.latLng.lat(), lng: event.latLng.lng()});
            });
    });
  }, []);
      const handleColorChange = (event) => {
        setColor(event.target.value);
      };

      const handleHintChange = (event) => {
        setHint(event.target.value);
      };
  const startGame = async () => {
      try {
        const requestBody = JSON.stringify({location, color, hint});
        const response = await api.post('/games/${gameId}/rounds', requestBody);

        // Get the returned round
        const round = new Round(response.data);
        localStorage.setItem("roundId", round.id);


        history.push(`/games/${gameId}/round/${round.id}/guesses`);
      } catch (error) {
        alert(`Something went wrong during the starting process: \n${handleError(error)}`);
      }
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
                value={hint}
                onChange={handleHintChange}
                type = "text"
            />
            <div className= "setlocation readytext">
            Ready?
            </div>
            <Button className="start-button" onClick={startGame}

            >
                <div className="setlocation start-button-text">
                    Start
                </div>
            </Button>
        </BaseContainer>
    );
};

export default SetLocation;