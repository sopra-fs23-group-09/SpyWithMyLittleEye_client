import {Button} from 'components/ui/Button';
import 'styles/views/Leaderboard.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';

const Leaderboard = () => {
    const history = useHistory();

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
            <div className="leaderboard container">
                <div className="leaderboard header">
                    Leaderboard
                </div>
                <div className="leader container">
                    <div className="leader name">
                        name
                    </div>
                    <div className="leader points">
                        ?
                    </div>
                    <div className="leader points-text">
                        Points
                    </div>
                </div>
                <div className="player container">
                    <div className="player name">
                        name
                    </div>
                    <div className="player points">
                        ?
                    </div>
                    <div className="player points-text">
                        Points
                    </div>
                </div>
                <Button className="leaderboard-back-button"

                >
                    <div className="leaderboard back-button-text">
                        Go back
                    </div>
                </Button>
            </div>
        </BaseContainer>
    );

};

export default Leaderboard;