import React, {useState} from 'react';
import './play_game.css';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow, Circle } from "react-google-maps"
import QrReader from 'react-qr-reader'
import LocTracker from "./loc_tracker.js"
import config from "../config"
import axios from "axios";
import UpdateGame from "./update_game"


//Random avatars
const avatar = [
    "https://picturepan2.github.io/spectre/img/avatar-1.png", "https://picturepan2.github.io/spectre/img/avatar-2.png", "https://picturepan2.github.io/spectre/img/avatar-3.png",
    "https://picturepan2.github.io/spectre/img/avatar-4.png", "https://picturepan2.github.io/spectre/img/avatar-5.png", "https://img.icons8.com/plasticine/100/000000/user-male-circle.png",
    "https://img.icons8.com/bubbles/50/000000/guest-male.png","https://img.icons8.com/dusk/64/000000/user-female-circle.png","https://img.icons8.com/color/48/000000/user-female-circle.png"
];


function Map(props){
    //lat lg state
   // const google=window.google;
    const [number, desc] = useState(null);
    return(
        <GoogleMap defaultZoom={15}
            defaultCenter={{lat: parseFloat(props.lat), lng: parseFloat(props.lng)}}
            center={{
                lat: parseFloat(props.lat),
                lng: parseFloat(props.lng)
            }}
        >
        <Marker key="1" position={{lat: parseFloat(props.lat), lng: parseFloat(props.lng)}}
        onClick={()=> {
           // desc(this);
        }}
        />


        <Circle
            center={{
                lat: parseFloat(props.lat),
                lng: parseFloat(props.lng)
            }}
            radius={props.radius}
            options={{strokeColor: "red"}}
            />

        {number && (
            <InfoWindow position={{
                lat:number.lat , lng: number.lng
            }}
            onCloseClick={() => {
                desc(null);
            }}
            >
            <div style={{fontWeight:"bold"}}>
            <figure className="avatar">
            <img src={number.avatar} alt="Avatar">

            </img>
            {number.owner?<img src="./star.png" className="avatar-icon" alt="Star"/>:null}
            </figure>
            {number.username}
            </div></InfoWindow>
        )}

        </GoogleMap>
    );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));
