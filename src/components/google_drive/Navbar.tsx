import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NavbarComponent: React.FC = () => {
  return (
    <Navbar variant="light" expand="md">
      <Navbar.Brand as={Link} to="/">
        WDS Drive
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/user">
          Profile
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}