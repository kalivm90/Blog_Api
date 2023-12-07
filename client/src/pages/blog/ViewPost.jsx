// this route is sending 2 get requests, WHY??? React.StrictMode redners the page twice in a development env.
// Comment it out in main.jsx to stop it from making multiple requests

import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import DOMPurify from 'dompurify';

import fetchApi from "../../util/fetchApi.js";
import {useAuth} from "../../context/AuthContext.jsx"

import Layout from "@components/layout";
import Modal from '@components/modal.jsx';
import "@styles/pages/ViewPost.scss";
import { HandThumbsUp, HandThumbsUpFill, Share, Trash3, ArrowUpCircle } from "react-bootstrap-icons";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ViewPost = () => {
    const {postId} = useParams();
    const {getAuthData, logout} = useAuth();

    const authData = getAuthData();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const redirect = useNavigate();
    const iconSize = 25;

    const [clicked, setClicked] = useState(false); 
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(null);

    
    const [showModal, setShowModal] = useState(false);

    // this is this onClose prop for the Modal component
    const handleClosePrompt = () => setShowModal(false);

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

        const response = await fetchApi(url, "POST");

        // MAY NEED TO DO SOME ERROR CHECKING HERE
        setLikeCount(response?.payload.likesTotal);

        console.log("Debug-ViewPost:", response.payload);
    };

    useEffect(() => {
        // Get request for post with id
        const res = async () => {
            const url = import.meta.env.VITE_API_PATH + `/posts/${postId}`;
            const response = await fetchApi(url, "GET");
        

            if (response.res.ok) {
                setPost(response?.payload?.post);
                setIsLiked(response?.payload?.liked)
                setLikeCount(response?.payload?.post.likes.number);
            } else if (response.res.status === 404) {
                // No Post Found, Redirect back to Dashboard with flash error
                redirect(`/blog/dashboard?page=1&error=/viewPost: ${response.payload.error}`)
            } else if (response.res.status === 401) {
                // redirect to auth/login
                logout()
                redirect(`/auth/login?error=/viewPost: ${response.payload.error}`)

            }
            

            setIsLoading(false);
        }

        // res();

        setTimeout(() => {
            res();
        }, 1000)
    }, [])


    return (
        <Layout protectedRoute={true}>
            {isLoading ? (
                <div className="ViewPost">
                    {/* <h2>Getting post...</h2> */}
                    <h2>
                        <Skeleton width="50%" height={35}/>
                    </h2>
                    <section className='content skeleton'>

                        <div className="topbar">
                            <div className="username">
                                <p>Posted by: </p>
                                <Skeleton width={100} height={20}/>
                            </div>
                            <p>Time: <Skeleton width={100} height={20}/></p>
                        </div>

                        <div className="body skeleton">
                            <Skeleton width="100%" height={200}/>
                        </div>

                        <div className="card-action">
                            <div className="likes" onClick={handleImageClick}>
                                <HandThumbsUp size={iconSize} className='likeAnimate'/>
                                <p>Likes: <Skeleton width={50} height="100%"/></p>
                            </div>
                            <div className="share">
                                <Share size={iconSize}/>
                                <p>Share</p>
                            </div>
                        </div>

                    </section>
                    <a href="/blog/dashboard?page=1">&#x2190; Back to Dashboard</a>
                </div>
            ) : (
                <div className="ViewPost">
                    <h2>{post.title}</h2>

                    {showModal && authData.user.username === post.author.username && (
                        <Modal 
                            title="Are you sure you want to delete this post?"
                            url={`/posts/${postId}/delete`}
                            post={post}
                            onClose={handleClosePrompt}
                        />
                    )}

                    <section className="content">
                        <div className="topbar">

                            <div className="username">
                                <p>Posted by: </p>
                                {authData.user.username === post.author.username ? (
                                    <p id="same-username">
                                        {post.author.username}  
                                        <span id="white"> (self)</span>
                                    </p>
                                ) : (
                                    <p id="dif-username">
                                        {post.author.username}
                                    </p>
                                )}
                            </div>

                            {/* <p>Posted by: {post.author.username}</p> */}
                            
                            <p>Time: {post.timestamp_format}</p>
                        </div>

                        <div className="body" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.body)}}></div>

                        <div className="card-action">
                            <div className="likes" onClick={handleImageClick}>
                                {isLiked ? (
                                    <HandThumbsUpFill size={iconSize} className='likeAnimate'/>
                                ) : (
                                    <HandThumbsUp size={iconSize} className='likeAnimate'/>
                                )}
                                <p>Likes: {likeCount}</p>
                            </div>
                            <div className="share">
                                <Share size={iconSize}/>
                                <p>Share</p>
                            </div>
                            {post.author._id === authData.user.id && (
                                <>
                                    <div className="update" onClick={() => {window.location.href = `/blog/${postId}/update`}}>
                                        <ArrowUpCircle size={iconSize}/>
                                        <p>Update</p>
                                    </div>


                                    <div className='delete' onClick={() => setShowModal(!showModal)}>
                                        <Trash3 size={iconSize}/>
                                        <p>Delete</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <a href="/blog/dashboard?page=1">&#x2190; Back to Dashboard</a>
                </div>
            )}
        </Layout>
    )
}



export default ViewPost;