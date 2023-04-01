import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useParams} from 'react-router-dom';

const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder={props.placeholder}
        value={props.value}
        type = {props.type}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

const EditPage = props => {
  const history = useHistory();
  const [birthday, setBirthday] = useState(null);
  const [username, setUsername] = useState(null);
  const {userId} = useParams();

  const doUpdate = async () => {
    try {
      const requestBody = JSON.stringify({username, birthday});
      await api.put('/users/'+ userId, requestBody, {headers: {Token: localStorage.getItem("token")}});
      history.push(`/users/${userId}`);
    } catch (error) {
      alert(`Something went wrong during the process of editing the profile: \n${handleError(error)}`);
    }
  };

  if (localStorage.getItem("id") !== userId) {
    history.push("/homePage");
  }
  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            placeholder="enter here.."
            value={username}
            type = "text"
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Birthday"
            value={birthday}
            type = "date"
            onChange={n => setBirthday(n)}
          />
          <div className="login button-container">
            <Button
              style={{marginRight: "2px"}}
              width="50%"
              onClick={() => history.goBack()}
            >
              Back
            </Button>
            <Button
               style={{marginLeft: "2px"}}
               disabled={!username && !birthday}
               width="50%"
               onClick={() => doUpdate()}
             >
             Save
             </Button>
          </div>
        </div>
      </div>
    </BaseContainer>);

};

export default EditPage;
