import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {useAuth} from "../../context/AuthContext.jsx";
import fetchApi from "../../util/fetchApi.js"; 

import Layout from "@components/layout";
import {getDateOfExpiration} from "../../util/helpers.js";


/* 
    This route finishes the process of the Google OAuth process by checking the server to make sure everything was handled correctly
*/

const GoogleCallback = () => {
    const {updateAuthData, getAuthData} = useAuth();
    const redirect = useNavigate();

    useEffect(() => {
        const res = async () => {
            const url = import.meta.env.VITE_SERVER_AUTH + "/verifyGoogleUser";

            // Simulate a short delay for better user experience
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await fetchApi(url, "GET");

            if (response.res.ok && response.payload.success) {
                const estimatedExpiration = getDateOfExpiration(response.payload.tokenExp);

                const authObj = {
                    isAuthenticated: true,
                    user: response.payload.authData.userPayload,
                    timeOfExp: estimatedExpiration,
                }

                updateAuthData(authObj);
                redirect("/blog/dashboard?page=1");
            } else {
                redirect(`/auth/login/error=/googleCallback: ${response?.payload?.error}`)
                console.log("Debug: GoogleCallback at route /auth/googleCallback")
            }
        }
    

        res();
    }, []);

    return (
        <Layout>
            <div className="googleCallback" style={{height: "100vh", padding: "4em"}}>
                <h2>Verifying with Google...</h2>
            </div>
        </Layout>
    )
}

export default GoogleCallback;