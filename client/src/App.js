import React from "react";
import "./assets/css/App.css";

// Importing Required logos
import logo from "./assets/images/logo.svg";
import dark from "./assets/images/DarkMode.svg";
import light from "./assets/images/LightMode.svg";
import homelight from "./assets/images/home-light.svg";
import studentlight from "./assets/images/student-light.svg";
import eventlight from "./assets/images/event-light.svg";
import datalight from "./assets/images/data-light.svg";
import csvlight from "./assets/images/csv-light.svg";
import homedark from "./assets/images/home-dark.svg";
import studentdark from "./assets/images/student-dark.svg";
import eventdark from "./assets/images/event-dark.svg";
import datadark from "./assets/images/data-dark.svg";
import csvdark from "./assets/images/csv-dark.svg";
import userLight from "./assets/images/user-light.svg";
import userDark from "./assets/images/user-dark.svg";

// Importing react-bootstrap & Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Dropdown,
  DropdownButton,
  Button,
  Badge,
  Col,
  Form,
  Nav,
  Navbar,
  Row,
} from "react-bootstrap";

// Importing Router from react-dom
import { BrowserRouter as Router, Route } from "react-router-dom";

// Importing the components
import DashBoard from "./components/dashboard.component";
import AddStudent from "./components/addstudent.component";
import AddEvent from "./components/addevent.component";
import EventData from "./components/eventData.component";
import ImportCsv from "./components/importcsv.component";
import AddUser from "./components/adduser.component";
import Login from "./components/loginpage.component";
import Activation from "./components/activation.component";
import GoogleActivation from "./components/googleActivation.component";
import jwt_decode from "jwt-decode";
import axios from "axios";
// Main Driver App
export default function App() {
  // decoding name from local storage auth-token
  // localStorage.setItem("loadComponent", "login");
  const userGoogleImgUrl = localStorage.getItem("userGoogleImgUrl");
  const nameDecoder = () => {
    if (localStorage.getItem("auth-token")) {
      const tokenStr = localStorage.getItem("auth-token");
      const splitTokenStr = tokenStr.split(",");
      const targetToken = splitTokenStr[2].split('"');
      const decoded = jwt_decode(targetToken[3]);
      return decoded.fname;
    } else {
      return "";
    }
  };
  // console.log(decoded.fname);
  // Dark Mode Implementation
  const [darkMode, setDarkMode] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  React.useEffect(() => {
    const data = localStorage.getItem("darkmode");
    if (data) {
      setDarkMode(JSON.parse(data));
    }
    const data1 = localStorage.getItem("login");
    if (data1) {
      setLogin(JSON.parse(data1));
    }
  }, []);
  React.useEffect(() => {
    localStorage.setItem("darkmode", JSON.stringify(darkMode));
    localStorage.setItem("login", JSON.stringify(login));
  });
  const onLogout = () => {
    // () => {
    setLogin(!login);
    // *//////******************* */
    localStorage.setItem("auth-token", "");
    localStorage.removeItem("userGoogleImgUrl");
    // };
  };

  if (login) {
    return (
      <Router>
        <div className={darkMode ? "App-dark" : "App-light"}>
          {/* Computer Navbar */}
          <Navbar className={darkMode ? "bag-dark navbar-dark" : " "}>
            <Navbar.Brand href="/">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              <b>DSC</b> : EMS
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/addstudent">Add Student</Nav.Link>
              <Nav.Link href="/addevent">Create New Event</Nav.Link>
              <Nav.Link href="/eventsdata">Show Event Data</Nav.Link>
              <Nav.Link href="/imcsv">Import .csv</Nav.Link>
            </Nav>
            <Form inline variant={darkMode ? "dark" : "light"}>
              <img
                alt="userGoogleImgUrl"
                // src={darkMode ? userDark : userLight}
                src={
                  localStorage.getItem("userGoogleImgUrl")
                    ? userGoogleImgUrl
                    : darkMode
                    ? userDark
                    : userLight
                }
                width="45"
                height="45"
                className="m-2 d-inline-block align-top rounded-circle"
              />{" "}
              <DropdownButton
                variant={darkMode ? "dark" : "light"}
                drop="down"
                id="dropdown-basic-button"
                title={nameDecoder()}
              >
                <Dropdown.Item
                  onClick={onLogout}
                  variant={darkMode ? "dark" : "light"}
                >
                  Logout
                </Dropdown.Item>
              </DropdownButton>
              <img
                alt=""
                src={darkMode ? light : dark}
                width="70"
                height="70"
                className="d-inline-block align-top"
                onClick={() => {
                  setDarkMode(!darkMode);
                }}
              />
            </Form>
          </Navbar>
          {/* **************************************** */}

          {/* Mobile Navbar */}
          <Navbar
            fixed="bottom"
            as={Row}
            variant="tabs"
            className={`mobile-nav-${darkMode ? "dark" : "light"}`}
          >
            <Nav.Item as={Col} lg="auto">
              <Nav.Link href="/">
                <img
                  alt=""
                  src={darkMode ? homedark : homelight}
                  width="15"
                  height="15"
                  className="d-inline-block align-top"
                />
                <p>Home</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as={Col} lg="auto">
              <Nav.Link href="/addstudent">
                <img
                  alt=""
                  src={darkMode ? studentdark : studentlight}
                  width="15"
                  height="15"
                  className="d-inline-block align-top"
                />
                <p>Add Student</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as={Col} lg="auto">
              <Nav.Link href="/addevent">
                <img
                  alt=""
                  src={darkMode ? eventdark : eventlight}
                  width="15"
                  height="15"
                  className="d-inline-block align-top"
                />
                <p>Add Event</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as={Col} lg="auto">
              <Nav.Link href="/imcsv">
                <img
                  alt=""
                  src={darkMode ? csvdark : csvlight}
                  width="15"
                  height="15"
                  className="d-inline-block align-top"
                />
                <p>Import Csv</p>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as={Col} lg="auto">
              <Nav.Link href="/eventsdata">
                <img
                  alt=""
                  src={darkMode ? datadark : datalight}
                  width="15"
                  height="15"
                  className="d-inline-block align-top"
                />
                <p>Event Data</p>
              </Nav.Link>
            </Nav.Item>
          </Navbar>

          {/* React Router Routes */}
          <Route
            path="/"
            exact
            render={() => <DashBoard mode={darkMode ? "dark" : "light"} />}
          />
          <Route
            path="/addstudent"
            exact
            render={() => <AddStudent mode={darkMode ? "dark" : "light"} />}
          />
          <Route
            path="/addevent"
            render={() => <AddEvent mode={darkMode ? "dark" : "light"} />}
          />
          <Route
            path="/eventsdata"
            render={() => <EventData mode={darkMode ? "dark" : "light"} />}
          />
          <Route
            path="/imcsv"
            render={() => <ImportCsv mode={darkMode ? "dark" : "light"} />}
          />
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        {/* {localStorage.getItem("loadComponent") == undefined && ( */}
        <Route
          path="/"
          exact
          // darkmode passed but never used
          render={() => <Login mode={darkMode ? "dark" : "light"} />}
        />
        {/* // )} */}
        {/* {localStorage.getItem("loadComponent") == "register" && ( */}
        <Route
          path="/register"
          exact
          render={() => <AddUser mode={darkMode ? "dark" : "light"} />}
        />
        {/* )} */}
        <Route
          path="/activate"
          render={() => <Activation mode={darkMode ? "dark" : "light"} />}
        />
        <Route
          path="/google/activate"
          render={() => <GoogleActivation mode={darkMode ? "dark" : "light"} />}
        />
        <Route
          path={["/addstudent", "/addevent", "/eventsdata", "/imcsv"]}
          exact
          render={() => (
            <Login
              mode={darkMode ? "dark" : "light"}
              message="Please Login to access this route   "
              alertType={"warning"}
            />
          )}
        />
      </Router>
    );
  }
}
