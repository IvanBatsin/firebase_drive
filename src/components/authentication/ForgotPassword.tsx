import React from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CenteredContainer } from './CenteredContainer';

export const ForgotPassword: React.FC = () => {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const { resetPassword } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!emailRef.current!.value) {
      return setError('Email must be entered');
    }

    try {
      setError('');
      setLoading(true);
      await resetPassword!(emailRef.current!.value);
      setMessage('Check your inbox for futher instructions');
    } catch (error) {
      console.log(error);
      setError('SignIn error');
      setLoading(false);
    }
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required/>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">Reset password</Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/signin">SignIn</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </CenteredContainer>
  )
}