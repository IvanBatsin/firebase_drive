import React from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CenteredContainer } from './CenteredContainer';

export const Profile: React.FC = () => {
  const [error, setError] = React.useState<string>('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    setError('');
    try {
      await logout!();
      history.push('/signin');
    } catch (error) {
      setError('LogOut error');
      console.log(error);
    }
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2>Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong>{currentUser?.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
       <Button onClick={handleLogout} variant="link">Logout</Button>
      </div>
    </CenteredContainer>
  )
}