import React, { Component } from "react";
import axios from "axios";

// Importing Logos
import addStudent from "../assets/images/AddStudent.svg";

// Importing the Components from react-bootstrap
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

const port = process.env.REACT_APP_SERVER_PORT;

export default class AddStudent extends Component {
  state = {
    eventsd: [],
    fname: "",
    email: "",
    event_name: "MLFEST",
    e_duration: "",
    message: "",
    alertType: "",
  };

  // Fetch Data as soon as Component Loads
  componentDidMount() {
    const eventsData = axios.get(`http://localhost:${port}/event/`);

    axios
      .all([eventsData])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          this.setState({
            eventsd: responseOne.data,
          });
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  }

  // Set the Data from the inputs to state variable
  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  // Set the state.slots variable to append slots in Database
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

  // Mark the respective attendance accordingly
  submit = (event) => {
    event.preventDefault();

    const payLoad = {
      fname: this.state.fname,
      email: this.state.email,
      event_name: this.state.event_name,
      contact: this.state.contact,
      e_duration: this.state.e_duration,
      slots: this.state.slots,
    };

    this.setState({ message: "Processing", alertType: "warning" });

    axios({
      url: "http://localhost:5000/attendance/register",
      method: "POST",
      data: payLoad,
    })
      .then(() => {
        // console.log("Data has been sent to the server");
        this.setState({
          message: "Spot Registration Done",
          alertType: "success",
        });
      })
      .catch(() => {
        // console.log("Internal Server error");
        this.setState({ message: "Error", alertType: "danger" });
      });

    setTimeout(this.setState({ message: "", alertType: "" }), 3000);
  };

  render() {
    return (
      <Container className="App-header py-5">
        {/* display-the-alert-message-begin */}
        <Alert variant={this.state.alertType}>{this.state.message}</Alert>
        {/* display-the-alert-message-end */}

        {/* add-student-form-begin */}
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
            <h1 className={this.props.mode}>Add Student</h1>
          </Col>
        </Row>
        <Form onSubmit={this.submit}>
          {/* ATTENDEE NAME */}
          <Form.Row controlId="formBasicText">
            <Form.Label column sm="2">
              Full Name
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="fname"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>

          {/* ATTENDEE EMAIL */}
          <Form.Row controlId="formBasicEmail">
            <Form.Label column sm="2">
              Email address
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>

          {/* ATTENDEE CONTACT */}
          <Form.Row controlId="formBasicEmail">
            <Form.Label column sm="2">
              Contact No.
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Enter contact"
                name="contact"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>

          {/* EVENT */}
          <Form.Row controlId="formBasicTest">
            <Form.Label column sm="2">
              Event Name
            </Form.Label>
            <Col column sm="10" className="mb-4">
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
            </Col>
          </Form.Row>

          {/* ATTENDEE DURATION */}
          <Form.Row controlId="formBasicText">
            <Form.Label column sm="2">
              Event Duration
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <InputGroup column sm={10} className="mb-2">
                <Form.Control
                  type="number"
                  placeholder="Duration"
                  name="e_duration"
                  onChange={this.handleChange}
                />
                <InputGroup.Append>
                  <InputGroup.Text>Days</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Row>

          {/* SUBMIT BUTTON */}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* add-student-form-end */}
      </Container>
    );
  }
}
