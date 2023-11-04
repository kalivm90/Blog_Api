import {Link} from "react-router-dom";
import {Github, Twitter, Facebook} from "react-bootstrap-icons";
import "@styles/components/footer.scss"

const Footer = () => {

    const handleBackToTop = (e) => {
        window.scrollTo({
            top: 0, 
            behavior: 'smooth',
        })
    }

    return (
        <footer>
            <a onClick={handleBackToTop}>Back To Top &#x2191;</a>
            <p>Registered Address: KaliCo LTD, 2335 Orchard View Lane, Escondido CA 92027 </p>
            <p>&copy; 2023 KaliCo USA, Inc. All rights reserved.</p>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/auth/login">Login</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/emailUs">Email us</Link></li>
            </ul>
            <div className="footer-social">
                <Github className="icon" size={30}></Github>
                <Twitter className="icon" size={30}></Twitter>
                <Facebook className="icon" size={30}></Facebook>
            </div>
        </footer>
    )
}


export default Footer;