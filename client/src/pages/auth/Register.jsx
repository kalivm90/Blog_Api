import Layout from "@components/layout";
import AuthForm from "@components/authForm";

const Register = () => {
    return (
        <Layout>
            <AuthForm 
                url={import.meta.env.VITE_SERVER_DOMAIN + "/auth/register"} 
                title="Register" 
                fields={["firstName", "lastName", "email", "username", "blogOwner", "password", "confirmPassword"]}
                className="Register"
            />
        </Layout>
    )
}

export default Register;
