import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/Login.scss';
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';

const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        type = {props.password}
        className="login input"
        placeholder={props.placeholder}
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
      localStorage.setItem('userId', user.id);

      history.push(`/home`);
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
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

                              <div className="login container">
                                <div className="login form">
                                <div className="login login-title">
                                 Signup
                                </div>
                              <FormField
                                password="text"
                                placeholder = "Username"
                                value={username}
                                onChange={un => setUsername(un)}
                              />
                              <FormField
                                password="password"
                                placeholder = "*******"
                                value={password}
                                onChange={n => setPassword(n)}
                              />
                              <div className="login button-container">
                                <Button className="button login-button-loginpage"
                                  style={{marginRight: "2px"}}
                                  disabled={!username || !password}
                                  width="50%"
                                  onClick={() => doRegistration()}
                                >
                            <div className="login login-text">
                                Create account
                            </div>
                                </Button>
                                <div className= "login login-line">
                                </div>
                            <div className="login register-text">
                              Already have an account? <a href="#" onClick={() => window.location.href = '/login'}>Log in</a>
                            </div>
              </div>
            </div>
          </div>
        </BaseContainer>
  );
};

export default Register;
