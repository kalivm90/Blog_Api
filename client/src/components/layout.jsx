import { useEffect, useState } from "react";
// Components
import Navbar from "./navbar"
import Flash from "./flash";
import Footer from "./footer";
import ProtectedRoute from "./protectedRoute";


const Layout = ({children, protectedRoute=false}) => {

    // handles flash for messages and errors
    const [errorParam, setErrorParam] = useState(null);
    const [messageParam, setMessageParam] = useState(null);
    
    const url = new URL(window.location.href);

    // Look for parameters on page load
    useEffect(() => {
        setErrorParam(url.searchParams.get("error"));
        setMessageParam(url.searchParams.get("message"));
    }, [url])


    // Looks for search parameters when user navigates to a page already visited to prevent flash message from re-rendering
    useEffect(() => {
      const handlePopstate = window.onpopstate = (event) => {
        // Array of key terms to watch
        const flashKeys = ["error", "message"];
        // URL parameter keys
        const urlKeys = url.searchParams.keys();

        // Loop through keys and delete them if they are included in the array of flash keys
        for (const key of urlKeys) {
            if (flashKeys.includes(key)) {
                console.log(`Removed URL parameter "${key}" after detecting back button press`);
                url.searchParams.delete(key);
            }
        }

        /// Update URL  
        window.history.replaceState({}, '', url.toString()); 

      };
      
      return () => {
        handlePopstate(); 
      };

    }, []);



    return (
        <main>

            <Navbar/>

            {/* Renders flash if keywords are parameters in the URL */}
            {errorParam || messageParam ? <Flash error={errorParam} message={messageParam}/> : null}

            {/* Handles Protected Routes */}
            {protectedRoute ? (
                <ProtectedRoute>{children}</ProtectedRoute>
            ) : (
                <>{children}</>
            )}

            <Footer/>

        </main>
    )
}


export default Layout