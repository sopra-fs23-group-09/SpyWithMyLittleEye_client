import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import 'styles/views/UserPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import {Link, useHistory} from 'react-router-dom';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';
// TODO this isnt ideal
import Bear from "../../images/Bear.png";
import Budgie from "../../images/Budgie.png";
import Bunny from "../../images/Bunny.png";
import Cockatoo from "../../images/Cockatoo.png";
import Icebear from "../../images/Icebear.png";
import Owl from "../../images/Owl.png";
import Panda from "../../images/Panda.png";
import Penguin from "../../images/Penguin.png";
import RedPanda from "../../images/RedPanda.png";
import Sloth from "../../images/Sloth.png";
import {getProfilePic} from "../../helpers/utilFunctions";



const UserPage = () => {
  const [audio] = useState(new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF'));

  const history = useHistory();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

    let content = <div></div>;


  useEffect(() => {
      const retrieveUserData = async () => {
          try {
              const response = await api.get('/users/'+userId, {headers: {Token: token}});
              setUser(response.data);
          } catch (error) {
              console.log("Couldn't fetch user information\n" + handleError(error));
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