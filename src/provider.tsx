import { log } from 'console';
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AuthService from './services/auth';

// User interface as per the object structure
interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  smuNo: string;
  userType: string;
  year: string;
}

// Context type
interface UserContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

// Creating the context
export const UserContext = createContext<UserContextType | null>(null);

interface ProviderLayoutProps {
  children?: React.ReactNode;
}

const ProviderLayout = ({ children }: ProviderLayoutProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userType, setUserType] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user from local storage
    const storedUser = localStorage.getItem('user');
    console.log(storedUser);
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Get user role when the user is available
      AuthService.getUserRole(JSON.parse(storedUser).id) // Replace 'userId' with the actual property name
        .then((role: string) => {
          console.log(role);
          setUserType(role);
        });
        
    } else {
      // Redirect to login if no user is found
      navigate('/login');
    }
  }, [navigate]);

  // If user or userRole is still being determined, render nothing or a loading component
  if (user === undefined || userType === undefined) {
    return null; 
  }

  // Include userRole in the context
  const userWithContext: User = {
    ...user,
    userType
  };

  return (
    <UserContext.Provider value={{ user: userWithContext, setUser }}>
      <Outlet context={{ user: userWithContext }} />
      {children}
    </UserContext.Provider>
  );
};

export default ProviderLayout;