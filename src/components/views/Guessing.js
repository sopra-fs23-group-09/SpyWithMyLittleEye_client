import 'styles/views/Guessing.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React from "react";
import PropTypes from "prop-types";
import {Button} from "../ui/Button";

const FormField = props => {
    return (
        <div className="guessing field">
            <input
                className="guessing input"
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

const Guessing = () => {
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
            <div className="guessing rounds">
                Round: ?/?
            </div>
            <div className="guessing time-left">
                Time-left
            </div>
            <div className="guessing role-container">
                <div className="guessing role-text">
                    You're a: ?
                </div>
            </div>
            <div className="guessing container">
                <div className="guessing header-container">
                    <div className="guessing header">
                        Guesses
                    </div>
                    <div className="guessing hint-container">
                        <div className="guessing hint-text">
                            Hint: The object is ?
                        </div>
                    </div>
                    <div className="guessers wrong-container">
                        <div className="guessers name">
                            Name
                        </div>
                        <div className="guessers wrong-guess">
                            Guess
                        </div>
                    </div>
                    <div className="guessers correct-container">
                        <div className="guessers name">
                            Name
                        </div>
                        <div className="guessers correct-guess">
                            GUESSED RIGHT
                        </div>
                    </div>
                </div>
                <FormField
                    placeholder="Enter your guess..."
                    type = "text"
                />
            </div>
        </BaseContainer>
    );

};

export default Guessing;
