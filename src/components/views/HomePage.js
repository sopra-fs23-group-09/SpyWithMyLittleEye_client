import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {api} from 'helpers/api';
import { Icon } from '@iconify/react';
import 'styles/views/Code.scss';

const HomePage = () => {
    const history = useHistory();
    const userId = localStorage.getItem('userId');
    const goToProfile = () => {
        history.push(`/users/${userId}`);
    };
    const logout = async () => {
        const title = {title: 'logout request'};
        const response = await api.put('/users/logout', title,{headers: {Token: localStorage.getItem("token")}});
        console.log(response);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
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
            <div className="home-page navigation-bar">
                <Button className="ranking-button" onClick={() => history.push('/leaderboard')}

                >
                    <div className="home-page ranking-text">
                        Ranking
                    </div>
                </Button>
                <Button className="profile-button" onClick={goToProfile}

                >
                    <div className="home-page profile-text">
                        Profile
                    </div>
                </Button>
                <Button className="logout-button" onClick={() => logout()}>
                    <div className="home-page logout-text">
                        Log out
                    </div>
                </Button>
            </div>
            <Button className="join-lobby-button" onClick={() => history.push('/code')}>
                <div className="home-page join-lobby-button-text">
                    Join a lobby
                </div>
            </Button>
            <Button className="create-lobby-button" onClick={() => history.push('/rounds')}
            >
                <div className="home-page create-lobby-button-text">
                    Create a lobby
                </div>
            </Button>
        </BaseContainer>
    );

};

export default HomePage;