
import 'styles/views/Waitingroom.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";

const Waitingroom = () => {
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
            <div className="waitingroom header">
                WAITING...
            </div>
        </BaseContainer>
    );

};

export default Waitingroom;
