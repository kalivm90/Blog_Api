import Google from "@images/google-icon.png";
import "@styles/components/googleLoginButton.scss"
import { useState, useRef, useEffect } from "react";

const GoogleLoginButton = ({text}) => {
    const [buttonWidth, setButtonWidth] = useState(null);
    const buttonRef = useRef(null);

    const handleGoogleLogin = () => {
        // Construct the URL for Google OAuth authorization endpoint
        const googleAuthUrl = process.env.VITE_SERVER_AUTH + "/google";
    
        // Initiate the Google OAuth flow
            // In a new tab
        // window.open(googleAuthUrl, "_blank");

        // In the same tab 
        window.location.href = googleAuthUrl;
    };



    useEffect(() => {
        const calculateButtonWidth = () => {
            if (buttonRef.current) {
              const width = buttonRef.current.offsetWidth;
              setButtonWidth(width);
            }
        };
      
        calculateButtonWidth();

        window.addEventListener("resize", calculateButtonWidth);
    
        return () => {
            window.removeEventListener("resize", calculateButtonWidth);
        };
    }, []);

    const buttonStyle = {
        '--btn-width': `${buttonWidth}px`
    };

    return (
        <button 
            id="googleLogin" 
            onClick={handleGoogleLogin}
            ref={buttonRef}
            style={buttonStyle}
            type="button"
        >
            <img src={Google} alt="Google Image"></img>
            <span>{text} with Google</span>
        </button>
    )
}

export default GoogleLoginButton;