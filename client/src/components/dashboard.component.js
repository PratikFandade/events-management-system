import React, { Component } from "react";
import axios from "axios";

// Importing Logos
import Attendance from "../assets/images/Attendance.svg";

// Importing the Components from react-bootstrap
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Jumbotron,
  Row,
  Table,
} from "react-bootstrap";

const port = process.env.REACT_APP_SERVER_PORT;

export default class DashBoard extends Component {
  state = {
    persons: [],
    eventsd: [],
    personx: [],
    eQuery: "MLFEST",
    dQuery: "Day1",
    url: "",
    message: "",
    alertType: "",
  };

  // Fetch Data as Soon as Component Loads
  componentDidMount() {
    console.log(JSON.parse(localStorage.getItem("auth-token")));
    const attendance = axios.get(`http://localhost:${port}/attendance/`);
    const eventsData = axios.get(`http://localhost:${port}/event/`, {
      headers: JSON.parse(localStorage.getItem("auth-token")),
    });

    axios
      .all([attendance, eventsData])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          this.setState({
            persons: responseOne.data,
            eventsd: responseTwo.data,
          });
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  }

  // Fetch the attendees from the Table for the Event
  fetchAttendees(rows) {
    return rows.filter((row) => row.event_name === this.state.eQuery);
  }

  // Fetch the event from the events
  fetchEvent(rows) {
    return rows.filter((row) => row.ename.indexOf(this.state.eQuery) > -1);
  }

  // Fetch the slots from the events
  fetchSlots(rows) {
    return rows[this.state.dQuery];
  }

  // Mark Attedance accordingly
  submitAttendance = (e) => {
    this.setState({ message: "Processing", alertType: "warning" });
    this.fetchAttendees(this.state.persons).map((person) => {
      var attendance = 0;
      const slots = person.slots;
      const id = person._id;
      this.fetchEvent(this.state.eventsd).map((eventx) => {
        this.fetchSlots(eventx["slots"]).map((slot) => {
          if (document.getElementById([person._id, slot]).checked) {
            if (!this.fetchSlots(person.slots).includes(slot)) {
              slots[this.state.dQuery].push(slot);
              attendance += 1;
            }
          }
        });
      });
      axios
        .post(`http://localhost:${port}/attendance/attend/${id}`, {
          slots: slots,
          attendance: attendance,
        })
        .then((res) => {
          console.log(res.data);
          this.setState({ message: "Attendance Marked", alertType: "success" });
        })
        .catch((error) => {
          console.error(error);
          this.setState({ message: "Error", alertType: "danger" });
        });
      setTimeout(this.setState({ message: "", alertType: "" }), 3000);
    });
  };

  render() {
    return (
      <Container fluid>
        <Jumbotron className={`${this.props.mode} py-5 px-5 m-0`}>
          {/* display-the-alert-message-begin */}
          <Alert variant={this.state.alertType}>{this.state.message}</Alert>
          {/* display-the-alert-message-end */}

          {/* display-attendance-table-begin */}
          <Row>
            <Col sm="auto">
              <img
                alt=""
                src={Attendance}
                width="200"
                height="200"
                className="d-inline-block align-top"
              />
            </Col>
            <Col sm="auto" className="App-header">
              <h1 className={this.props.mode}>Attendance</h1>
            </Col>
          </Row>
          <br />
          <Form>
            <Row>
              <Form.Row className="align-items-center">
                <Col md="auto">
                  <Form.Label className="mb-3">Event : </Form.Label>
                </Col>
                <Col md="auto">
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="eQuery"
                      id="event-input"
                      placeholder="Event Name"
                      as="select"
                      onChange={(e) => {
                        this.setState({
                          eQuery: document.getElementById("event-input").value,
                        });
                      }}
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
                    <Form.Control
                      name="dQuery"
                      id="day-input"
                      as="select"
                      custom
                    >
                      <option value="#" disabled>
                        --Select--
                      </option>
                      {this.fetchEvent(this.state.eventsd).map((eventx) =>
                        Object.keys(eventx.slots).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))
                      )}
                    </Form.Control>
                    <InputGroup.Append>
                      <Button
                        onClick={(e) => {
                          this.setState({
                            eQuery: document.getElementById("event-input")
                              .value,
                            dQuery: document.getElementById("day-input").value,
                          });
                        }}
                      >
                        Show Data
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Row>
            </Row>
          </Form>
          <br />
          <Form>
            <Table striped bordered hover responsive variant={this.props.mode}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Event</th>
                  {this.fetchEvent(this.state.eventsd).map((day) =>
                    this.fetchSlots(day.slots).map((slot) => (
                      <th key={slot}>{slot}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {this.fetchAttendees(this.state.persons).map((person) =>
                  this.fetchEvent(this.state.eventsd).map((eventx) => (
                    <tr key={person._id + eventx}>
                      <td key="1">{person.fname}</td>
                      <td key="2">{person.email}</td>
                      <td key="4">{person.event_name}</td>
                      {this.fetchSlots(eventx["slots"]).map((slot) => (
                        <td key={slot}>
                          <Form.Check
                            type="checkbox"
                            id={[person._id, slot]}
                            defaultChecked={
                              this.fetchSlots(person.slots).includes(slot)
                                ? "true"
                                : ""
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <Button onClick={this.submitAttendance} className="mb-2">
              Submit Attendance
            </Button>
          </Form>
          {/* display-attendance-table-end */}
        </Jumbotron>
      </Container>
    );
  }
}
