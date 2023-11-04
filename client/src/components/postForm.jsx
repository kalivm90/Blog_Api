// 

import { useRef, useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import fetchApi from "@util/fetchApi";

import {useAuth} from "../context/AuthContext";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import DOMPurify from 'dompurify';

import Editor from "./quill/quillEditor";
import "@styles/components/postForm.scss";


const PostForm = ({title, message, url}) => {
    // get request is sent at component render to make sure user has auth
    // NOT SURE WHETHER TO USE THIS OR USEAUTH CONTEXT
    const [userResponse, setUserResponse] = useState({});
    const {authData, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // for updating posts
    const [post, setPost] = useState(null);

    const navigate = useNavigate();

    const validationSchema = yup.object().shape({
        title: yup.string().required(),
        body: yup.string().required()
    })

    const {
        register,
        watch,
        handleSubmit,
        formState: {errors, isValid}, setError, clearErrors, getValues, reset, setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onTouched"
    })

    const formSubmit = async () => { 
        const url = import.meta.env.VITE_API_PATH + "/posts/createPost";
        // adding users id to the fields as author
        const fields = { ...getValues(), author: authData.id};

        // addded this to sanitize any html being sent to the server
        fields.body = DOMPurify.sanitize(fields.body);

        console.log("BODY SENT", fields.body);

        const response = await fetchApi(url, "POST", fields);

        if (response?.success) {
            navigate(`/blog/dashboard?message=${response.message}`);
        } else {
            logout();
            navigate(`/auth/login?error=${response.error}`)
            console.log("ERROR", response);
        }
    }

    // send request on component mount to make sure user is verified
    // useEffect(() => {
        // const getAuth = async () => {
        //     const url = import.meta.env.VITE_API_PATH + "/posts/createPost";
        //     const response = await fetchApi(url, "GET");

        //     if (response?.success) {
        //         setUserResponse(response.user);
        //     } else {
        //         logout();
        //         navigate(`/auth/login?error=${response.message}`);
        //     }
        // }

    //     getAuth();
    // }, [])

    const validateUser = async () => {
        const auth = await authData;

        if (!auth?.id) {
            logout();
            navigate("/auth/login?error=You are not signed in")
        }            

        return true;
    }

    useEffect(() => {
        const getAuth = async () => {
            const verify = await validateUser();

            if (verify) {
                let newUrl = import.meta.env.VITE_API_PATH + url;

                const response = await fetchApi(newUrl, "GET");

                if (response?.success && response?.post) {
                    setPost(response.post)
                } else if (!response?.success) {
                    console.log(response)
                    logout();
                    navigate(`/auth/login?error=${response?.erorr}`);
                }   
            } else {
                console.log("Post Form, verified failed")
            }

            setIsLoading(false);
        }

        if (authData !== null) {
            getAuth();
        }

    }, [authData]);

    return (
        <div className="postForm">
            {!isLoading ? (
                <div className="content">
                    <form onSubmit={handleSubmit(formSubmit)}>
                        <div className="form-title">
                            <div>   
                                <h2>{title}</h2>
                                <p>{message}</p>
                            </div>
                            <hr></hr>
                        </div>
    
                        <div className="field-wrapper">
                            <div className="form-field">
                                <label htmlFor="title" id="title">Title</label>
                                <input type="text" name="title" {...register("title")} value={post !== null ? post.title : ""}/>
                            </div>
                            {errors.title && <p className="form-error">{errors.title.message}</p>}
                        </div>
                        <div className="field-wrapper">
                            {/* <Editor value={watch("body")} onChange={(value) => setValue("body", value)}/> */}

                            {/* If resonse from get has post attached it will be supplied to the editor as the value to start with*/}

                            <Editor value={watch("body")} onChange={(value) => setValue("body", value)} defaultValue={post !== null ? post.body : ""}/>
                            {errors.body && <p className="form-error">{errors.body.message}</p>}
                        </div>    
                        <div className="form-actions">
                            <button>Create Post</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="postForm" style={{height: "100vh", paddingLeft: "50px"}}>
                    <h2>Checking Credentials...</h2>
                </div>
            )}
        </div>
    )
}

export default PostForm;


        // <div className="postForm">
        //     <div className="content">
        //         <form onSubmit={handleSubmit(formSubmit)}>
        //             <div className="form-title">
        //                 <div>   
        //                     <h2>{title}</h2>
        //                     <p>{message}</p>
        //                 </div>
        //                 <hr></hr>
        //             </div>

        //             <div className="field-wrapper">
        //                 <div className="form-field">
        //                     <label htmlFor="title" id="title">Title</label>
        //                     <input type="text" name="title" {...register("title")}/>
        //                 </div>
        //                 {errors.title && <p className="form-error">{errors.title.message}</p>}
        //             </div>
        //             <div className="field-wrapper">
        //                 <Editor value={watch("body")} onChange={(value) => setValue("body", value)}/>
        //                 {errors.body && <p className="form-error">{errors.body.message}</p>}
        //             </div>
        //             {/* Dont technically need this here but it makes it clearer that authData.id is being sent as well */}
        //             {/* <input name="author" type="hidden" value={authData.id}></input> */}

        //             <div className="form-actions">
        //                 <button>Create Post</button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
