import React from "react";
import { Route, BrowserRouter as Router} from "react-router-dom";
import CreateGame from "./components/create_game"
import Login from "./components/login"
import ManageGame from "./components/manage_game"
import PlayGame from "./components/play_game"
import SignUp from "./components/sign_up"
import Profile from "./components/profile"
import JoinGame from "./components/join_game";
import './App.css';
import PrivateRoute from "./privateRoute"
import ResetPassword from "./components/reset_password";

class App extends React.Component {
    render() {
        return (
            <Router>
                <PrivateRoute path="/create-game" exact component={CreateGame} />
                <PrivateRoute path="/manage-game" exact component={ManageGame} />
                <PrivateRoute path="/play-game" exact component={PlayGame} />
                <PrivateRoute path="/profile" exact component={Profile} />
                <PrivateRoute path="/join-game" exact component={JoinGame} />
                <Route path="/login" exact component={Login} />
                <Route path="/login/reset-password" exact component={ResetPassword}/>
                <Route path="/" exact component={SignUp} />
            </Router>
        );
    }
}

export default App;
