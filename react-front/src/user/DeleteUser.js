import React, { Component } from 'react'
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { remove } from "./apiUser";
import { signout } from "../auth";


class DeleteUser extends Component {
    state = {
        redirect: false
    };

    deleteAccount = () => {
        // console.log("deleted success");
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            }
            else {
                //signout user
                signout(() => console.log("User is deleted"));
                //redirect
                this.setState({ redirect: true });
            }
        });
    };


    deleteConfirmed = () => {
        let answer = window.confirm("Are your sure you want to delete the Profile ?");
        if (answer) {
            this.deleteAccount();
        }
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/" />;
        }
        return (
            <button
                onClick={this.deleteConfirmed}
                className="btn btn-raised btn-danger"
            >
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;