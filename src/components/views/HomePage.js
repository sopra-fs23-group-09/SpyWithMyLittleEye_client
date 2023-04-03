import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import {api, handleError} from 'helpers/api';
import User from "../../models/User";
import Lobby from "../../models/Lobby";

const HomePage = () => {
    const history = useHistory();
    const userId = localStorage.getItem('id');
    const goToProfile = () => {
      history.push(`/users/${userId}`);
    };
    const logout = async () => {
        const title = {title: 'logout request'};
        await api.put('/v1/logoutService', title,{headers: {Token: localStorage.getItem("token")}});

        localStorage.removeItem('token');
        localStorage.removeItem('id');
        history.push('/login');
      }

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