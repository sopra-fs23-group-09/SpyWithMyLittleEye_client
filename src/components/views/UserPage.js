import React, {useEffect,useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import {useParams} from 'react-router-dom';
import {Spinner} from 'components/ui/Spinner';
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';


const UserPage = () => {
  const [user, setUser] = useState(null);
  const [currentID, setCurrentID] = useState(null);

  const history = useHistory();
  const {userId} = useParams();

  useEffect(() => {
    async function fetchData() {
        try {
            const response = await api.get('/users/'+ userId, {headers: {Token: localStorage.getItem("token")}});
            //await new Promise(resolve => setTimeout(resolve, 500));
            setUser(response.data);
            setCurrentID(response.headers.id);
        } catch (error) {
            alert(`Something went wrong during showing the user page: \n${handleError(error)}`);
        }
    }
    fetchData();
  },[userId]);

  const editProfile = async () => {
    history.push(`/users/${userId}/edit`);
  }

  let content = <Spinner/>;
  let birthday = <div> BIRTHDAY: undefined </div>;
  let buttons = (<div className = "userPage button-container">
                   <Button width="100%" style={{marginRight: "2px"}} onClick={() => history.goBack()}> back </Button>
                </div>);

  if(user){
    if(user.birthday){birthday = (<div> BIRTHDAY: {user.birthday} </div>);}
    content = (
    <div>
        <div>
            <div className= "userPage attribute"> USERNAME: {user.username} </div>
            <div className= "userPage attribute"> ONLINE STATUS: {user.status} </div>
            <div className= "userPage attribute"> CREATION DATE: {user.creationDate} </div>
            {birthday}
        </div>
        {buttons}

     </div>
    );
  }
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
       <div className="userPage container">
           <div className="userPage username-container">
               <div className="userPage username-text">
                   Username: ?
               </div>
           </div>
           <div className="userPage score-container">
               <div className="userPage score">
                    Score: ?
               </div>
           </div>
           <div className="userPage games-played-container">
               <div className="userPage games-played-text">
                   Games played: ?
               </div>
           </div>
           <div className="userPage games-won-container">
               <div className="userPage games-won-text">
                   Games won: ?
               </div>
           </div>
           <Button className="userPage-back-button"

           >
               <div className="userPage back-button-text">
                   Back
               </div>
           </Button>
           <Button className="edit-button"

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