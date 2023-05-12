import React, {useEffect, useState} from 'react';
import {api, getErrorMessage, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/UserPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import {Link, useHistory, useParams} from 'react-router-dom';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
import {getProfilePic} from "../../helpers/utilFunctions";
import {Alert} from "@mui/material";



const UserPage = () => {
  const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

  const history = useHistory();

  const {userId} = useParams();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
    let [alert_message, setAlert_Message] = useState(<div className="leaderboard alert-message"></div>);


    let content = <div></div>;

    // KEEP ALIVE: to tell if an user has become idle
    useEffect(()=>{
        if (!(localStorage.getItem("intervalId"))) {
            let token = localStorage.getItem("token");

            let intervalId = setInterval(async () => {
                try {
                    await api.put("/users/keepAlive", {}, {headers: {Token: token}})
                    console.log("I am alive!!! " + token)
                } catch (e) {
                    history.push("/start");
                }
            }, 2000)
            localStorage.setItem("intervalId", String(intervalId));
            console.log("Localstorage : " + localStorage.getItem("intervalId") + " actual: " + intervalId);
        }
    }, [history])

  useEffect(() => {
      const retrieveUserData = async () => {
          try {
              const response = await api.get('/users/'+userId, {headers: {Token: token}});
              setUser(response.data);
          } catch (error) {
              let msg = getErrorMessage(error);
              console.log(msg);
              setAlert_Message(<Alert className="userPage alert-message" severity="error"><b>Something went wrong while
                  fetching the data:</b> {msg}</Alert>);
          }
      };
      retrieveUserData();
  }, [token, userId])

    if (user) {
        let picture = getProfilePic(user.profilePicture);
        content = <div className="userPage container">
                <img className="userPage profile-picture-background" src = {picture} alt = "ppBackground" style = {{objectFit: 'cover'}}>
                </img>
                <img className="userPage profile-picture" src = {picture} alt ="profilePicture">
                </img>
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
                <Button className="userPage-back-button" onClick={() => {
                    audio.play();
                    history.push("/home");
                }}>

                    <div className="userPage back-button-text">
                        Back
                    </div>
                </Button>
                <Button className="edit-button" disabled={userId !== String(user?.id)} onClick={() => {
                    audio.play();
                    history.push("/users/" + userId + "/edit");
                }}>
                    <div className="userPage edit-button-text">
                        Edit
                    </div>
                </Button>
            <div className = "userPage alert-div">
                {alert_message}
            </div>
            </div>
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
          {content}
      </BaseContainer>
    );
};

export default UserPage;