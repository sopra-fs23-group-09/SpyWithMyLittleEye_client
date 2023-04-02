import {Button} from 'components/ui/Button';
import 'styles/views/Rounds.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React from "react";
import PropTypes from "prop-types";


const FormField = props => {
    return (
        <div className="rounds field">
            <input
                className="rounds input"
                placeholder={props.placeholder}
                value={props.value}
                //onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const Rounds = () => {
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
            <div className="rounds header">
                How many rounds do you want to play?
            </div>
            <FormField
                placeholder = "Enter your number..."
                //value={username}
                //onChange={un => setUsername(un)}
            />
            <Button className="ok-button"

            >
                <div className="rounds ok-button-text">
                    OK
                </div>
            </Button>
        </BaseContainer>
    );

};

export default Rounds;