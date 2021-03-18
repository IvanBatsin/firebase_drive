import React from 'react';
import { auth } from '../firebase';

interface AuthContextProps {
  currentUser: firebase.default.User | undefined,
  signup: (email: string, password: string) => Promise<any>,
  login: (email: string, password: string) => Promise<any>,
  logout: () => Promise<void>,
  resetPassword: (email: string) => Promise<void>,
  updateEmail: (email: string) => Promise<void>,
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = React.createContext<Partial<AuthContextProps>>({});

export const AuthContextProvider: React.FC = ({children}) => {
  const [currentUser, setCurrentUser] = React.useState<firebase.default.User | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(true);

  const signup = (email: string,  password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  const login = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  }

  const logout = () => {
    return auth.signOut();
  }

  const resetPassword = (email: string) => {
    return auth.sendPasswordResetEmail(email);
  }

  const updateEmail = (email: string) => {
    return currentUser!.updateEmail(email);
  }

  const updatePassword = (password: string) => {
    return currentUser!.updatePassword(password);
  }

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user!);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextProps = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail, 
    updatePassword
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? <h2>Loading...</h2> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext);