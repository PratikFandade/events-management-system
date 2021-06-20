import React, { Component } from "react";
import axios from "axios";

// Importing Logos
import eventData from "../assets/images/EventData.svg";

// Importing the Components from react-bootstrap
import { Col, Form, InputGroup, Jumbotron, Row, Table } from "react-bootstrap";

const port = process.env.REACT_APP_SERVER_PORT;

export default class EventData extends Component {
    state = {
      attendees: [],
      nQuery: "",
      eQuery: "",
    };

    // Fetch Data as Soon as Component Loads
    componentDidMount() {
      axios
        .get(`http://localhost:${port}/attendance/`)
        .then((res) => {
          this.setState({ attendees: res.data });
        })
        .catch((errors) => {
          console.error(errors);
        });
    }

    // Fetch attendees according to Search Query
    fetchSearchResults(rows) {
      return rows
        .filter((row) => row.fname.toLowerCase().indexOf(this.state.nQuery) > -1)
        .filter(
            (row) => row.event_name.toLowerCase().indexOf(this.state.eQuery) > -1
        );
    }

    render() {
        return (
            <Jumbotron className={`${this.props.mode} py-5 px-5 m-0`}>
                <Row>
                    <Col sm="auto">
                        <img
                            alt=""
                            src={eventData}
                            width="200"
                            height="200"
                            className="d-inline-block align-top"
                        />
                    </Col>
                    <Col sm="auto" className="App-header">
                        <h1 className={this.props.mode}>Event Data</h1>
                    </Col>
                </Row>
                <br />
                <Form inline>
                    <Form.Row>
                        <Col>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="nQuery"
                                    value={this.state.nQuery}
                                    id="search-input"
                                    placeholder="Search..."
                                    onChange={(e) => this.setState({ nQuery: e.target.value })}
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="eQuery"
                                    value={this.state.eQuery}
                                    id="event-input"
                                    placeholder="Event Name"
                                    onChange={(e) => this.setState({ eQuery: e.target.value })}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Row>
                </Form>
                <br />
                <Table striped bordered hover responsive variant={this.props.mode}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Event</th>
                            <th>Slots Attended</th>
                            <th>Total Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.fetchSearchResults(this.state.attendees).map((person) => (
                            <tr key={person._id} className="mb-3">
                                <td>{person.fname}</td>
                                <td>{person.email}</td>
                                <td>{person.contact}</td>
                                <td>{person.event_name}</td>
                                <td>
                                    {Object.values(person.slots).map((slot) =>
                                        slot !== '' ? `${slot},\xa0` : " "
                                    )}
                                </td>
                                <td>{person.attendance}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Jumbotron>
        );
    }
}
