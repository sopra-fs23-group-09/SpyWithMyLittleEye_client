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
import Lobby from "components/views/LobbyView";
import Code from "components/views/Code";
import SetRounds from "components/views/SetRounds";
import SetLocation from "components/views/SetLocation";
import Guessing from "components/views/Guessing";
import RoundOver from "components/views/RoundOver";
import GameOver from "components/views/GameOver";
import {GameGuard} from "../routeProtectors/GameGuard";
import TestingGame from "components/views/TestingGame";

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
        <Route exact path="/register">
            <Register/>
        </Route>
        <Route exact path="/">
          <Redirect to="/testinggame"/>
        </Route>
        <Route exact path ="/home">
            <GameGuard>
                <HomePage/>
            </GameGuard>
        </Route>
        <Route exact path="/leaderboard">
            <GameGuard>
                <Leaderboard/>
            </GameGuard>
        </Route>
        <Route exact path ="/code">
            <GameGuard>
                <Code/>
            </GameGuard>
        </Route>
        <Route exact path="/rounds">
            <GameGuard>
                <SetRounds/>
            </GameGuard>
        </Route>
        <Route exact path ="/lobby/:lobbyId">
            <Lobby/>
        </Route>
        <Route exact path="/game/:gameId/location">
            <SetLocation/>
        </Route>
        <Route exact path="/game/:gameId/guesses">
            <Guessing/>
        </Route>
        <Route exact path ="/game/:gameId/rounds/score">
            <RoundOver/>
        </Route>
        <Route exact path="/game/:gameId/score">
            <GameOver/>
        </Route>
        <Route exact path ="/testinggame">
             <TestingGame/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
