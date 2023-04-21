import {Button} from 'components/ui/Button';
import 'styles/views/StartPage.scss';
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import {LogoEye} from "../ui/LogoEye";
import { Icon } from '@iconify/react';
import Code from "components/views/Code";
import 'styles/views/Code.scss';

const StartPage = () => {
    const history = useHistory();

    return (
        <BaseContainer>
            <div className="start-page background">
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
            <div className="start-page game-title">
                I spy with my little eye
            </div>
            <div className="start-page nose">
                Y
            </div>
            <Button className="login-button-start-page" onClick={() => history.push('/login')}>
                <div className="start-page login-button-text">
                    Log in
                </div>
            </Button>
            <Button className="signup-button-start-page" onClick={() => history.push('/register')}

            >
                <div className="start-page signup-button-text">
                    Sign up
                </div>
            </Button>
            <div className="start-page instructions-container">
                <div className="start-page introduction-text">
                    Looking for a game that will keep you and your friends entertained for hours?
                    Look no further than "I Spy with My Little Eye"! This classic game has been enjoyed by generations
                    of children and adults and it's sure to provide hours of excitement and laughter. With every round,
                    you'll be on the edge of your seat, trying to figure out the clues and beat your opponents.
                    And the best part is, you can play for as long as you want. Thanks to the Google Maps API our game
                    never gets old, and there's always a new and exciting place on this earth for you to discover.
                </div>
                <div className="start-page header-rules">
                    Rules
                </div>
                <div className="start-page rules-text">
                    After logging in, you can directly start the game and generate a code. Up to 10 friends or family
                    members can join you, by entering the code. It’s up to you how many rounds you want to play! If you
                    started the game, you will be the first spier. Decide on an object in the 360° google view. Enter
                    the object and a hint, and let the guessers guess.The faster one guesses, the more points one will
                    get. Don’t forget to compare your scores afterwards!
                </div>

            </div>
        </div>
        </BaseContainer>
    );

};

export default StartPage;