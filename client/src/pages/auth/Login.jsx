import Layout from "@components/layout";
import AuthForm from "@components/authForm";

const Login = () => {

    return (
        <Layout>
            <AuthForm 
                url={import.meta.env.VITE_SERVER_DOMAIN + "/auth/login"} 
                title="Login" 
                fields={["username", "password"]}
                className="Login"
            />
        </Layout>
    )
}

export default Login;
