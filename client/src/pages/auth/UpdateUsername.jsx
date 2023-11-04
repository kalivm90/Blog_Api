import { useEffect } from "react";
import {useNavigate} from "react-router-dom";

import fetchApi from "../../util/fetchApi";
import {useAuth} from "../../context/AuthContext";

import AuthForm from "@components/authForm";
import Layout from "@components/layout";


const UpdateUsername = () => {

    const redirect = useNavigate();

    const {authData, logout} = useAuth();

    useEffect(() => {
        const res = async () => {
            const url = import.meta.env.VITE_SERVER_AUTH + "/updateUsername";
            const response = await fetchApi(url, "GET");

            if (!response?.success) {
                redirect("/auth/login?error=updateUsername: You must be logged in to go there");
            } else {
                console.log("Verfcation complete you can now change username")
            }
        }

        res()
    }, [authData]);

    return (    
        <Layout>
            <AuthForm 
                url={import.meta.env.VITE_SERVER_DOMAIN + "/auth/updateUsername"} 
                title="username" 
                fields={["username", "blogOwner"]}
                method="PUT"
                className="updateUsername"
            />
        </Layout>
    )
}

export default UpdateUsername;