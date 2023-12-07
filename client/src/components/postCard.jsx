// create view post page 
import "@styles/components/postCard.scss";
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { ChatRight, HandThumbsUp, HandThumbsUpFill, Share } from "react-bootstrap-icons";
import DOMPurify from 'dompurify';
import fetchApi from "../util/fetchApi";

const PostCard = ({post, authData}) => {

    const [postId, setPostId] = useState(null);
    const sanitizedHTML = DOMPurify.sanitize(post.body);
    const redirect = useNavigate();

    const iconSize = 20;

    const [isLiked, setIsLiked] = useState(false);
    const [clicked, setClicked] = useState(false);

    const handleImageClick = async () => {
        setIsLiked(!isLiked);
        setClicked(!clicked);

        let url; 
        // since isLiked does not update right away you need to use the inverse of the likes value
        if (!isLiked) { // this in essence is liked == true but the value will not have updated yet
            url = import.meta.env.VITE_API_PATH + `/posts/${postId}/like`;
        } else {
            url = import.meta.env.VITE_API_PATH + `/posts/${postId}/dislike`;
        }

        // MAY NEED TO DO SOME ERROR CHECKING HERE
        const response = await fetchApi(url, "POST");

        console.log("Debug-postCard:", response);
    };


    useState(() => {
        setPostId(post._id);
        setIsLiked(post?.likedByUser)
    }, [])


    return (
        <div id={postId} className={`post-card`}>

            <div className="card-content" onClick={() => redirect(`/blog/${postId}/view`)}>
                <div className="card-container-left">
                    <div className="card-head">

                        {authData.user.username === post.author.username ? (
                            <p id="same-username" className="username">
                                {post.author.username} 
                                <span id="white">(self)</span>
                            </p>
                        ) : (
                            <p id="dif-username">
                                {post.author.username}
                            </p>
                        )}

                        {/* LINK PROFILE HREF FROM MONGO METHOD */}
                        <p className="timestamp">{post.timestamp_format}</p>
                    </div>
                    <div className="card-title">
                        {/* Add body to post detail */}
                        <h2>{post.title}</h2>
                        <hr/>
                    </div>
                </div>

                <div className="card-container-right">
                    <div className="body" dangerouslySetInnerHTML={{__html: sanitizedHTML}}>
                    
                    </div>
                </div>
            </div>

            <div className="card-action">
                <div className="likes" onClick={handleImageClick}>
                    {/* <HandThumbsUp size={iconSize}/> */}
                    {isLiked ? (
                        <HandThumbsUpFill size={iconSize} className='likeAnimate'/>
                    ) : (
                        <HandThumbsUp size={iconSize} className='likeAnimate'/>
                    )}
                    <p>Likes</p>
                </div>
                <div className="comments">
                    <ChatRight size={iconSize}/>
                    <p>Comments</p>
                </div>
                <div className="share">
                    <Share/>
                    <p>Share</p>
                </div>
            </div>
        </div>
    )
}

export default PostCard;