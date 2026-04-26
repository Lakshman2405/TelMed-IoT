import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [healthSummary, setHealthSummary] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState('');

  const fetchPatientData = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    
    setFetchLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/patients/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientData(response.data.data);
      setNewEmail(response.data.data.email);
      setHealthSummary(response.data.data.healthSummary || '');
      setSuccess('Patient data loaded successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load patient data');
      setPatientData(null);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/patients/${email}`, {
        email: newEmail,
        healthSummary: healthSummary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(response.data.message);
      setPatientData(response.data.data);
      if (newEmail !== email) {
        setEmail(newEmail);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateProfile = async () => {
    if (confirmDeactivate !== patientData?.name) {
      setError('Please type the patient name exactly to confirm deletion');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patients/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile has been permanently deactivated');
      setPatientData(null);
      setEmail('');
      setNewEmail('');
      setHealthSummary('');
      setConfirmDeactivate('');
    } catch (err) {
      setError(err.response?.data?.error || 'Deactivation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h1 className="display-5 fw-bold text-center mb-3">Account Settings</h1>
          <Tabs defaultActiveKey="view" className="mb-4" fill>
            <Tab eventKey="view" title="View Profile">
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Enter your email to view profile</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="email"
                        placeholder="patient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button variant="primary" onClick={fetchPatientData} disabled={fetchLoading}>
                        {fetchLoading ? <Spinner size="sm" /> : 'Load'}
                      </Button>
                    </div>
                  </Form.Group>
                  {fetchLoading && <div className="text-center py-3"><Spinner /></div>}
                  {patientData && (
                    <div className="mt-4">
                      <Alert variant="info"><strong>Patient Information</strong></Alert>
                      <p><strong>Name:</strong> {patientData.name}</p>
                      <p><strong>Email:</strong> {patientData.email}</p>
                      <p><strong>Health Concern:</strong> {patientData.healthConcern}</p>
                      <p><strong>Health Summary:</strong> {patientData.healthSummary || 'Not provided yet'}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="edit" title="Edit Records">
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Email (to edit)</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button variant="secondary" size="sm" className="mt-2" onClick={fetchPatientData}>
                      Load Patient Data
                    </Button>
                  </Form.Group>
                  {patientData && (
                    <Form onSubmit={handleUpdateProfile}>
                      <Form.Group className="mb-3">
                        <Form.Label>New Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Health Summary</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={healthSummary}
                          onChange={(e) => setHealthSummary(e.target.value)}
                        />
                      </Form.Group>
                      <Button type="submit" variant="success" disabled={loading}>
                        {loading ? 'Updating...' : 'Save Changes'}
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="deactivate" title="Deactivate Profile">
              <Card className="shadow-sm border-danger">
                <Card.Body className="p-4">
                  <Alert variant="danger"><strong>⚠️ Danger Zone</strong> — This action is irreversible.</Alert>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button variant="secondary" size="sm" className="mt-2" onClick={fetchPatientData}>
                      Load Patient
                    </Button>
                  </Form.Group>
                  {patientData && (
                    <>
                      <p><strong>Patient:</strong> {patientData.name}</p>
                      <Form.Group className="mb-3">
                        <Form.Label>Type <strong>{patientData.name}</strong> to confirm:</Form.Label>
                        <Form.Control
                          type="text"
                          value={confirmDeactivate}
                          onChange={(e) => setConfirmDeactivate(e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="danger" onClick={handleDeactivateProfile} disabled={loading || confirmDeactivate !== patientData.name}>
                        {loading ? 'Processing...' : 'Permanently Deactivate'}
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;