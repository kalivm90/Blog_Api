import { useEffect, useState } from "react";
import fetchApi from "../../util/fetchApi.js"; 
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css" 

import Layout from "@components/layout";
import PostCard from "@components/postCard.jsx";
import "@styles/pages/Dashboard.scss";
 
// NEED TO ADD LOGOUT TO DELETE LOCAL STORAGE IF AUTH FAILS

const Dashboard = () => {
    const redirect = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {authData, updateAuthData, logout, getAuthData} = useAuth();

    const [posts, setPosts] = useState({});

    useEffect(() => {
        const req = async () => {
            const url = import.meta.env.VITE_API_PATH + "/posts";

            const response = await fetchApi(url, "GET");

            if (response?.success) {
                setPosts(response.posts);
            } else {
                // when the auth fails the storage gets cleared in order to keep the data fresh
                logout();
                redirect(`/auth/login?error=${response.error || response.message}`);
            }

            setIsLoading(false);
        }
        req();

    //     // articial load time to test skeleton
    //     // setTimeout(() => {
    //     //     req();
    //     // }, 1000)
    }, [])


    return (
        <Layout protectedRoute={true}>
            {isLoading ? (
                <div className="Blog Dashboard loading">
                    <h2>Getting posts...</h2>
                </div>
            ) : (
                <div className="Blog Dashboard">

                    {/* main section */}
                    <div className="dashboard-container">

                        <header>

                            <div className="dash-title">
                                <h2>Welcome {authData.username}</h2>
                                <p>
                                    Here you can review your posts and profile.
                                </p>
                            </div>
                            <button onClick={() => window.location = "/blog/createMessage"}>Create Post</button>

                        </header>
                        <hr />
                        <div className="dash-content">
                            {posts === null ? (
                                <p>No posts at the moment...</p>
                            ) : (
                                <div className="post-container">
                                    {posts.map(post => {
                                        return (
                                            <PostCard
                                                // not a prop but a react key for id 
                                                key={post._id}
                                                post={post}
                                                authData={authData}
                                            ></PostCard>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    

                </div>
            )}
            {/* <div className="Dashboard">
                {isLoading ? (
                    <h2>Checking Authorization...</h2>
                ) : (
                    <h3>Dashboard TODO</h3>
                )}
            </div> */}
        </Layout>
    )
}

export default Dashboard;