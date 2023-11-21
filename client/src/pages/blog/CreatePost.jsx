import Layout from "@components/layout";
import PostForm from "../../components/postForm";

// FINISH CONTROLLER

const CreatePost = () => {

    return (
        <Layout protectedRoute={true}>
            <PostForm 
                type="Create"
                title="Create Post"
                message="Create a new Blog post!"
                url="/posts/createPost"
            />
        </Layout>
    )
}

export default CreatePost;
