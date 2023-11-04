// this route is sending 2 get requests, WHY??? React.StrictMode redners the page twice in a development env.
// Comment it out in main.jsx to stop it from making multiple requests

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import fetchApi from "../../util/fetchApi.js";
import {useAuth} from "../../context/AuthContext.jsx"

import Layout from "@components/layout";
import "@styles/pages/ViewPost.scss";
import { HandThumbsUp, HandThumbsUpFill, Share, Trash3, ArrowUpCircle } from "react-bootstrap-icons";


const ViewPost = () => {
    const {postId} = useParams();
    const {authData, logout} = useAuth();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const redirect = useNavigate();
    const iconSize = 25;

    const [clicked, setClicked] = useState(false); 
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(null);


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
        setLikeCount(response?.likesTotal);

        console.log("Debug-ViewPost:", response);
    };

    useEffect(() => {
        // Get request for post with id
        const res = async () => {
            const url = import.meta.env.VITE_API_PATH + `/posts/${postId}`;
            const response = await fetchApi(url, "GET");
        
            console.log(response);

            if (response?.success && response?.post) {
                setPost(response?.post);
                setIsLiked(response?.liked)
                setLikeCount(response?.post.likes.number);
            } else if (response?.success && !response?.post) {
                redirect(`/blog/dashboard?error=${response?.error || 'Something went wrong.'}`)
            } else {
                logout();
                redirect(`/auth/login?error=${response?.error || 'Something went wrong.'}`)
            }
            

            setIsLoading(false);
        }

        res();
    }, [])

    return (
        <Layout>
            {isLoading ? (
                <div className="ViewPost">
                    <h2>Getting post...</h2>
                </div>
            ) : (
                <div className="ViewPost">
                    <h2>{post.title}</h2>

                    <section className="content">
                        <div className="topbar">
                            <p>Posted by: {post.author.username}</p>
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
                            {post.author._id === authData.id && (
                                <>
                                    <div className="update" onClick={() => {window.location.href = `/blog/${postId}/update`}}>
                                        <ArrowUpCircle size={iconSize}/>
                                        <p>Update</p>
                                    </div>
                                    <div className='delete'>
                                        <Trash3 size={iconSize}/>
                                        <p>Delete</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <a href="/blog/dashboard">&#x2190; Back to Dashboard</a>
                </div>
            )}
        </Layout>
    )
}

                        // <div className="card-content" onClick={() => redirect(`/blog/${postId}/view`)}>
                        //     <div className="card-container-left">
                        //         <div className="card-title">
                        //             <p>{post.author.username}</p>
                        //             {/* LINK PROFILE HREF FROM MONGO METHOD */}
                        //             <p>{post.timestamp_format}</p>
                        //         </div>
                        //         <div className="card-body">
                        //             {/* Add body to post detail */}
                        //             <h2>{post.title} hello nice veru jkaefbn awkwjfdba aljwdfsnsc</h2>
                        //         </div>
                        //     </div>

                        //     <div className="card-container-right">
                        //         <div className="body" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.body)}}>
                                
                        //         </div>
                        //     </div>
                        // </div>

                        // <div className="card-action">
                        //     <div className="comments">
                        //         <ChatRight size={20}/>
                        //         <p>Comments</p>
                        //     </div>
                        //     <div className="share">
                        //         <Share/>
                        //         <p>Share</p>
                        //     </div>
                        //     <div className="likes">
                        //         <HandThumbsUp size={20}/>
                        //         <p>Likes</p>
                        //     </div>
                        // </div>


export default ViewPost;