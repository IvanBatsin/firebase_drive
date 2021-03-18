import React from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CenteredContainer } from './CenteredContainer';

export const SignIn: React.FC = () => {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const history = useHistory();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!emailRef.current!.value || !passwordRef.current!.value) {
      return setError('All fiellds must be entered');
    }

    try {
      setError('');
      setLoading(true);
      await login!(emailRef.current!.value, passwordRef.current!.value);
      history.push('/');
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
          <h2 className="text-center mb-4">Sign In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required/>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required/>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">Sign In</Button>
          </Form>
          <div className="w-100 text-left mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </CenteredContainer>
  )
}