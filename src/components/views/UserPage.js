import React, {useEffect,useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/UserPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import {useParams} from 'react-router-dom';
import {Spinner} from 'components/ui/Spinner';


const UserPage = () => {
  const [user, setUser] = useState(null);
  const [currentID, setCurrentID] = useState(null);

  const history = useHistory();
  const {userId} = useParams();

  useEffect(() => {
    async function fetchData() {
        try {
            const response = await api.get('/users/'+ userId, {headers: {Token: localStorage.getItem("token")}});
            await new Promise(resolve => setTimeout(resolve, 500));
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

  if(currentID === userId){
    buttons= (<div className = "userPage button-container">
                <Button width="50%" style={{marginRight: "2px"}} onClick={() => history.push(`/game`)}> back </Button>
                <Button width="50%" style={{marginLeft: "2px"}} onClick={() => editProfile()}> edit </Button>
             </div>);
  }
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
       <div className="userPage container">
       <div className= "userPage form">
        <h2>Profile Page</h2>
        {content}
       </div>
       </div>
      </BaseContainer>
    );
};

export default UserPage;