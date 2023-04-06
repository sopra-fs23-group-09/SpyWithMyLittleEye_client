import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
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
import {UserPageGuard} from "components/routing/routeProtectors/UserPageGuard";

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
        </Route>npm
        <Route exact path= "/users/:userId">
            <UserPage/>
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
          <Redirect to="/start"/>
        </Route>
        <Route exact path ="/home">
            <HomePage/>
        </Route>
        <Route exact path="/leaderboard">
            <Leaderboard/>
        </Route>
        <Route exact path ="/code">
            <Code/>
        </Route>
        <Route exact path="/rounds">
            <SetRounds/>
        </Route>
        <Route exact path ="/lobby/:lobbyId">
            <Lobby/>
        </Route>
        <Route exact path="/game/:gameId/location">
            <SetLocation/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
