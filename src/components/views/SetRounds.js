import {Button} from 'components/ui/Button';
import 'styles/views/Rounds.scss';
import {Link, useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';


const FormField = props => {
    return (
        <div className="rounds field">
            <input
                type="number"
                className="rounds input"
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const SetRounds = () => {
    const history = useHistory();
    const [amountRounds, setAmountRounds] = useState(null);


    async function createLobby() {
        let token = localStorage.getItem("token");
        const requestBody = JSON.stringify({amountRounds});
        try {
            const response = await api.post('/lobbies', requestBody, {headers: {Token: token}});
            console.log(response.data)
            const lobbyId = response.data["id"]
            localStorage.setItem('lobbyId', lobbyId);
            const accessCode = response.data["accessCode"]
            history.push("/lobby/" + accessCode)
        } catch (error) {
            alert(`Something went wrong: \n${handleError(error)}`);
        }
    }


    return (
        <BaseContainer>
            <Link to="/home" className="code left-field">
                <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4rem' }} />
            </Link>
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
                placeholder="Enter your number..."
                value={amountRounds}
                onChange={r => setAmountRounds(r)}
            />
            <Button className="ok-button" onClick={() => createLobby()}>
                <div className="rounds ok-button-text">
                    OK
                </div>
            </Button>
        </BaseContainer>
    );

};

export default SetRounds;