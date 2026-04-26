import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [healthConcern, setHealthConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/consultation', 
        { name, email, healthConcern },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.message || 'Consultation submitted successfully!');
      setName('');
      setEmail('');
      setHealthConcern('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-5">
        <Col lg={6} className="mx-auto">
          <h1 className="display-5 fw-bold text-center mb-3">Consultation Desk</h1>
          <Card className="shadow">
            <Card.Body className="p-4">
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter patient's full name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter patient's email address"
                    required
                  />
                  <Form.Text className="text-muted">
                    You can submit consultation for any patient (family, friend, relative)
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Health Concern *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={healthConcern}
                    onChange={(e) => setHealthConcern(e.target.value)}
                    placeholder="Describe symptoms, concerns, or questions..."
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" size="lg" className="w-100" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Consultation Request'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;