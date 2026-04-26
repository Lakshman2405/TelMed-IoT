import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaShieldAlt, FaClock, FaMobileAlt, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      {/* Hero Section */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-4 fw-bold text-primary mb-3">
            Secure Remote Health Monitoring
          </h1>
          <p className="lead mb-4">
            TeleMed-IoT combines cutting-edge wearable technology with enterprise-grade security
            to deliver reliable, real-time health tracking from the comfort of your home.
          </p>
          <Button as={Link} to="/contact" variant="primary" size="lg" className="me-2">
            Start Consultation
          </Button>
          <Button as={Link} to="/solutions" variant="outline-primary" size="lg">
            View Solutions
          </Button>
        </Col>
      </Row>

      {/* Security Features */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Why Trust TeleMed-IoT?</h2>
        </Col>
      </Row>
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <FaShieldAlt size={40} className="text-primary mb-3" />
              <Card.Title>Bank-Level Encryption</Card.Title>
              <Card.Text>
                All health data is encrypted using AES-256, ensuring your information remains private and secure.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <FaClock size={40} className="text-primary mb-3" />
              <Card.Title>24/7 Real-Time Monitoring</Card.Title>
              <Card.Text>
                Continuous health tracking with instant alerts for any concerning changes in your vitals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <FaMobileAlt size={40} className="text-primary mb-3" />
              <Card.Title>Seamless Integration</Card.Title>
              <Card.Text>
                Compatible with all major wearables including Apple Watch, Fitbit, and our proprietary devices.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 text-center shadow-sm">
            <Card.Body>
              <FaChartLine size={40} className="text-primary mb-3" />
              <Card.Title>AI-Powered Analytics</Card.Title>
              <Card.Text>
                Advanced algorithms detect patterns and provide actionable insights for better health outcomes.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reliability Stats */}
      <Row className="bg-light rounded-3 p-5 mb-4">
        <Col md={4} className="text-center mb-3 mb-md-0">
          <h3 className="display-5 fw-bold text-primary">99.99%</h3>
          <p className="text-muted">Uptime Reliability</p>
        </Col>
        <Col md={4} className="text-center mb-3 mb-md-0">
          <h3 className="display-5 fw-bold text-primary">1M+</h3>
          <p className="text-muted">Active Patients</p>
        </Col>
        <Col md={4} className="text-center">
          <h3 className="display-5 fw-bold text-primary">50+</h3>
          <p className="text-muted">Partner Hospitals</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;