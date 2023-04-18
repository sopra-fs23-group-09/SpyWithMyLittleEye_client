import {Button} from 'components/ui/Button';
import 'styles/views/Code.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";

const FormField = props => {
    return (
        <div className="code field">
            <input
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
};

const Code = () => {
    const history = useHistory();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const [accessCode, setAccessCode] = useState(null);


    const joinLobby = async () => {
        try {
            const requestBody = JSON.stringify({accessCode});
            const response = await api.put('/lobbies/' + userId, requestBody, {headers: {Token: token}});
            console.log(response);
            const accessCode = response.data["accessCode"]
            const lobbyId = response.data["lobbyId"]
            localStorage.setItem('lobbyId', lobbyId);

            history.push("/lobby/" + accessCode) // TODO "/lobby/"+lobbyId
        }  catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        }

    }

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
            <div className="code header">
                Code:
            </div>
            <FormField
                placeholder = "Enter your code..."
                value={accessCode}
                onChange={ac => setAccessCode(ac)}
            />
            <Button className="ok-button"
                    disabled={!accessCode}
                    onClick={() => joinLobby()}

            >
                <div className="rounds ok-button-text">
                    OK
                </div>
            </Button>
        </BaseContainer>
    );

};

export default Code;