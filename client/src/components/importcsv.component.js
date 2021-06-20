import React, { Component } from "react";
import Papa from "papaparse";
import axios from "axios";

// Importing Logos
import addStudent from "../assets/images/AddStudent.svg";

// Importing the Components from react-bootstrap
import { Container, Col, Form, Row, Alert } from "react-bootstrap";

const port = process.env.REACT_APP_SERVER_PORT;

export default class ImportCsv extends Component {
  state = {
    fname: "",
    email: "",
    event_name: "MLFEST",
    e_duration: "",
    slots: {},
    persons: [],
    eventsd: [],
    // parseSuccess: "",
  };

  // Fetch Data as Soon as Component Loads
  componentDidMount() {
    // localStorage.removeItem("parseSuccess");
    axios
      .get(`http://localhost:${port}/event/`)
      .then((res) => {
        this.setState({ eventsd: res.data });
      })
      .catch((errors) => {
        console.error(errors);
      });
  }

  //
  updateArray(data) {
    console.log(data);
  }

  // Set the Data in state variables
  handleChangeEvent = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
    const slots = {};
    this.state.eventsd
      .filter((row) => row.ename === value)
      .map((eventx) =>
        Object.keys(eventx.slots).map((opt) => {
          slots[opt] = [];
        })
      );
    this.setState({ slots: slots });
  };

  // Update the Data in Database
  handleChange = ({ target }) => {
    const tempFile = target.files[0];
    var x = this.state.event_name;
    var slots = this.state.slots;
    this.setState({ message: "Processing", alertType: "warning" });

    Papa.parse(tempFile, {
      header: true,
      dynamicTyping: true,
      complete: function (fetchedData) {
        console.log(fetchedData.data);
        // const event_name = this.state.event_name;
        fetchedData.data.map((student) => {
          student.event_name = x;
          student.slots = slots;
          console.log(x);
          axios
            .post(`http://localhost:${port}/attendance/register`, {
              fname: student.fname,
              email: student.email,
              event_name: student.event_name,
              contact: student.contact,
              e_duration: student.e_duration,
              slots: student.slots,
            })
            .then(() => {
              console.log("Data has been sent to the server");
              alert("Data has been sent to the server");
              //   localStorage.setItem("parseSuccess", true);
            })
            .catch((error) => {
              console.log(error);
              alert("There was some error" + error);
              //   localStorage.setItem("parseSuccess", false);
            });
          return 0;
        });
      },
    });

    // console.log("gone thru");
  };
  //   check = () => {
  //     // this.state.parseSuccess = localStorage.getItem("parseSuccess");
  //     // console.log(this.state.parseSuccess);
  //     this.state.parseSuccess = localStorage.getItem("parseSuccess");
  //     this.componentDidMount();
  //   };
  render() {
    return (
      <Container className="App-header py-5">
        {this.state.parseSuccess && (
          <Alert variant="success">Data has been sent to server</Alert>
        )}
        <h1>Choose event name from the Dropdown</h1>
        <Form.Control
          name="event_name"
          id="event-input"
          placeholder="Event Name"
          as="select"
          onChange={this.handleChangeEvent}
          custom
        >
          <option value="#" disabled>
            --Select--
          </option>
          {this.state.eventsd.map((opt) => (
            <option key={opt._id} value={opt.ename}>
              {opt.ename}
            </option>
          ))}
        </Form.Control>
        <Row>
          <Col sm="3">
            <img
              alt=""
              src={addStudent}
              width="200"
              height="200"
              className="d-inline-block align-top"
            />
          </Col>
          <Col sm="9" className="App-header">
            <h1 className={this.props.mode}>Add Students for Event</h1>
          </Col>
        </Row>
        <Form onChange={this.handleChange}>
          <input id="fileItem" type="file" />
        </Form>
        {/* <button onClick={this.check}>Check</button> */}
      </Container>
    );
  }
}
