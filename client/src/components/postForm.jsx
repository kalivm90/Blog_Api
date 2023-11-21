// 

import { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import fetchApi from "@util/fetchApi";

import {useAuth} from "../context/AuthContext";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import DOMPurify from 'dompurify';

import Editor from "./quill/quillEditor";
import "@styles/components/postForm.scss";


const PostForm = ({type, message, url}) => {
    const {logout, getAuthData} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // for updating posts
    const [post, setPost] = useState(null);

    const auth = getAuthData();

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
        const newurl = import.meta.env.VITE_API_PATH + url;

        // adding users id to the fields as author
        const fields = { ...getValues(), author: auth.user.id};

        // addded this to sanitize any html being sent to the server
        fields.body = DOMPurify.sanitize(fields.body);

        const method = type === "Create" ? "POST" : "PUT";

        const response = await fetchApi(newurl, method, fields);

        if (response.res.ok) {
            navigate(`/blog/dashboard?page=1&message=${response?.payload.message}`);
        } else if (response.res.status === 400) {
            console.log("postForm: Error in fields");
        } else {
            logout();
            navigate(`/blog/dashboard?page=1&error=postForm: ${response?.payload.error}`);
        }
        // if (response?.success) {
        //     navigate(`/blog/dashboard?message=${response.message}`);
        // } else {
            
        //     // logout();
        //     // navigate(`/auth/login?error=${response.error}`)
        //     console.log("ERROR", response);
        // }
    }


    useEffect(() => {
        const getPostFields = async () => {
            const newurl = import.meta.env.VITE_API_PATH + url;

            const response = await fetchApi(newurl, "GET");

            if (response?.res.ok) {
                setPost(response?.payload.post);
            } else if (response?.res.status === 404) {
                navigate(`/blog/dashboard?page=1&error=postForm: ${response?.payload.error}`)
            } else {
                navigate(`/auth/login?error=postForm: ${response?.payload.error}`)
            }

            setIsLoading(false);
        }

        if (type === "Update") {
            getPostFields();
        } else {
            setIsLoading(false);
        }

    }, [])

    
    return (
        <div className="postForm">
            {!isLoading ? (
                <div className="content">
                    <form onSubmit={handleSubmit(formSubmit)}>
                        <div className="form-title">
                            <div>   
                                <h2>{type} post</h2>
                                <p>{message}</p>
                            </div>
                            <hr></hr>
                        </div>
    
                        <div className="field-wrapper">

                            <div className="form-field">
                                <label htmlFor="title" id="title">Title</label>
                                {/* <input type="text" name="title" {...register("title")} value={post !== null ? post.title : ""}/> */}
                                <input
                                    type="text"
                                    name="title"
                                    {...register("title")}
                                    value={post !== null ? post.title : ""}
                                    onChange={(e) => {
                                        setPost({ ...post, title: e.target.value });
                                    }}
                                />
                            </div>
                            
                            {errors.title && <p className="form-error">{errors.title.message}</p>}

                        </div>

                        <div className="field-wrapper">

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

