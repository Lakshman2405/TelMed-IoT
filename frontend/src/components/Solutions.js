import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHeart, FaMoon, FaTachometerAlt, FaLungs, FaBrain, FaBaby } from 'react-icons/fa';

const solutions = [
  {
    id: 1,
    icon: <FaHeart size={40} className="text-danger mb-3" />,
    title: "Cardiac Care Plus",
    description: "24/7 ECG monitoring, arrhythmia detection, and heart rate variability analysis with automatic cardiologist alerts.",
    features: ["Real-time ECG", "Arrhythmia alerts", "Weekly reports"]
  },
  {
    id: 2,
    icon: <FaMoon size={40} className="text-primary mb-3" />,
    title: "Sleep Study Pro",
    description: "Comprehensive sleep tracking including REM cycles, oxygen saturation, and personalized sleep improvement plans.",
    features: ["Sleep stages", "Oxygen monitoring", "Smart alarms"]
  },
  {
    id: 3,
    icon: <FaTachometerAlt size={40} className="text-success mb-3" />,
    title: "Diabetes Management",
    description: "Continuous glucose monitoring, insulin tracking, and AI-powered meal recommendations.",
    features: ["CGM integration", "Insulin log", "Carb counter"]
  },
  {
    id: 4,
    icon: <FaLungs size={40} className="text-info mb-3" />,
    title: "Respiratory Wellness",
    description: "Spirometry tracking, asthma attack prediction, and environmental trigger alerts.",
    features: ["Peak flow meter", "Medication reminders", "Air quality alerts"]
  },
  {
    id: 5,
    icon: <FaBrain size={40} className="text-warning mb-3" />,
    title: "Neurological Care",
    description: "Seizure detection, migraine tracking, and cognitive function assessments.",
    features: ["Seizure alerts", "Migraine diary", "Cognitive tests"]
  },
  {
    id: 6,
    icon: <FaBaby size={40} className="text-secondary mb-3" />,
    title: "Maternal Health",
    description: "Pregnancy monitoring, fetal heart rate tracking, and contraction timing for expectant mothers.",
    features: ["Fetal monitoring", "Contraction timer", "Wellness tips"]
  }
];

const Solutions = () => {
  return (
    <Container>
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="display-5 fw-bold mb-3">Monitoring Solutions</h1>
          <p className="lead text-muted">
            Choose the right package for your health needs. All solutions include secure data transmission
            and access to our network of certified physicians.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {solutions.map((solution) => (
          <Col key={solution.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body>
                <div className="text-center">
                  {solution.icon}
                  <Card.Title className="h4 mb-3">{solution.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {solution.description}
                  </Card.Text>
                  <hr />
                  <div className="text-start">
                    <strong>Includes:</strong>
                    <ul className="mt-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-transparent border-top-0 text-center pb-4">
                <Button variant="outline-primary" href="/contact">Request Information</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Solutions;