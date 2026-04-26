import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaClipboardList, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ onLogout }) => {
  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          <FaHeartbeat className="me-2" />
          TeleMed-IoT
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              <FaHeartbeat className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/solutions">
              <FaClipboardList className="me-1" /> Solutions
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              <FaEnvelope className="me-1" /> Consultation
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
              <FaCog className="me-1" /> Settings
            </Nav.Link>
            <Button variant="outline-light" size="sm" onClick={onLogout}>
              <FaSignOutAlt className="me-1" /> Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;