import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/UserPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import {useHistory, useParams} from 'react-router-dom';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';

const UserPage = () => {


  const history = useHistory();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  useEffect(() => {
      const retrieveUserData = async () => {
          try {
              const response = await api.get('/users/'+userId, {headers: {Token: token}});
              setUser(response.data);
              console.log(user.id);
          } catch (error) {
              console.log("Couldn't fetch user information\n" + handleError(error));
          }
      };
      retrieveUserData();
  }, [])



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
           <div className="userPage container">
               <div className="userPage username-container">
                   <div className="userPage username-text">
                       Username: {user?.username}
                   </div>
               </div>
               <div className="userPage score-container">
                   <div className="userPage score">
                        Score: {user?.highScore}
                   </div>
               </div>
               <div className="userPage games-played-container">
                   <div className="userPage games-played-text">
                       Games played: {user?.gamesPlayed}
                   </div>
               </div>
               <div className="userPage games-won-container">
                   <div className="userPage games-won-text">
                       Games won: {user?.gamesWon}
                   </div>
               </div>
               <Button className="userPage-back-button"
                       onClick={() => history.push("/home")}
               >
                   <div className="userPage back-button-text">
                       Back
                   </div>
               </Button>
               <Button className="edit-button"
                       disabled={userId !== String(user?.id)}
                       onClick={() => history.push("/users/" + userId + "/edit")}
               >
                   <div className="userPage edit-button-text">
                       Edit
                   </div>
               </Button>
           </div>
      </BaseContainer>
    );
};

export default UserPage;