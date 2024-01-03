import { useEffect, useState } from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import {debounce} from "lodash";

import { useAuth } from '../context/AuthContext.jsx';

import fetchApi from "@util/fetchApi.js";
import {toTitleCase, getDateOfExpiration} from "@util/helpers.js";
import GoogleLoginButton from "./googleLoginButton.jsx";


import "@styles/components/authForm.scss";


const AuthForm = ({url, title, fields, method="POST", className}) => {
    const [showPassword, setShowPassword] = useState(false);

    const {updateAuthData, logout} = useAuth();

    const redirect = useNavigate();

    const fieldLabels = {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        username: "Username",
        password: "Password",
        confirmPassword: "Confirm Password",
        blogOwner: "Blog Owner", 
    }

    const checkField = (field) => {
        let type;

        if ((field === "confirmPassword" || field === "password") && showPassword) {
            type = "text";
        } else if (field !== "password" && field !== "confirmPassword") {
            type = "text"
        } else {
            type = "password"
        }
        return type;
    }

    const validationSchema = yup.object().shape(
        fields.reduce((schema, field) => {
            if (field === "password") {
                schema[field] = yup
                    .string()
                    .required("Password is required")
                    .min(6, "Password must be at least 6 characters long");
            } else if (field === "confirmPassword") {
                schema[field] = yup
                    .string()
                    .oneOf([yup.ref("password"), undefined], "Passwords must match")
                    .required("Confirm Password is required");
            } else if (field === "email") {
                schema[field] = yup
                    .string().required("Email is required").email("Invalid email format");
            } else {
                schema[field] = yup.string().required(`${toTitleCase(field)} is required.`);
            }
            return schema;
        }, {})
    )

    const {
        register,
        watch,
        handleSubmit,
        formState: {errors, isValid}, setError, clearErrors, getValues, reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onTouched"
    })


    async function formSubmit() {
        if (isValid) {
            const fieldValues = fields.reduce((values, field) => {
                values[field] = getValues(field);
                return values;
            }, {});
            

            const response = await fetchApi(url, method, fieldValues);
            


            console.log(response);

            if (response.res?.ok) {
                reset();

                const estimatedExpiration = getDateOfExpiration(response.payload.tokenExp);
                // request has user come as itself rather than in authData since it does not come from passport
                let authObj = {
                    isAuthenticated: true,
                    user: response.payload.user,
                    // date of token expiration
                    timeOfExp: estimatedExpiration,
                }
                
                console.log("DEBUG: ", authObj);

                updateAuthData(authObj);
                redirect("/blog/dashboard?page=1");
            } else if (response.res?.status === 400) {
                console.log("TODO authForm: if validation fails on server although the client side validation should catch it");
            } else {
                logout();
                console.log("DEBUG: ", response);
                redirect(`/auth/login?error=authForm: ${response?.payload.error || 'Something went wrong'}`);
                // redirect(0);
                window.location.reload();
            }
        }
    }

    // debouncing validateUsername so I can limit the requests to the server
    const debouncedValidateUsername = debounce(
        async (e, setError, clearErrors) => {
            const url = import.meta.env.VITE_SERVER_AUTH + "/checkUsername";
            const response = await fetchApi(url, "POST", { value: e });

            
            if (response?.res.ok) {
                clearErrors("username");
            } else {
                setError("username", {
                    type: "manual",
                    message: "Username is already taken",
                });
            }

        },
        400
    );

    const validateUsername = (e) => {
        debouncedValidateUsername(e, setError, clearErrors);
    };

    return (
        <div className={`authForm ${className}`}>
            <div className="container">
                <div className="container-title">
                    {title != "username" ? (
                        <div>
                            <h2>{title}</h2>
                            <p>Or {title.toLowerCase()} with Google instead! (see bottom)</p>
                        </div>
                    ) : (
                        <div>
                            <h2>Choose your username</h2>
                            <p>You can change this at any time</p>
                        </div>
                    )} 
                    <hr />
                </div>

                <form onSubmit={handleSubmit(formSubmit)}>
                    {fields.map((field, index) => (
                        <div className="form-group" key={index}>
                            <label htmlFor={field}>{fieldLabels[field]}: </label>
                            {field === "blogOwner" ? (
                                <select name="blogOwner" className="blog-owner" {...register("blogOwner")}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            ) : (
                                <>
                                    <input
                                        className={`${errors[field] ? "has-error" : ""}`}
                                        type={checkField(field)}
                                        name={field}
                                        {...register(field)}
                                        onChange={(e) => {
                                            // making a request to the server to see if the username is valid
                                            const currentField = e.target 

                                            if (currentField.name === "username" && title !== "Login" && currentField.value !== "") {
                                                validateUsername(e.target.value)
                                            }
                                        }}
                                    />
                                </>
                            )}
                            {errors[field] && <p className="form-error">{errors[field].message}</p>}
                        </div>
                    ))}

                        {title !== "username" && (
                            <div className="form-group showPassword">
                                <label htmlFor="showPassword">Show Password</label>
                                <input 
                                    type="checkbox" 
                                    name="showPassword"
                                    onChange={(e) => setShowPassword(e.target.checked ? true : false)}
                                />
                            </div>
                        )}
                        
                        {title !== "username" ? (
                            <div className="form-actions">
                                <button type="submit">{title}</button>
                                <GoogleLoginButton text={title}/>
                            </div>
                        ) : (
                            <div className="form-actions">
                                <button type="submit">Submit</button>
                            </div>
                        )} 
                </form>
            </div>
        </div>
    )
}

export default AuthForm;