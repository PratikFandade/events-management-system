import React, { Component } from "react";
import axios from "axios";

import {
  Container,
  Row,
  Alert,
  InputGroup,
  Form,
  Button,
  Nav,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from "react-bootstrap";
import Login from "./loginpage.component";
import { BrowserRouter as Router, Route } from "react-router-dom";

import g from "../assets/images/g.svg";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router-dom";
import email_default from "../assets/images/req_for_adduser/email_default.jpg";
import email_formatcorrect from "../assets/images/req_for_adduser/email_formatcorrect.jpg";
import email_formatwrong from "../assets/images/req_for_adduser/email_formatwrong.jpg";
import password_default from "../assets/images/req_for_adduser/password_default.jpg";
import password_formatcorrect from "../assets/images/req_for_adduser/password_formatcorrect.jpg";
import password_formatwrong from "../assets/images/req_for_adduser/password_formatwrong.jpg";
import name_default from "../assets/images/req_for_adduser/name_default.jpg";
// import name_formatwrong from "../assets/images/req_for_adduser/name_formatwrong.jpg";

import lname_formatcorrect from "../assets/images/req_for_adduser/img_correct.jpg";
import lname_formatwrong from "../assets/images/req_for_adduser/img_wrong.jpg";
import fname_formatcorrect from "../assets/images/req_for_adduser/img_correct.jpg";
import fname_formatwrong from "../assets/images/req_for_adduser/img_wrong.jpg";

export default class AddUser extends Component {
  state = {
    fname: "",
    lname: "",
    fullName: function () {
      return this.fname + " " + this.lname;
    },
    email: "",
    password: "",
    alertType: "",
    message: "",
    fnamePatternMsg: (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-disabled">Enter Firstname</Tooltip>}
      >
        <span className="d-inline-block">
          <img src={name_default} height="50px" />
        </span>
      </OverlayTrigger>
    ),
    lnamePatternMsg: (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-disabled">Enter Lastname</Tooltip>}
      >
        <span className="d-inline-block">
          <img src={name_default} height="50px" />
        </span>
      </OverlayTrigger>
    ),
    // emailPatternMsg: "✉",
    // passwordPatternMsg: "🗝",
    emailPatternMsg: (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-disabled">Enter Email</Tooltip>}
      >
        <span className="d-inline-block">
          <img src={email_default} height="50px" />
        </span>
      </OverlayTrigger>
    ),
    passwordPatternMsg: (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-disabled">Enter Password</Tooltip>}
      >
        <span className="d-inline-block">
          <img src={password_default} height="50px" />{" "}
        </span>
      </OverlayTrigger>
    ),
    fnameFormatMatched: true,
    lnameFormatMatched: true,
    emailFormatMatched: true,
    passwordFormatMatched: true,
    register_visibility: "",
    redirect: false,
    passwordStrength: { variant: "success", now: 0 },
  };
  // timer() {
  //   setTimeout(() => {
  //     this.setState({ alertType: "", message: "" });
  //   }, 7000);
  // }
  // ****** checking for fname and lname ******
  handleChangeNames = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });

    if (name == "fname") {
      this.setState({
        fnamePatternMsg: (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                {value.match("^[a-zA-Z-]+$") != null
                  ? "Valid Format ✔"
                  : "Firstname cannot be empty"}
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <img
                src={
                  value.match("^[a-zA-Z-]+$") != null
                    ? fname_formatcorrect
                    : fname_formatwrong
                }
                height="50px"
              />
            </span>
          </OverlayTrigger>
        ),
        fnameFormatMatched: !(value.match("^[a-zA-Z-]+$") != null),
      });
    }
    if (name == "lname") {
      this.setState({
        lnamePatternMsg: (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                {value.match("^[a-zA-Z-]+$") != null
                  ? "Valid Format ✔"
                  : "Lastname cannot be empty"}
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <img
                src={
                  value.match("^[a-zA-Z-]+$") != null
                    ? lname_formatcorrect
                    : lname_formatwrong
                }
                height="50px"
              />
            </span>
          </OverlayTrigger>
        ),
        lnameFormatMatched: false,
      });
    }
  };
  handleChangeEmail = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
    // console.log(this.state);
    // https://www.w3resource.com/javascript/form/email-validation.php  <= refered for regex for email
    if (
      value.match(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
      ) != null
    ) {
      console.log("All Good");
      this.setState({
        emailPatternMsg: (
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="tooltip-disabled">Valid Format ✔</Tooltip>}
          >
            <span className="d-inline-block">
              <img src={email_formatcorrect} height="50px" />
            </span>
          </OverlayTrigger>
        ),
        emailFormatMatched: false,
      });
    } else {
      console.log("there is some err");
      this.setState({
        emailPatternMsg: (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                Please enter email in given format : sundar12@gmail.com
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <img src={email_formatwrong} height="50px" />
            </span>
          </OverlayTrigger>
        ),
        emailFormatMatched: true,
      });
    }
  };
  handleChangePassword = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
    // console.log(this.state);
    // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/  <= refered for regex for password 8 characters or longer
    if (
      value.match(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      ) != null
    ) {
      console.log("All Good");
      this.setState({
        passwordPatternMsg: (
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="tooltip-disabled">Valid Format ✔</Tooltip>}
          >
            <span className="d-inline-block">
              <img src={password_formatcorrect} height="50px" />
            </span>
          </OverlayTrigger>
        ),
        passwordFormatMatched: false,
      });
      // this.state.passwordPatternMsg = (
      //   <img src={password_formatcorrect} height="50px" />
      // );
    } else {
      console.log(value);
      this.setState({
        passwordPatternMsg: (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                Password must include atleast 1 numeric, 1 special character, 1
                uppercase and 1 lowercase characters and length should be
                greater than or equal to 8 characters
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <img src={password_formatwrong} height="50px" />{" "}
            </span>
          </OverlayTrigger>
        ),
        passwordFormatMatched: true,
      });
    }
    this.state.passwordStrength.now = 0;
    if (value.match("")) {
      this.state.passwordStrength.variant = "danger";
      this.state.passwordStrength.now = 0;
    }
    if (value.match("^(?=.*[a-z])")) {
      this.state.passwordStrength.variant = "danger";
      this.state.passwordStrength.now = this.state.passwordStrength.now + 10;
    }
    if (value.match("^(?=.*[A-Z])")) {
      this.state.passwordStrength.variant = "primary";
      this.state.passwordStrength.now = this.state.passwordStrength.now + 10;
    }
    if (value.match("^(?=.*[0-9])")) {
      this.state.passwordStrength.variant = "info";
      this.state.passwordStrength.now = this.state.passwordStrength.now + 10;
    }
    if (value.match("^(?=.*[!@#$%^&*])")) {
      this.state.passwordStrength.variant = "warning";
      this.state.passwordStrength.now = this.state.passwordStrength.now + 20;
    }
    if (value.match("^(?=.{5,})")) {
      this.state.passwordStrength.variant = "secondary";
      this.state.passwordStrength.now = this.state.passwordStrength.now + 30;
    }
    if (
      value.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    ) {
      this.state.passwordStrength.variant = "success";
      this.state.passwordStrength.now = this.state.passwordStrength.now + 20;
    }
  };

  submit = (event) => {
    event.preventDefault();
    const payLoad = {
      fname: this.state.fullName(),
      email: this.state.email,
      password: this.state.password,
    };
    axios({
      url: "http://localhost:5000/users/register",
      method: "POST",
      data: payLoad,
    })
      .then(() => {
        this.setState({
          alertType: "success",
          message: "An Activation Email Has Been Sent to You",
        });
        console.log("New User Data Has Been Sent to User");
        this.emptyFields();
      })
      .catch(() => {
        this.setState({
          alertType: "danger",
          message: "There was some problem !",
        });
        console.log("Internal Server error");
      });
  };
  responseGoogleSucess = (response) => {
    const payLoad = {
      fname: response.profileObj.name,
      email: response.profileObj.email,
      googleId: response.profileObj.googleId,
    };
    console.log(response);
    axios({
      url: "http://localhost:5000/users/google/register",
      method: "POST",
      data: payLoad,
    })
      .then(() => {
        this.setState({
          alertType: "success",
          message: "Sign Up with Google Successfull",
          redirect: true,
        });
        console.log("New User Added using email");
      })
      .catch(() => {
        this.setState({
          alertType: "danger",
          message: "There was some problem !",
          redirect: false,
        });
        console.log("Internal Server error");
      });
  };
  responseGoogleFailure = (response) => {
    console.log("Failed");
  };
  emptyFields = () => {
    // if you dont want to reload the page use the below line
    // this.setState({ fname: "",lname: "", email: "",password: "",passwordStrength: { now: 0 } });
    setTimeout(() => {
      this.setState({ alertType: "", message: "" });
      window.location.reload(false);
      // window.open("about:blank", "_self");
      // window.close();
      // window.close(false);
    }, 5000);
  };
  render() {
    return (
      <Container className="logreg-forms App-header py-5">
        <Alert variant={this.state.alertType}>{this.state.message}</Alert>
        <Form className="form-signin" onSubmit={this.submit}>
          <Nav fill variant="pills" activeKey="2" defaultActiveKey="/home">
            <Nav.Item>
              <Nav.Link
                href="/"
                // onClick={localStorage.setItem("loadComponent", "login")}
                eventKey="1"
              >
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="2">Register</Nav.Link>
            </Nav.Item>
          </Nav>
          <Form.Row as={Row} controlId="formBasicText">
            <Form.Label column sm="2">
              First&nbsp;Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ex: Sundar"
                name="fname"
                onChange={this.handleChangeNames}
                // value={this.state.fname}
              />
              <InputGroup.Append>
                {this.state.fnamePatternMsg}
              </InputGroup.Append>
            </InputGroup>
          </Form.Row>
          <Form.Row as={Row} controlId="formBasicText">
            <Form.Label column sm="2">
              Last&nbsp;Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ex: Pichai"
                name="lname"
                onChange={this.handleChangeNames}
                // value={this.state.lname}
              />
              <InputGroup.Append>
                {this.state.lnamePatternMsg}
              </InputGroup.Append>
            </InputGroup>
          </Form.Row>
          <Form.Row as={Row} controlId="formBasicText">
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                // pattern="[a-z]"
                placeholder="Ex: sundarp12@gmail.com"
                name="email"
                onChange={this.handleChangeEmail}
                // value={this.state.email}
              />
              <InputGroup.Append>
                {this.state.emailPatternMsg}
              </InputGroup.Append>
            </InputGroup>
          </Form.Row>
          <Form.Row as={Row} controlId="formBasicPassword">
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="password"
                placeholder="************"
                name="password"
                onChange={this.handleChangePassword}
                // value={this.state.password}
              />
              <InputGroup.Append>
                {this.state.passwordPatternMsg}
              </InputGroup.Append>
            </InputGroup>

            {/* <Form.Row.Text id="inputGroupPrepend">@</Form.Row.Text> */}
          </Form.Row>
          {/* <Form.Row> */}
          <ProgressBar
            striped
            variant={this.state.passwordStrength.variant}
            now={this.state.passwordStrength.now}
          />
          {/* </Form.Row> */}
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                {this.state.emailFormatMatched ||
                this.state.passwordFormatMatched
                  ? "Please enter valid inputs !"
                  : "Good to Go"}
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <Button
                variant="primary"
                type="submit"
                disabled={
                  this.state.emailFormatMatched ||
                  this.state.passwordFormatMatched ||
                  this.state.lnameFormatMatched ||
                  this.state.fnameFormatMatched
                }
                style={
                  this.state.passwordFormatMatched ||
                  this.state.emailFormatMatched ||
                  this.state.fnameFormatMatched ||
                  this.state.lnameFormatMatched
                    ? { pointerEvents: "none" }
                    : { pointerEvents: "" }
                }
              >
                Register
              </Button>
            </span>
          </OverlayTrigger>

          {/* *****************Google Sign-Up button ***************/}
          <GoogleLogin
            clientId="691642170006-32g0ra7u2f0urmodqlit09igg2n96o5a.apps.googleusercontent.com"
            onSuccess={this.responseGoogleSucess}
            onFailure={this.responseGoogleFailure}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <Button
                id="g"
                className="my-2"
                variant="light"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                block
              >
                <img
                  alt=""
                  src={g}
                  width="20"
                  height="20"
                  className="d-inline-block align-top"
                />{" "}
                &nbsp;Sign-up with Google
              </Button>
            )}
          ></GoogleLogin>
        </Form>

        {this.state.redirect && <Redirect to="/" />}
        {this.state.redirect && localStorage.setItem("newUserAdded", true)}
      </Container>
    );
  }
}
