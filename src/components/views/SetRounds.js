import {Button} from 'components/ui/Button';
import 'styles/views/Rounds.scss';
import {Link, useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';

const FormField = (props) => {
  const { type, placeholder, value, onChange } = props;

  if (type === "number") {
    return (
      <div className="rounds field">
        <input
          type="number"
          className="rounds input" // Add the "rounds" class here
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (type === "dropdown") {
    return (
      <div className="rounds field">
        <select
          className="rounds input" // Add the "rounds" class here
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="1">1 minute</option>
          <option value="1.5">1.5 minutes</option>
          <option value="2">2 minutes</option>
          <option value="3">3 minutes</option>
          <option value="4">4 minutes</option>
        </select>
      </div>
    );
  }

  return null;
};



FormField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const SetRounds = () => {
    const history = useHistory();
    const [time, setTime] = useState(1);
    const [amountRounds, setAmountRounds] = useState(null);
    const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));


    async function createLobby() {
        audio.play();
        let token = localStorage.getItem("token");
        const requestBody = JSON.stringify({amountRounds, time});
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
            <div className="rounds container">
            <div className="rounds form">
            <div className="rounds header">
                How many rounds do you want to play?
            </div>
            <FormField
                type= "number"
                placeholder="Enter your number..."
                value={amountRounds}
                onChange={r => setAmountRounds(r)}
            />
            <div className="rounds header">
                How long should a round be?
            </div>
              <FormField
                type= "dropdown"
                placeholder="Enter amount of minutes..."
                value={time}
                onChange={t => setTime(parseFloat(t))}
              />
            <Button className="ok-button" onClick={() => createLobby()}>
                <div className="rounds ok-button-text">
                    OK
                </div>
            </Button>
           </div>
           </div>
        </BaseContainer>
    );

};

export default SetRounds;