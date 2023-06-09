import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import {UserPageGuard} from "components/routing/routeProtectors/UserPageGuard";
import StartPage from "components/views/StartPage";
import Login from "components/views/Login";
import Register from "components/views/Register";
import HomePage from "components/views/HomePage";
import Leaderboard from "components/views/Leaderboard";
import UserPage from "components/views/UserPage";
import EditPage from "components/views/EditPage";
import LobbyView from "components/views/LobbyView";
import Code from "components/views/Code";
import SetRounds from "components/views/SetRounds";
import SetLocation from "components/views/SetLocation";
import Waitingroom from "components/views/Waitingroom";
import Guessing from "components/views/Guessing";
import RoundOver from "components/views/RoundOver";
import GameOver from "components/views/GameOver";
import {GameGuard} from "../routeProtectors/GameGuard";


/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/start">
          <StartPage/>
        </Route>
        <Route exact path="/login">
            <LoginGuard>
                <Login/>
            </LoginGuard>
        </Route>
        <Route exact path= "/users/:userId">
            <GameGuard>
                <UserPage/>
            </GameGuard>
        </Route>
        <Route exact path= "/users/:userId/edit">
            <UserPageGuard>
              <EditPage/>
            </UserPageGuard>
        </Route>
        <Route exact path="/signup">
            <Register/>
        </Route>
        <Route exact path="/">
          <Redirect to="/start"/>
        </Route>
        <Route exact path ="/home">
            <GameGuard>
                <HomePage/>
            </GameGuard>
        </Route>
        <Route exact path="/ranking">
            <GameGuard>
                <Leaderboard/>
            </GameGuard>
        </Route>
        <Route exact path ="/code">
            <GameGuard>
                <Code/>
            </GameGuard>
        </Route>
        <Route exact path="/gamesettings">
            <GameGuard>
                <SetRounds/>
            </GameGuard>
        </Route>
        <Route exact path ="/lobby/:accesscode">
            <GameGuard>
                <LobbyView/>
            </GameGuard>
        </Route>
        <Route exact path="/game/:gameId/location">
            <GameGuard>
                <SetLocation/>
            </GameGuard>
        </Route>
        <Route exact path="/game/:accesscode/waitingroom">
            <GameGuard>
                <Waitingroom/>
            </GameGuard>
        </Route>
        <Route exact path="/game/:accesscode">
            <GameGuard>
                <Guessing/>
            </GameGuard>
        </Route>
        <Route exact path ="/game/:gameId/rounds/score">
            <GameGuard>
                <RoundOver/>
            </GameGuard>
        </Route>
        <Route exact path="/game/:gameId/score">
            <GameGuard>
                <GameOver/>
            </GameGuard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
