import React from "react"
import config from "../config";
import axios from "axios";



class LocTracker extends React.Component {
    constructor(){
        super()
        this.state = {
            user_id: "",
            user_token: "",
            latitude: null,
            longitude: null
        }
    }

    position = () => {
        navigator.geolocation.getCurrentPosition(
            pos => this.setState({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }, () => {
                axios({
                    method: 'put',
                    url: config.UPDATE_LOCATION_URL + this.state.user_id,
                    headers: {'Content-Type': 'application/json',
                              'Authorization': this.state.user_token},
                    data: {
                        "location": {
                            "latitude": this.state.latitude,
                            "longitude": this.state.longitude
                        }
                    }
                }).then( (res) => {
                  if (res.data.success) {
                    localStorage.setItem("lng", this.state.longitude)
                    localStorage.setItem("lat", this.state.latitude)
                  }
                }).catch( (err) => {
                  console.log("err", err);
                })
            })
        )
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
        this.interval = setInterval(this.position, this.props.time)
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }
    render(){
        return(<div></div>)
    }
}

export default LocTracker;
