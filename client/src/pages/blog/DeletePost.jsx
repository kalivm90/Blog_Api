import { useParams } from 'react-router-dom';
import Layout from "@components/layout";

const DeletePost = () => {
    const {postId} = useParams();

    return (
        <Layout>
            <div className="deletePost">
                <p>Delete post TODO with Id: {postId}</p>
            </div>
        </Layout>
    )
}

export default DeletePost;