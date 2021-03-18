import React from 'react';
import { Container } from 'react-bootstrap';

export const CenteredContainer: React.FC = ({children}) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
      <div className="w-100" style={{maxWidth: 400}}>{children}</div>
    </Container>
  )
}