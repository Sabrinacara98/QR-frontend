import React from "react";
import Navbar from "./navbar"
import './join_game.css'
import config from "../config"
import axios from "axios";

class JoinGame extends React.Component {
    constructor(){
        super()
        this.state = {
            user_id: "",
            user_token: "",
            show_modal: true,
            game_code: "",
            invalid_code: false
        }
    }

    componentDidMount(){
        var userId = localStorage.getItem("userId")
        var userToken = localStorage.getItem("token")
        if ((userId === null) || (userToken === null)) {
          this.props.history.push("/login")
        }
        this.setState({
          user_id: userId,
          user_token: userToken
        })
    }


    join = () => {
        if (this.state.game_code === "") {
            return;
        }
        axios({
            method: 'put',
            url: config.JOIN_URL + this.state.game_code,
            headers: {'Content-Type': 'application/json',
                      'Authorization': localStorage.getItem("token")},
            data: {
                "userId": localStorage.getItem("userId")
            }
        }).then( (res) => {
          if (res.data.success) {
            localStorage.setItem("game_id", res.data.data._id)
            localStorage.setItem("game_title", this.state.game_title)

            this.props.history.push("play-game")
          } else {
              this.setState({
                  invalid_code: true,
                  game_code: ""
              })
          }
        }).catch( (err) => {
          alert(err);
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    close = (e) => {
        e.preventDefault()
        this.props.history.push("profile")
    }

    render(){
        return(
            <div >
                <Navbar />
                <div className={"modal modal-md " + (this.state.show_modal=== true ? "active" : "")}>
                    <a href="/profile" onClick={this.close} className="modal-overlay" aria-label="Close"> </a>
                    <div className="modal-container">
                        <div className="modal-header">
                        <button onClick={this.close} className="btn btn-clear float-right" aria-label="Close"></button>
                        <div className=" p-centered text-primary modal-title h5"> Join game and start collecting QRs</div>
                        </div>
                        <div className="modal-body">
                        <div className="input-group">
                            <input type="text"
                                    className="form-input input-lg"
                                    placeholder="Enter game code"
                                    name="game_code"
                                    onChange={this.handleChange}
                                    value={this.state.game_code}
                                    />
                            <button className="btn btn-primary btn-lg input-group-btn" onClick={this.join}>Join Game</button>
                        </div >
                        {this.state.invalid_code ? <p className="text-error">Could not find any game with this code!</p>: ""}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default JoinGame;
