import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  Component: any,
  [key: string]: any
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({Component, ...rest}: PrivateRouteProps) => {
  const { currentUser } = useAuth();
  return (
    <Route {...rest} render={props => {
      return currentUser ? <Component {...props}/> : <Redirect to="signin"/>
    }}>

    </Route>
  )
}