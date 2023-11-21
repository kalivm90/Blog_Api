import { useParams } from 'react-router-dom';
import Layout from "@components/layout";
import PostForm from '../../components/postForm';

// alter post form component to also update post

const UpdatePost = () => {
    const {postId} = useParams();

    return (
        <Layout protectedRoute={true}>
            <PostForm
                type="Update"
                message="need to make some changes?"
                url={`/posts/${postId}/update`}
            />
        </Layout>
    )
}

export default UpdatePost;