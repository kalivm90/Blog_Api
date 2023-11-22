import ViewProfile from "../profile/ViewProfile";

const profileRouter = [
    {
        path: "/profile/:userId/view",
        element: <ViewProfile/> 
    }, 
]

export default profileRouter;