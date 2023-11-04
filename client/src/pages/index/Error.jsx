import "@styles/pages/Error.scss"
import Image from "@images/error.png";

const Error = () => {
    return (
            <div className="Error">
                <p><a href="/">Go Home</a></p>
                <img src={Image} alt="404 error"></img>
            </div>
    )
}

export default Error;