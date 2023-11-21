import AuthForm from "@components/authForm";
import Layout from "@components/layout";


const UpdateUsername = () => {

    return (    
        <Layout protectedRoute={true}>
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