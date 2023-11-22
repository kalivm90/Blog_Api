import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../context/AuthContext";
import Image from "@images/api.png";
import "@styles/components/navbar.scss";

const Navbar = () => {

    const {getAuthData, logout} = useAuth();
    const authData = getAuthData();

    const navigate = useNavigate();

    const handleLogout = () => {
        // Some pages automatically set authData on load, so you have to navigate back to home  
        navigate("/");
        logout();
    }


    return (
        <nav>
            <div className="title">
                <h2>Blog</h2>
                <img src={Image} alt="Api image"></img>
            </div>
            {authData?.isAuthenticated ? (
                <div className="links auth">
                    <Link to="/">Home</Link>
                    <Link to="/blog/dashboard?page=1">Dashboard</Link>
                    <Link to={`/profile/${authData?.user.id}/view`}>Profile</Link>
                    <a href="#" onClick={handleLogout}>Logout</a>  
                </div>
            ) : (
                <div className="links">
                    <Link to="/">Home</Link>
                    <Link to="/auth/register">Register</Link>
                    <Link to="/auth/login">Login</Link>  
                </div>
            )}

        </nav>
    )
}

export default Navbar;