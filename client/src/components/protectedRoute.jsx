import { useEffect, useState } from "react"
import {useAuth} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {checkValidTokenExpiration} from "../util/helpers";


const ProtectedRoute = ({children}) => {

    const {logout, getAuthData} = useAuth();
    const [authorized, setAuthorized] = useState(false);
    const redirect = useNavigate();

    useEffect(() => {
        const validate = getAuthData();

        if (validate?.isAuthenticated) {

            const isTokenExpired = checkValidTokenExpiration(validate.timeOfExp);

            if (!isTokenExpired) {
                console.log("TOKEN IS NOT GOOD, REDIRECT")
                logout();
                redirect("/auth/login?error=Token expired, please login.")
            } else {
                setAuthorized(true);
            }

        } else {
            logout();
            redirect("/auth/login?error=You must be logged in to go there.")
        }

    }, [])

    return (
        <>
            {authorized && (
                <>{children}</>
            )}
        </>
    )
}

export default ProtectedRoute;