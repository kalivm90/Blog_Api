import { useParams } from 'react-router-dom';
import Layout from "@components/layout";
import PostForm from '../../components/postForm';

// alter post form component to also update post

const UpdatePost = () => {
    const {postId} = useParams();

    return (
        <Layout>
            <PostForm
                title="Update Post"
                message="need to make some changes?"
                url={`/posts/${postId}/update`}
            />
            {/* <div className="UpdatePost">
                <p>Update post TODO with Id: {postId}</p>
            </div> */}
        </Layout>
    )
}

export default UpdatePost;