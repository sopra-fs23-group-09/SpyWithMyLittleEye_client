import {Button} from 'components/ui/Button';
import 'styles/views/Code.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {api} from "../../helpers/api";
import { Icon } from '@iconify/react';





const FormField = props => {
    return (
        <div className="code field">
            <input
                type={props.accessCode}
                className="code input"
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
    accessCode : PropTypes.string
};

const Code = () => {
    const history = useHistory();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    let [accessCode, setAccessCode] = useState(null);


    const joinLobby = async () => {
        const requestBody = JSON.stringify({accessCode});
        const response = await api.put('/lobbies/join/' + userId, requestBody, {headers: {Token: token}});
        console.log(response);
        const lobbyId = response.data["id"]
        localStorage.setItem('lobbyId', lobbyId);

        history.push("/lobby/" + accessCode)
        // TODO check access code
    };

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
            <div className="code header">
                Code:
            </div>
            <FormField
                password = "accessCode"
                placeholder = "Enter your code..."
                value={accessCode}
                onChange={ac => setAccessCode(ac)}
            />
            <Button className="ok-button"
                    disabled={!accessCode}
                    onClick={() => {joinLobby()}}
            >
                <div className="rounds ok-button-text">
                    OK
                </div>
            </Button>
        </BaseContainer>
    );

};

export default Code;