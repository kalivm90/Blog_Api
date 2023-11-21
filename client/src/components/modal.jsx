import { useNavigate } from "react-router-dom";
import fetchApi from "../util/fetchApi.js";
import {useAuth} from "../context/AuthContext.jsx";

import {XLg} from "react-bootstrap-icons"
import "@styles/components/modal.scss"


const Modal = ({title, url, post, onClose}) => {
    // auth
    const {getAuthData, logout} = useAuth();
    const authData = getAuthData();

    // redirect module
    const redirect = useNavigate();

    // sends delete request to server
    const handleAction = async () => {
        const newurl = import.meta.env.VITE_API_PATH + url

        const response = await fetchApi(newurl, "DELETE");

        if (response.res.ok) {
            redirect(`/blog/dashboard?page=1&message=Modal: ${response?.payload.message}`);
        } else if (response.res.status === 404) {
            // No post found on server
            redirect(`/blog/${post.id}/view?error=Modal: ${response?.payload.error}`);
        } else if (response.res.status === 403) {
            redirect(`/blog/dashboard?page=1&error=Modal: ${response?.payload.error}`);
        } else {
            // redirect to auth/login
            logout()
            redirect(`/auth/login?error=Modal: ${response.payload.error}`)
        }

        onClose();
    }

    return (
        <div className="popup-prompt">
            <div className="prompt-content">
                <div className="prompt-title">
                    <h2>{title}</h2>
                    <hr></hr>
                </div>
                <div className="post-info">
                    <div className="title">
                        <h3>Post Title: </h3>
                        <p>{post.title}</p>
                    </div>
                    <div className="likes">
                        <h3>Likes: </h3>
                        <p>{post.likes.number}</p>
                    </div>
                    <div className="timestamp">
                        <h3>Timestamp: </h3>
                        <p>{post.timestamp_format}</p>
                    </div>
                </div>
                <div className="action-wrapper">
                    <button id="delete" onClick={() => handleAction()}>Delete</button>
                    <button id="cancel" onClick={() => onClose()}>Cancel</button>
                </div>
                <div className="exit" onClick={() => onClose()}>
                    <XLg></XLg>
                </div>
            </div>
        </div>
    )
}

export default Modal;