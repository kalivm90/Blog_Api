import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to easily access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your app with
export const AuthProvider = ({ children }) => {
  // State to hold authentication data
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    // Check if there is authentication data in localStorage when the component mounts

    // Attempt to retrieve authentication data from localStorage
    const storedAuthData = localStorage.getItem('authData');


    try {
      if (storedAuthData) {
        // Attempt to parse the stored data and set it in the state
        setAuthData(JSON.parse(storedAuthData));
      } else {
        // If no data is found, set some default or initial authentication data
        const initialAuthData = { isAuthenticated: false, user: null };

        // Store the initial data in localStorage
        localStorage.setItem('authData', JSON.stringify(initialAuthData));

        // Set the initial data in the state
        setAuthData(initialAuthData);
      }
    } catch (error) {
      // Handle any JSON parsing errors here
      console.error('Error parsing authentication data from localStorage:', error);
      // You might want to set some default data or take other action here
    }
  }, []);

  // Function to update the authentication data
  const updateAuthData = (newAuthData) => {
    // Store the updated authentication data in localStorage
    localStorage.setItem('authData', JSON.stringify(newAuthData));
    
    // console.log("New updateauth", newAuthData)

    // Update the state with the new authentication data
    setAuthData(newAuthData);
  };

  // Function to retrieve authentication data
  const getAuthData = () => {
    try {
      // Attempt to retrieve and parse authentication data from localStorage
      const currentAuthData = localStorage.getItem("authData");
      return JSON.parse(currentAuthData);
    } catch (error) {
      // Handle any JSON parsing errors here
      console.error('Error parsing authentication data from localStorage:', error);
      return null; // Or handle the error as appropriate for your application
    }
  }

  // Function to log out and clear authentication data
  const logout = () => {
    // Clear authentication data from localStorage and set it to null
    localStorage.removeItem('authData');
    setAuthData(null);
  };

  return (
    // Provide the authentication context with data and functions to children components
    <AuthContext.Provider value={{ authData, updateAuthData, logout, getAuthData}}>
      {children}
    </AuthContext.Provider>
  );
};

