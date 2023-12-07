import { useEffect, useState } from "react";
import fetchApi from "../../util/fetchApi.js"; 
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css" 

import Layout from "@components/layout";
import PostCard from "@components/postCard.jsx";
import "@styles/pages/Dashboard.scss";

// test

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import PostCardSkeleton from "../../components/postCardSkeleton.jsx";

// NEED TO ADD LOGOUT TO DELETE LOCAL STORAGE IF AUTH FAILS

const Dashboard = () => {
    const redirect = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {logout, getAuthData} = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [posts, setPosts] = useState({});

    const authInfo = getAuthData();


    const fetchPosts = async (page) => {
        const url = `${import.meta.env.VITE_API_PATH}/posts?page=${page}`

        const response = await fetchApi(url, "GET");

        if (response.res.ok) {
            setPosts(response.payload.posts);

            setTotalPages(response.payload.totalPages);

         } else if (response.res.status === 401) {
             logout();
             redirect(`/auth/login?error=/dashboard: ${response?.payload?.error || "Something went wrong."}`);
         }

         setIsLoading(false);

         console.log(response);
    };

    // handles change for pagination component 
    const handleChange = (event, value) => {
        setCurrentPage(value);
        redirect(`/blog/dashboard?page=${value}`);
    };

    useEffect(() => {
        // fetchPosts(currentPage);
        setTimeout(() => {
            fetchPosts(currentPage);
        }, 1000)
    }, [currentPage])


    useEffect(() => {
        const handlePopstate = () => {
          const urlSearchParams = new URLSearchParams(window.location.search);
          const pageParam = urlSearchParams.get("page");
          const parsedPage = parseInt(pageParam, 10);
    
          if (!isNaN(parsedPage)) {
            setCurrentPage(parsedPage);
          }
        };
    
        window.addEventListener("popstate", handlePopstate);
    
        return () => {
          window.removeEventListener("popstate", handlePopstate);
        };
      }, []);



    return (
        <Layout protectedRoute={true}>
            {isLoading ? (
                <div className="Dashboard loading">
                    {/* <h2>Getting posts...</h2> */}
                        <div className="dashboard-container">

                            <header className="skeleton-header">
                                <div className="skeleton-title">
                                    <Skeleton width="40%" height={40}></Skeleton>
                                    <Skeleton width="70%" height={30}></Skeleton>
                                </div>
                                <span className="skeleton-button">
                                    <Skeleton width={100} height={40}></Skeleton>
                                </span>                    
                            </header>
                                
                            <hr />
                            <div className="dash-content">
                                {Array.from({length: 4}, (_, index) => (
                                    <PostCardSkeleton/>
                                ))}
                            </div>
                        </div>
                </div>
            ) : (
                <div className="Dashboard">

                    {/* main section */}
                    <div className="dashboard-container">

                        <header>

                            <div className="dash-title">
                                <h2>Welcome {authInfo.user.username}</h2>
                                <p>
                                    Here you can review your posts and profile.
                                </p>
                            </div>
                            <button onClick={() => window.location = "/blog/createMessage"}>Create Post</button>

                        </header>
                        <hr />
                        <div className="dash-content">
                            {posts.length === 0 ? (
                                <div className="no-posts">
                                    <h2>No posts at the moment, feel free to create one!</h2>
                                </div>
                            ) : (
                                <div className="post-container">
                                    {posts.map(post => {
                                        return (
                                            <PostCard
                                                // not a prop but a react key for id 
                                                key={post._id}
                                                post={post}
                                                authData={authInfo}
                                            ></PostCard>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    

                    <div className="pagination-wrapper">
                        <Typography>Page: {currentPage}</Typography>
                        <Stack spacing={2}>
                            <Pagination 
                                count={totalPages} 
                                color="primary" 
                                page={currentPage}
                                onChange={handleChange}
                            />
                        </Stack>
                    </div>

                </div>
            )}
        </Layout>
    )
}

export default Dashboard;
