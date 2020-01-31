import React from "react";
import {withRouter} from "react-router";


class Navbar extends React.Component {
    signout = () => {
        localStorage.clear();
        this.props.history.push("/");
    };

    go = (link) => {
        const fn = () =>{
            this.props.history.push(link);
        };
        return fn.bind(this);
    };

    render(){
        return(
            <div style={{backgroundColor: "black"}}>
            <header className="navbar hide-md">
                <section className="navbar-section">
                    <button href="" onClick={this.go("/create-game")} className="btn btn-link navbar-brand mr-1">Create Game</button>
                    <button  href="" onClick={this.go("/join-game")} className="btn btn-link navbar-brand mr-1">Join Game</button>
                </section>
                <section className="navbar-center">
                    <h3 className="text-primary"> QR PILOT </h3>
                </section>
                <section className="navbar-section">
                    <button href=""  onClick={this.go("/profile")} className="btn btn-link navbar-brand mr-1">Profile</button>
                    <button href=""  onClick={this.signout} className="btn btn-link navbar-brand mr-1">Sign Out</button>
                </section>
            </header>
            <div className="dropdown show-md">
                <ul className="tab tab-block">
                    <li className="tab-item">
                        <button  href="" onClick={this.go("/create-game")} className="btn btn-link navbar-brand mr-1">Create</button>
                    </li>
                    <li className="tab-item">
                        <button  href="" onClick={this.go("/join-game")} className="btn btn-link navbar-brand mr-1">Join</button>
                    </li>
                    <li className="tab-item">
                        <button  href="" onClick={this.go("/profile")} className="btn btn-link navbar-brand mr-1">Profile</button>
                    </li>
                    <li className="tab-item">
                        <button  href="" onClick={this.signout} className="btn btn-link navbar-brand mr-1">Sign Out</button>
                    </li>
                </ul>
            </div>

            </div>

        )
    }
}


export default withRouter(Navbar)
