import React,{ useRef }  from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Navbar from "./navbar"
import Sky from 'react-sky';
import config from "../config";
import axios from "axios";
import Typical from 'react-typical'
import Form from 'react-bootstrap/Form'
import Logo from  "./history.png"
import Logo1 from  "./avatar.png"
import crypto from "crypto"




const history = [
    {
        "title":"game1",
        "score": 51,
        "rank":1
    },
    {
        "title":"game2",
        "score": 32,
        "rank":2
    },
    {
        "title":"game3",
        "score": 10,
        "rank":3
    },
]

const myImage = require('../components/medii.png');
const imgMyimageexample = require('../components/prof_pic.png');
const divStyle = {
    top: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${imgMyimageexample})`,
    backgroundSize: 'cover',
    position: 'fixed'
};

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state ={
            userId: "",
            userToken: "",
            text: "",
            username: "",
            email: "",
            new_username: "",
            viewEdit: false,
            gameInfos: [],
            gameNumber:"",
            gameRank: "",
            gameScore:"",
            password: "",
            secretQuestion: "",
            usernameInput: "",
            passwInput: "",
            secretAnswer:"",
            user_err: false,
            pass_err: false,
            secret_err: false,
            answ_err: false
        };
        this.submit_data = this.submit_data.bind(this);
    }

    check_errors = (callback) => {
        this.setState({
            user_err: this.state.data.username === 0 ? true : false,
            pass_err: this.state.password === "" ? true : false,
            secret_err: this.state.secret_err === "" ? true : false,
            answ_err: this.state.secret_err === "" ? true : false,
        },() => {
            callback(this.state.user_err === true || this.state.pass_err === true || this.state.secret_err  === true || this.state.answ_err  === true)
        })
    }

    async componentDidMount() {
        let userId = localStorage.getItem("userId");
        let userToken = localStorage.getItem("token");

        if ((userId === null) || (userToken === null)) {
            this.props.history.push("/login")
        }

        try {
            console.log(this.state.userToken);

            const res = await axios({
                method: 'get',
                url: config.PROFILE_URL + localStorage.getItem("userId"),
                headers: {'Content-Type': 'application/json',
                    'Authorization': userToken},
            });

            console.log("respond", res.data.data);

            if (res.data.success) {
                this.setState({
                    username: res.data.data.username,
                    email: res.data.data.email,
                    gameInfos: res.data.data.history.sort((a, b) => (a.gameCreateDate < b.gameCreateDate) ? 1 : -1)
                })
            }

        } catch (err) {
            console.log("err", err);
        }

    }

    handleHistoryClick  = (e) =>{
        e.preventDefault()
        this.setState({
            viewEdit: false
        })
    }

    handleEditClick  = (e) =>{
        e.preventDefault()
        this.setState({
            viewEdit: true
        })
    }



    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    async submit_data(e) {
        e.preventDefault();

        let update_data = {}
        if (this.state.passwInput !== "") {
            let salt = crypto.randomBytes(128).toString('base64');
            let passwordHash = crypto.pbkdf2Sync(this.state.password, salt, 1, 128, 'sha1');
            update_data.passwordHash = passwordHash;
            update_data.salt = salt
        }

        if (this.state.secretAnswer !== "") {
            update_data.secretAnswer = this.state.secretAnswer
        }

        if (this.state.secretQuestion !== "") {
            update_data.secretQuestion = this.state.secretQuestion
        }

        if(this.state.username !== "") {
            update_data.username = this.state.usernameInput
        }


        const res = await axios({
            method: 'put',
            url: config.PROFILE_URL + localStorage.getItem("userId"),
            headers: {'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")},
            data: update_data
        });

        console.log(res);
    }

    render()
    {
        return (
            <div className="cComponent" style={divStyle}>
                <div>
                    <Navbar/>
                    <Sky
                        images={{
                            0: myImage
                        }}
                        how={130} /* Pass the number of images Sky will render chosing randomly */
                        time={40} /* time of animation */
                        size={'50px'} /* size of the rendered images */
                        /*background={'palettedvioletred'} /* color of the background */
                    />
                    <div className="columns">
                        <div className="col-3 col-lg-2 col-md-1"></div>
                        <div className="column grid-lg">
                            <Grid container alignItems="flex-start">
                                <Grid item xs={4}>
                                    <Paper style={{width: 250, marginLeft: 50, marginRight: 1, height: 280, marginTop: 40}}>
                                        <Grid container alignItems="flex-start">
                                            <div style={{paddingTop: "8%", paddingRight: "2%", paddingLeft: "10%"}}>
                                                <div className="timeBox">
                                                    <h5 style={{
                                                        color: "MediumSeaGreen",
                                                        justifyContent: "center",
                                                        fontSize: "25px"
                                                    }}>USER PROFILE </h5></div>
                                                <h5 style={{
                                                    color: "Peru",
                                                    justifyContent: "center",
                                                    fontSize: "20px"
                                                }}>{this.state.username}</h5>
                                                <h5 style={{
                                                    color: "Peru",
                                                    justifyContent: "center",
                                                    fontSize: "20px"
                                                }}>{this.state.email} </h5>
                                                <div style={{
                                                    paddingTop: "15%",
                                                    paddingRight: "2%",
                                                    paddingLeft: "3%",
                                                    size: "lg",
                                                    width: "90%"
                                                }}>
                                                    <button onClick={this.handleEditClick}
                                                            className="btn btn-success btn-lg">Edit Profile
                                                    </button>
                                                    <div style={{paddingTop: "15%", paddingRight: "2%", paddingLeft: "1%"}}>
                                                        <button onClick={this.handleHistoryClick}
                                                                className="btn btn-success btn-lg">Game History
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                {
                                    !this.state.viewEdit ? (
                                        <Paper style={{width: 500, marginLeft: 10, marginTop: 40, height: 400}}>
                                            <Grid container alignItems="flex-start">
                                                <img src={Logo}/>
                                                <table style={{paddingTop: "20%"}}
                                                       className="table table-striped table-hover">
                                                    <thead>
                                                    <tr>

                                                        <th>Game Title</th>
                                                        <th>Score</th>
                                                        <th>Rank</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.state.gameInfos.map((item, key) =>
                                                            <tr key={key}>
                                                                <td>{item.gameTitle}</td>
                                                                <td>{item.score}</td>
                                                                <td>{item.ranking} </td>
                                                            </tr>
                                                        )
                                                    }
                                                    </tbody>
                                                </table>
                                            </Grid>
                                        </Paper>
                                    ) : (
                                        /*enter another grid that shows the profile*/
                                        <Paper style={{width: 500, marginLeft: 10, marginTop: 40, height: 400}}>
                                            <Grid container alignItems="flex-start">
                                                <img src={Logo1}/>
                                                <div className="form-group">
                                                    <div style={{paddingLeft: "20%"}}>
                                                        <h6 style={{color: "MediumSeaGreen", fontSize: "12px"}}>Username</h6>
                                                        <input className="form-input input-lg"
                                                               placeholder="Enter new username"
                                                               name="usernameInput"
                                                               onChange={this.handleChange}
                                                               value={this.state.usernameInput}
                                                        />
                                                    </div>
                                                    {this.state.user_err ?
                                                        <p className="text-error">You didn't change your username.</p> : ""}
                                                    <div className="form-group">
                                                        <div style={{paddingLeft: "20%"}}><h6 style={{color: "MediumSeaGreen", fontSize: "12px"}}>Password</h6>
                                                            <input className="form-input input-lg"
                                                                   placeholder="Enter new password"
                                                                   name="passwInput"
                                                                   onChange={this.handleChange}
                                                                   value={this.state.passwInput}
                                                            />
                                                        </div>
                                                        {this.state.pass_err ?
                                                            <p className="text-error">You didn't change your
                                                                password.</p> : ""}

                                                        <div className="form-group">
                                                            <div style={{paddingLeft: "20%"}}>
                                                                <h6 style={{color: "MediumSeaGreen", fontSize: "12px"}}>Secret Question</h6>
                                                                <input className="form-input input-lg"
                                                                       placeholder="Enter new secret question"
                                                                       name="secretQuestion"
                                                                       onChange={this.handleChange}
                                                                       value={this.state.secretQuestion}
                                                                />
                                                            </div>
                                                            {this.state.secret_err ?
                                                                <p className="text-error">You didn't change your secret
                                                                    question.</p> : ""}

                                                            <div className="form-group">
                                                                <div style={{paddingLeft: "20%"}}>
                                                                    <h6 style={{color: "MediumSeaGreen", fontSize: "12px"}}>Secret Answer</h6>

                                                                    <input className="form-input input-lg"
                                                                           placeholder="Enter new answer"
                                                                           name="secretAnswer"
                                                                           onChange={this.handleChange}
                                                                           value={this.state.secretAnswer}
                                                                    />
                                                                </div>
                                                                {this.state.answ_err ?
                                                                    <p className="text-error">You didn't change your secret
                                                                        answer.</p> : ""}
                                                                <div style={{paddingTop: "1%", paddingLeft: "20%"}}>
                                                                    <Form.Group id="formGridCheckbox">
                                                                        <Form.Check type="checkbox" label=" " />
                                                                        <Typical
                                                                            steps={['I agree', 1000, 'I confirm my changes', 500]}
                                                                            loop={Infinity}
                                                                            wrapper="p"
                                                                        />
                                                                    </Form.Group>

                                                                </div>
                                                                <div style={{paddingTop: "1%", paddingLeft: "2%"}}>
                                                                    <button onClick={this.submit_data}
                                                                            className="btn btn-success btn-lg">SUBMIT CHANGES
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Paper>
                                    )
                                }
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
