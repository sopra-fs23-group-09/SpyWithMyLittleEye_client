import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/SetLocation.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useParams} from 'react-router-dom';

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

const SetLocation = props => {
    const history = useHistory();

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
                type = "text"
            />
            <FormFieldObject
                label="Enter your object:"
                placeholder="Your object..."
                type = "text"
            />
            <Button className="start-button"

            >
                <div className="setlocation start-button-text">
                    Start
                </div>
            </Button>
        </BaseContainer>

    );
};

export default SetLocation;

