import React,{Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import qrcode from "../qr-code.png";
import axios from "axios";
import config from "../config";

class Login extends Component{
    constructor() {
        super();

        this.state = {
            username: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    check_errors = (callback) => {
        this.setState({
            username_err: this.state.username.length === 0 ? true : false,
            password_err: this.state.password === "" ? true : false,
        },() => {
            callback(this.state.username_err === true || this.state.password_err === true)
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.check_errors((err) => {
            if (!err) {
                    axios({
                        method: 'post',
                        url: config.LOGIN_URL,
                        headers: {'Content-Type': 'application/json'},
                        data: {
                            username: this.state.username,
                            password: this.state.password
                        }
                    }).then((res) => {
                        if (res.data.success) {
                            localStorage.setItem("userId", res.data.id);
                            localStorage.setItem("token", res.data.data.token);
                            this.props.history.push("/profile");
                        }
                    }).catch((err) =>  {
                        alert('Your username or password is incorrect!');
                    })
            }

        });
    }


    render() {
        return (
            <div>
                <div  className="AppLogin hide-sm">
                <div className="App__Aside">
                    <img src={qrcode} alt="QR Icon"/>
                </div>
                <div className="App__Form">

                    <div className="PageSwitcher">
                        <NavLink to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Login </NavLink>
                        <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up </NavLink>
                    </div>

                    <div className="FormTitle">
                        <NavLink to="/login" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Login</NavLink> or <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                    </div>
                    <div className="FormCenter">
                        <form onSubmit={this.handleSubmit} className="FormFields" onSubmit={this.handleSubmit} >
                            <div className="FormField">
                                <label className="FormField__Label" htmlFor="username">Username </label>
                                <input type="text" id="username" className="FormField__Input" placeholder="Enter your username"
                                       name="username" value={this.state.username} onChange={this.handleChange}/>
                            </div>
                            {this.state.username_err ? <p className="text-error">Type in correct username!</p>: ""}

                            <div className="FormField">
                                <label className="FormField__Label" htmlFor="password">Password </label>
                                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password"
                                       name="password" value={this.state.password} onChange={this.handleChange}/>
                            </div>
                            {this.state.password_err ? <p className="text-error">Type in correct password!</p>: ""}

                            <div className="FormField">
                                <button className="FormField__Button nr-20">Login </button> <Link to="/login/reset-password" className="FormField__Link">Forgot Password?</Link>

                            </div>
                        </form>
                    </div>
                </div>
                </div>
                <div style={{backgroundColor: "#2E4158", textAlign: "center", height: "100%"}} className="show-sm">
                    <div className="PageSwitcher">
                        <NavLink to="/login" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Login </NavLink>
                        <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up </NavLink>
                    </div>

                    <div className="FormTitle">
                        <NavLink to="/login" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Login</NavLink> or <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                    </div>
                    <div   className="FormCenter">
                        <form onSubmit={this.handleSubmit} className="FormFields" onSubmit={this.handleSubmit} >
                            <div className="FormField">
                                <label className="FormField__Label" htmlFor="username_mobile">Username </label>
                                <input type="text" id="username_mobile" className="FormField__Input" placeholder="Enter your username"
                                       name="username" value={this.state.username} onChange={this.handleChange}/>
                            </div>
                            {this.state.username_err ? <p className="text-error">Type in correct username!</p>: ""}

                            <div className="FormField">
                                <label className="FormField__Label" htmlFor="password_mobile">Password </label>
                                <input type="password" id="password_mobile" className="FormField__Input" placeholder="Enter your password"
                                       name="password" value={this.state.password} onChange={this.handleChange}/>
                            </div>
                            {this.state.password_err ? <p className="text-error">Type in correct password!</p>: ""}

                            <div className="FormField">
                                <button className="FormField__Button nr-20">Login </button> <Link to="/login/reset-password" className="FormField__Link">Forgot Password?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
