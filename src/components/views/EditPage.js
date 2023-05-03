import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/EditPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useParams} from 'react-router-dom';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';

//        <FormField
//             label="Birthday"
//             value={birthday}
//             type = "date"
//             onChange={n => setBirthday(n)}
//           />
const FormFieldUsername = props => {
  return (
    <div className="user-edit-page username-field">
      <label className="user-edit-page username-label">
        {props.label}
      </label>
      <input
        className="user-edit-page username-input"
        placeholder={props.placeholder}
        value={props.value}
        type = {props.type}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

const FormFieldPassword = props => {
  return (
      <div className="user-edit-page password-field">
        <label className="user-edit-page password-label">
          {props.label}
        </label>
        <input
            className="user-edit-page password-input"
            placeholder={props.placeholder}
            value={props.value}
            type = {props.type}
            onChange={e => props.onChange(e.target.value)}
        />
      </div>
  );
};

FormFieldUsername.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

FormFieldPassword.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

const EditPage = () => {
  const history = useHistory();
  const [birthday] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const {userId} = useParams();

  const doUpdate = async () => {
    try {
      const requestBody = JSON.stringify({username, password, birthday});
      await api.put('/users/'+ userId, requestBody, {headers: {Token: localStorage.getItem("token")}});
      history.push(`/users/${userId}`);
    } catch (error) {
      alert(`Something went wrong during the process of editing the profile: \n${handleError(error)}`);
    }
  };

  if (localStorage.getItem("id") !== userId) {
    history.push("/home");
  }
  return (
    <BaseContainer>
                    <div className="code left-field">
                      <Icon icon="ph:eye-closed-bold" color="white" style={{ fontSize: '4rem'}}/>
                    </div>
      <div className="base-container ellipse1">
      </div>
      <div className="base-container ellipse2">
      </div>
      <div className="base-container ellipse3">
      </div>
      <div className="base-container ellipse4">
      </div>
      <div className="user-edit-page container">
          <FormFieldUsername
            label="Enter your new username:"
            placeholder="New username..."
            value={username}
            type = "text"
            onChange={un => setUsername(un)}
          />
          <FormFieldPassword
              label="Enter your new password:"
              placeholder="New password..."
              value={password}
              type = "text"
              onChange={pw => setPassword(pw)}
          />
          <Button className="edit-page-back-button"
              style={{marginRight: "2px"}}
              onClick={() => history.goBack()}
            >
            <div className="user-edit-page back-button-text">
              Back
            </div>
          </Button>
          <Button className="edit-page-save-button"
              style={{marginLeft: "2px"}}
              disabled={!username && !password}
              onClick={() => doUpdate()}
          >
            <div className="user-edit-page save-button-text">
              Save
            </div>
          </Button>
      </div>
    </BaseContainer>);

};

export default EditPage;
