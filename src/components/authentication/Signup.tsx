import React from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CenteredContainer } from './CenteredContainer';

export const SignUp: React.FC = () => {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const passwordConfirmRef = React.useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const history = useHistory();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (passwordRef.current!.value !== passwordConfirmRef.current?.value) {
      return setError('Passwords not equal');
    }

    if (!emailRef.current!.value) {
      return setError('Email is requried');
    }

    try {
      setError('');
      setLoading(true);
      await signup!(emailRef.current!.value, passwordRef.current!.value);
      history.push('/');
    } catch (error) {
      console.log(error);
      setError('SignUp error');
      setLoading(false);
    }
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
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
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="passwird" ref={passwordConfirmRef} required/>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/signin">Sign In</Link>
      </div>
    </CenteredContainer>
  )
}