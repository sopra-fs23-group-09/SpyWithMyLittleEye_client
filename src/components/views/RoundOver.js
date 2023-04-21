import 'styles/views/RoundOver.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';

const RoundOver = () => {
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
            <div className="roundover container">
                <div className="roundover header">
                    ROUND ? IS OVER
                </div>
                <div className="roundover solution">
                    The object was "?"
                </div>
                <div className="roundover time-left">
                    ?
                </div>
                <div className="roundover leaderboard-text">
                    Leaderboard
                </div>
                <div className="score name-1st">
                    Name (1st)
                </div>
                <div className="score points-1st">
                    ?
                </div>
                <div className="score name-2nd">
                    Name (2nd)
                </div>
                <div className="score points-2nd">
                    ?
                </div>
                <div className="score name-3rd">
                    Name (3rd)
                </div>
                <div className="score points-3rd">
                    ?
                </div>
            </div>

        </BaseContainer>
    );

};

export default RoundOver;