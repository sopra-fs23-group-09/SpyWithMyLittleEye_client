import {Button} from 'components/ui/Button';
import 'styles/views/Lobby.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";

const Lobby = () => {
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
            <div className="lobby lobby-code">
                <div className="lobby lobby-code-text">
                    Code:
                </div>
            </div>
            <div className="lobby rounds-box">
                <div className="lobby rounds-text">
                    Rounds:
                </div>
            </div>
            <div className="lobby player-amount-container">
                <div className="lobby player-amount-text">
                    ?/10
                </div>
            </div>
            <div className="lobby lobby-text">
                LOBBY
            </div>
            <div className="lobby player">
                <div className="lobby profile-picture">
                </div>
                <div className="lobby player-name">
                    PlayerName
                </div>
            </div>
            <Button className="primary-button"

            >
                <div className="lobby button-text">
                    Start game
                </div>
            </Button>
        </BaseContainer>
    );

};

export default Lobby;