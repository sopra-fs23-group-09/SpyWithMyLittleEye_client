import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        type={props.password}
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

const Login = props => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const doLogin = async () => {
    try {
      const response = await api.get('/users/login?username='+ username + '&pass='+ password);
      const token = response.headers.token;
      const id = response.headers.id;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/home`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

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

                          <div className="login container">
                            <div className="login form">
                            <div className="login login-title">
                              Login
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
                              onClick={() => doLogin()}
                            >
                        <div className="login login-text">
                            Login
                        </div>
                            </Button>
                            <div className= "login login-line">
                            </div>
                        <div className="login register-text">
                          Don’t have an account yet? <a href="#" onClick={() => window.location.href = '/Register'}>Sign up</a>
                        </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
