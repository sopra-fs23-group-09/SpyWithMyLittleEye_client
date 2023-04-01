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
            <div className="lobby lobbycode">
                <div className="lobby lobbycodetext">
                    Code:
                </div>
            </div>
            <div className="lobby roundsbox">
                <div className="lobby roundstext">
                    Rounds:
                </div>
            </div>
            <div className="lobby playeramountcontainer">
                <div className="lobby playeramounttext">
                    ?/10
                </div>
            </div>
            <div className="lobby lobbytext">
                LOBBY
            </div>
            <div className="lobby player">
                <div className="lobby playername">
                    PlayerName
                </div>
            </div>
            <Button>
                <div className="lobby profilepicture">

                </div>
                <div className="lobby buttontext">
                    Start Game
                </div>
            </Button>
        </BaseContainer>
    );

};

export default Lobby;