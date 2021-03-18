import React from 'react';
import { SignUp } from './authentication/Signup';
import { AuthContextProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Profile } from './authentication/Profile';
import { SignIn } from './authentication/Signin';
import { PrivateRoute } from './PrivateRoute';
import { ForgotPassword } from './authentication/ForgotPassword';
import { UpdateProfile } from '././authentication/UpdateProfile';
import { Dashboard } from './google_drive/Dashboard';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Switch>
          {/* Drive */}
          <PrivateRoute exact path="/" Component={Dashboard}/>
          <PrivateRoute exact path="/folder/:folderId" Component={Dashboard}/>

          {/* Profile */}
          <PrivateRoute  path="/user" Component={Profile}/>
          <PrivateRoute exact path="/update-profile" Component={UpdateProfile}/>

          {/* Auth */}
          <Route exact path="/signin" component={SignIn}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/forgot-password" component={ForgotPassword}/>
        </Switch>
      </AuthContextProvider>
    </Router>
  );
}