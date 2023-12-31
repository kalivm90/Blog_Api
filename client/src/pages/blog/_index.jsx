import Dashboard from './Dashboard';
import CreatePost from './CreatePost';
import UpdatePost from './UpdatePost';
import ViewPost from './ViewPost';

const blogRouter = [
    {
        // all posts can be viewed here
        path: "/blog/dashboard",
        element: <Dashboard/> 
    }, 
    {
        path: "/blog/:postId/view",
        element: <ViewPost/>
    },
    {
        path: "/blog/createMessage", 
        element: <CreatePost/>
    },
    {
        path: "/blog/:postId/update",
        element: <UpdatePost/>
    },
]

export default blogRouter;