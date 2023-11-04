import Login from './Login';
import Register from "./Register";
import UpdateUsername from './UpdateUsername';

// test 
import GoogleCallback from './GoogleCallback';

const authRouter = [
    {
        path: "auth/login",
        element: <Login/> 
    }, 
    {
        path: "auth/register",
        element: <Register/>
    },
    {
        path: "auth/updateUsername", 
        element: <UpdateUsername/>
    }, 
    // TEST
    {   
        path: "auth/googleCallback",
        element: <GoogleCallback/>
    }
]

export default authRouter;