import {Button} from 'components/ui/Button';
import 'styles/views/HomePage.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";

const HomePage = () => {
    const history = useHistory();

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
                    <Button className="ranking-button"

                    >
                        <div className="home-page ranking-text">
                            Ranking
                        </div>
                    </Button>
                    <Button className="profile-button"

                    >
                        <div className="home-page profile-text">
                            Profile
                        </div>
                    </Button>
                    <Button className="logout-button"

                    >
                        <div className="home-page logout-text">
                            Log out
                        </div>
                    </Button>
            </div>
            <Button className="join-lobby-button"

            >
                <div className="home-page join-lobby-button-text">
                    Join a lobby
                </div>
            </Button>
            <Button className="create-lobby-button"

            >
                <div className="home-page create-lobby-button-text">
                    Create a lobby
                </div>
            </Button>
        </BaseContainer>
    );

};

export default HomePage;