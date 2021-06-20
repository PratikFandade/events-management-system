import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

// Importing the Components from react-bootstrap
import { Container, Button, Card, Alert } from "react-bootstrap";
// import Login from "./loginpage.component";

export default class Activation extends Component {
  state = {
    alertType: "",
    message: "",
    redirect: false,
    rawUrl: window.location.href,
    onlyTok: function () {
      return this.rawUrl.slice(31, this.rawUrl.length);
    },
  };

  // on Submission Add New User
  submit = (event) => {
    event.preventDefault();
    localStorage.setItem("auth-token", this.state.onlyTok());

    axios({
      url: `http://localhost:5000/users/activate/${this.state.onlyTok()}`,
      method: "POST",
    })
      .then(() => {
        this.setState({
          alertType: "success",
          message: "User Added Successfully",
          redirect: true,
        });
        console.log("New User Data has been sent to the server");
      })
      .catch(() => {
        this.setState({
          alertType: "danger",
          message: "There was some problem adding user",
          redirect: false,
        });
        console.log("Internal Server error");
      });
  };

  render() {
    return (
      <Container className="logreg-forms App-header py-5">
        <div>
          {/* display-the-alert-message-begin */}
          <Alert variant={this.state.alertType}>{this.state.message}</Alert>
          {/* display-the-alert-message-end */}

          <Card border="success" style={{ width: "50rem" }}>
            <Card.Header>DSC EMS</Card.Header>

            {/* ACTIVATION FORM */}
            <Card.Body>
              <Card.Title>Activation Page</Card.Title>
              <Card.Text>
                Click on this button to activate your account with this email
              </Card.Text>
              <Button
                variant="outline-info"
                onClick={this.submit}
                size="lg"
                block
              >
                Activate
              </Button>{" "}
            </Card.Body>
          </Card>
          {this.state.redirect && <Redirect path="/" />}
          {localStorage.setItem("newUserAdded", true)}
          {localStorage.removeItem("auth-token")}
        </div>
      </Container>
    );
  }
}
