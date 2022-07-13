import { Link } from "react-router-dom"

export default function AccountStateView(props) {
    if (props.loggedIn) {
        return(
            <div id="AccountView">
                {localStorage.getItem("username")}
            </div>
        )
    } else {
        return(
            <Link to="/login" id="AccountView">
                Logged out. Click to log in.
            </Link>
        )
    }
    
}