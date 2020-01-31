
import React from "react";
import {Redirect, Route} from "react-router-dom";
import jwt from 'jsonwebtoken';
let dateNow = new Date();

function validate(props) {
    try{
        const userTokenDecoded = jwt.decode(localStorage.getItem("token").toString().split("JWT ")[1]);

        const guestToken = props ? props.location.pathname.split("share/")[1] : "";

        const guestTokenDecoded = guestToken ? jwt.decode(guestToken) : "";
        
        return guestTokenDecoded.exp ? guestTokenDecoded.exp < dateNow.getTime() : userTokenDecoded.exp < dateNow.getTime();
    }
    catch(err) {
        return false;
    }
}

export const PrivateRoute = ({component : Component, ...rest}) => (
    <Route
        {...rest}
        render = { props =>
            validate(props) ? (
                <Component {...props} />
            ) : (
                    <Redirect 
                        to = {{
                            pathname: "/"
                        }}
                    />
                )
            }
    />
);

export default PrivateRoute