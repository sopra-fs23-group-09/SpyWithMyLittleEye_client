import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = props => {
  return (
    <div className="register field">
      <label className="register label">
        {props.label}
      </label>
      <input
        type = {props.password}
        className="register input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  password: PropTypes.string
};

const Register = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);
      user.token = response.headers.token;

      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);

      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            password = "password"
            label="Password"
            value={password}
            onChange={n => setPassword(n)}
          />
          <div className="register button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegistration()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Register;
