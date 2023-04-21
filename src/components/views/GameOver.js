import 'styles/views/GameOver.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import {Button} from "../ui/Button";
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';

const GameOver = () => {
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
            <div className="gameover container">
                <div className="gameover header">
                    THE GAME IS OVER
                </div>
                <div className="gameover leaderboard-text">
                    Leaderboard
                </div>
                <div className="finalscore name-1st">
                    Name (1st)
                </div>
                <div className="finalscore points-1st">
                    ?
                </div>
                <div className="finalscore name-2nd">
                    Name (2nd)
                </div>
                <div className="finalscore points-2nd">
                    ?
                </div>
                <div className="finalscore name-3rd">
                    Name (3rd)
                </div>
                <div className="finalscore points-3rd">
                    ?
                </div>
                <Button className="gameover-ok-button"

                >
                    <div className="gameover ok-button-text">
                        OK
                    </div>
                </Button>
            </div>
        </BaseContainer>
    );
};

export default GameOver;