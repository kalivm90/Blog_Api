import Navbar from "./navbar"
import Flash from "./flash";
import Footer from "./footer";
import { useEffect, useState } from "react";
import {useAuth} from "../context/AuthContext";

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


    // // TEST for handling auth of protected routes
    // const {logout, getAuthData} = useAuth();
    // const [authorized, setAuthorized] = useState(false);

    // useEffect(() => {
    //     if (protectedRoute) {
    //         const validate = getAuthData();

    //         if (validate?.user) {
    //             setAuthorized(true);
    //         } else {
    //             console.log("NOT");
    //         }

    //     } else {
    //         setAuthorized(true);
    //     }
    // })
    

    return (
        <main>
            <Navbar/>
            {errorParam ? <Flash error={errorParam} /> : null}
            {messageParam ? <Flash message={messageParam} /> : null}
            {/* {children} */}

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