import Navbar from "./navbar"
import Flash from "./flash";
import Footer from "./footer";
import { useEffect, useState } from "react";

import ProtectedRoute from "./protectedRoute";

const Layout = ({children, protectedRoute=false}) => {

    // handles flash for messages and errors
    const [errorParam, setErrorParam] = useState(null);
    const [messageParam, setMessageParam] = useState(null);
    
    const url = new URL(window.location.href);

    useEffect(() => {
        setErrorParam(url.searchParams.get("error"));
        setMessageParam(url.searchParams.get("message"));
    }, [url])


    return (
        <main>
            <Navbar/>

            {/* Flash */}
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