let timee;
let countDownDate;
class Managegame extends React.Component {
    constructor() {
        super();
        this.state = {
            all_hints: [],
            userName: '',
            gameName:'',
            found_QRs: [],
            gameId: "",
            admin_name: "",
            playerNumber:4,
            totalQR:24,
            findingQR:0,
            hintContent:"",
            playersData: [],
            remainingTime:"",
            x:"",
            qrData:"",
            qrDiv:"",
            game_type: "Standard",
            center_lat: 0,
            center_lng: 0,
            center_radius: 0,
            description:"",
            status:"created",
            playerId:"",
        }
        this.changeTime = this.changeTime.bind(this);
        this.closeWarning = this.closeWarning.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.updateHint = this.updateHint.bind(this);
        this.handleData = this.handleData.bind(this);
        this.closeCamera = this.closeCamera.bind(this);
        this.returnProfile = this.returnProfile.bind(this);
    }
    openCamera(){
        let content =<div className="modal active" id="modal-id">

        <div className="modal-container">
          <div className="modal-header">
            <button  onClick={this.closeCamera} className="btn btn-clear float-right" aria-label="Close"></button>
            <div className="modal-title h5" style={{textAlign:"center"}}>Scan The QR Code</div>
          </div>
          <div className="modal-body">
            <div className="content">
            <div className="flex-centered">
            <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '80%' }}
            />
            </div>
          </div>
          </div>

          <div className="modal-footer">
          <button onClick={this.closeCamera} className="btn" aria-label="Close">Close</button>
        </div>

        </div>
      </div>

      this.setState({qrDiv: content})
    }

    closeCamera(){
        let content = ""
        this.setState({qrDiv: content})
    }

    handleData(data, err){
        if (err) {
            return;
        }

        let value = data.data.players.indexOf(localStorage.getItem("userId"));
        if(value < 0 ){
            this.props.history.push("/profile");
            localStorage.removeItem("game_id")
            localStorage.removeItem("game_title")
            alert("You have been kicked by the Admin !!!");
        }

        this.setState({
            gameName: data.data.title
        });

        if (this.state.admin_name === "" ){
            axios({
                method: 'get',
                url: config.PROFILE_URL + data.data.adminId,
                headers: {'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")},
            }).then(res => {
                if(res.data.success) {
                    this.setState({
                        admin_name: res.data.data.username
                    })
                } else {
                    alert("Could not fetch admin info.")
                }
            }).catch( err => {
                alert("You have a connection problem!")
            })
        }

        let player_Id = localStorage.getItem("userId");

        this.setState({
            totalQR:data.data.hints.hint.length,
            playersData: data.data.ranking,
            playerNumber:  data.data.ranking.length-1,
            center_radius  :data.data.location.radius,
            center_lat: data.data.location.latitude,
            center_lng: data.data.location.longitude,
            description: data.data.description,
            game_type: data.data.type,
            all_hints: data.data.hints.hint,
            status: data.data.status,
            hintContent: this.state.all_hints[this.state.found_QRs.length],
            playerId: player_Id
        }, () => {
            if (this.state.status === "Ended") {
                localStorage.removeItem("game_title")
                localStorage.removeItem("game_id")
            }
        });

        let user_lat = localStorage.getItem("lat")
        let user_lng = localStorage.getItem("lng")

        let latDiff = (user_lat - this.state.center_lat)*(user_lat - this.state.center_lat)
        let lngDiff = (user_lng - this.state.center_lng)*(user_lng - this.state.center_lng)
        let result = Math.sqrt(latDiff+lngDiff)*10000

        if(result > this.state.center_radius) {
            let y =<div className="toast toast-warning" style={{textAlign:'center'}}>
                <button className="btn btn-clear float-right" onClick={this.closeWarning}></button>
                    <p>Warning!!</p>
                    You are out of the area!!!
            </div>
            this.setState({x:y})
        }

    }

    updateHint(){
        if (this.state.found_QRs.includes(this.state.hintContent)) {
            alert("You already submitted this QR.")
            return;
        }
        axios({
            method: 'post',
            url: config.SUBMIT_QR_URL,
            headers: {'Content-Type': 'application/json',
                      'Authorization': localStorage.getItem("token")},
            data: {
                "hint": this.state.hintContent,
                "hintSecret": this.state.qrData,
                "gameId":this.state.gameId,
                "userId": localStorage.getItem("userId")
            }
        }).then((res) => {
            if(res.data.success) {
                let newFound_QRS = this.state.found_QRs
                newFound_QRS.push(this.state.hintContent)
                this.setState({findingQR: newFound_QRS.length, qrDiv:"", found_QRs: newFound_QRS})

            } else {
                alert("QR code does not match your hint, please submit QRs in correct order.")
            }
        }).catch((err) => {
            alert("QR code does not match your hint, please submit QRs in correct order.")
        })
    }

    handleScan = data => {
        let content=<div className="modal active" id="modal-id">

        <div className="modal-container">
          <div className="modal-header">
            <button  onClick={this.closeCamera} className="btn btn-clear float-right" aria-label="Close"></button>
            <div className="modal-title h5" style={{textAlign:"center"}}>Scan The QR Code</div>
          </div>
          <div className="modal-body">
            <div className="content">
            <div className="flex-centered" style={{textAlign:'center', color:'blue', fontWeight:'bold', fontSize:20}}>
            Congratulations! <br></br>
            You read the qr code.<br></br>
            "{data}"
            </div>
          </div>
          </div>
          <div className="modal-footer">
          <button className="btn btn-primary" onClick={this.updateHint}>Submit</button>
          &nbsp;&nbsp;
          <button className="btn" onClick={this.openCamera}>Back</button>
        </div>
        </div>
      </div>
        if (data) {
          this.setState({
            qrData: data,
            qrDiv:content
          })
        }
        //alert(this.state.qrData);
      }

      handleError = err => {
        console.error(err)
      }

    changeTime(){
         // Get today's date and time
         let now = new Date().getTime();

         // Find the distance between now and the count down date
         let distance = countDownDate - now;

         // Time calculations for days, hours, minutes and seconds
         let days = Math.floor(distance / (1000 * 60 * 60 * 24));
         let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((distance % (1000 * 60)) / 1000);

         this.setState({
             remainingTime: days + "d " + hours + "h "
             + minutes + "m " + seconds + "s "
         })

         // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(timee);
            this.setState({
            remainingTime: "Game Over"
        })
    }

        this.setState({hint:false})
    }

    closeWarning(){
        this.setState({x:""})
    }
    returnProfile(){
        this.props.history.push("/profile");
    }
    componentDidMount() {
        /*
         data.sort((a, b) => Number(b.score) - Number(a.score));
         console.log("descending", data);
         this.setState({playerData: data})*/

         //It can be controlled in a time interval.
        let game_title = localStorage.getItem("game_title")
        let game_id = localStorage.getItem("game_id")

         this.setState({ gameName: game_title, gameId:game_id  })
    }
    render() {

        return (
            //&key=AIzaSyBN9jFsxQ7fF3czjlbT359QOchyU9Cnu-s

            <div className="flex-centered">  <LocTracker time={5000}/>  <UpdateGame time={5000} gameId={this.state.gameId} onData={this.handleData} />{this.state.x}
            {this.state.qrDiv}
            {this.state.status === "created"? <div className="modal active" id="example-modal-1">
            <a class="modal-overlay" href="#modals" aria-label="Close"></a>
            <div className="modal-container" role="document">
              <div className="modal-header">
                <div className="modal-title h5" style={{textAlign:"center"}}>Waiting for starting the game</div>
              </div>
              <div className="modal-body">
                <div className="content">
                <div className="flex-centered">
                <div class="loading loading-lg"></div>
                </div>
              </div>
              </div>
              <div className="modal-footer">

            </div>
            </div>
          </div>: null}
          {this.state.status==="Ended" ? <div className="modal active" id="example-modal-1">
            <a class="modal-overlay" href="#modals" aria-label="Close"></a>
            <div className="modal-container" role="document">
              <div className="modal-header">
                <div className="modal-title h5" style={{textAlign:"center"}}>Game is ended!</div>
              </div>
              <div className="modal-body">
                <div className="content">
                <div className="flex-centered">
                    <figure className="avatar">
                    <img src={avatar[0]} alt="Avatar">
                    </img>
                    {this.state.admin_name===this.state.playersData[0].names?<img src="./star.png" className="avatar-icon" alt="Star"/>:null}
                    </figure>
                    
                     {this.state.playersData[0].names} is the Winner!

                    <br></br>
                    <br></br>
                    <br></br>
                    <ul className="menu">
                    {
                            this.state.playersData.map((item, key) =>
                            <li className="menu-item" key={item._id}>

                            <div className="tile-icon">

                                <figure className="avatar">
                                <img src={avatar[this.state.playersData.indexOf(item)%avatar.length]} alt="Avatar">

                                </img>
                                {this.state.admin_name===item.names?<img src="./star.png" className="avatar-icon" alt="Star"/>:null}
                                </figure>
                            </div>
                            <div className="tile-content">
                            <p className="tile-title">
                            {item.names}&nbsp;&nbsp;-&nbsp;&nbsp;<span style={{color:"#FF0000"}}>{item.scores}</span>&nbsp;
                            </p>

                            </div>
                                </li>
                        )
                            }
                        </ul>
                    </div>
                    </div>
                    </div>
                    <div className="modal-footer">
                    <button className="btn btn-primary" onClick={this.returnProfile}>Return Profile Page</button>
                </div>
                </div>
                </div>: null}
                <div className="card">
                        <div className="header">

                             <p>Playing "{this.state.gameName}" with {this.state.playerNumber} other players!</p>
                             <p>Game Description: {this.state.description}</p>
                        </div>
                        <div className="container">
                        <div className="columns">
                        <div className="column col-8 col-xs-12">

                        <div className="map">
                        <WrappedMap
                             googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBN9jFsxQ7fF3czjlbT359QOchyU9Cnu-s`}
                            loadingElement = {<div style={{height:"100%"}} />}
                            containerElement = {<div style={{height:"100%"}} />}
                            lat = {this.state.center_lat}
                            lng = {this.state.center_lng}
                            radius = {this.state.center_radius}
                            mapElement = {<div style={{height:"100%"}} />}
                        />
                        </div>
                        </div>

                        <div className="column col-4 col-xs-12">

                            <div className="leaderboard">
                            <br/>
                            {this.state.game_type !== "Time Rush" ? <div>Remaining number of QRs is {this.state.totalQR - this.state.findingQR}
                            <br></br>
                            <div className="bar bar-lg">
                            <div className="bar-item" role="progressbar" style={{width: (this.state.findingQR*100)/this.state.totalQR+'%',
                            background: '#2196f3'}} aria-valuenow= {(this.state.findingQR*100)/this.state.totalQR} aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            </div> : <div>
                            Remaining time is
                            <div className="timeBox">
                            {this.state.remainingTime}
                            </div>
                            </div>}

                            <br></br>
                            Leaderboard
                            <div className="flex-centered" >
                            <ul className="menu">
                            {
                                    this.state.playersData.map((item, key) =>
                                    <li className="menu-item" key={item._id}>

                                    <div className="tile-icon">

                                        <figure className="avatar">
                                        <img src={avatar[this.state.playersData.indexOf(item)%avatar.length]} alt="Avatar">

                                        </img>
                                        {this.state.admin_name===item.names?<img src="./star.png" className="avatar-icon" alt="Star"/>:null}
                                        </figure>
                                    </div>
                                    <div className="tile-content">
                                    <p className="tile-title">
                                    {item.names}&nbsp;&nbsp;-&nbsp;&nbsp;<span style={{color:"#FF0000"}}>{item.scores}</span>&nbsp;
                                    </p>

                                    </div>
                                        </li>
                                )
                                }
                            </ul>
                            </div>

                            <br/>
                            Submit a QR
                            <div className="flex-centered" >
                            <button onClick={this.openCamera}><img src="./camera.png" className="img-responsive ..." alt="..."></img></button>
                            </div>
                            <br/>
                            Hint
                            <br/>
                            <div className="popover popover-up">
                                <img src="./hint.png" className="img-responsive ..." alt="..."></img>
                                <div className="popover-container">
                                    <div className="card">
                                    <div className="card-header">
                                        Hint #{this.state.found_QRs.length+1}
                                    </div>
                                    <div className="card-body">
                                        {this.state.hintContent}
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        </div>

                </div>
            </div>
        )
    }
}

export default Managegame;
