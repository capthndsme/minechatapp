import { useEffect } from "react";
import * as AuthManager from "../AuthManager";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Login() {
    let navigate = useNavigate();
    useEffect(() => {
        AuthManager.isAutenticated()
        .then ((state) => {
            console.log(state);
            if (state) {

                navigate("/chat/0");
            } 
        })
    },[]);
    const [hasError, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    function submitHandle(event) {
        event.preventDefault();
        setError(false);
        let username = event.target.elements.username.value;
        let password = event.target.elements.password.value;
        console.log("Logging in attempt for", username)
        AuthManager.loginVerify(username, password)
        .then ((data) => {
            if (data.data.state === "success") {
                navigate("/chat/0");
            } else {
                setError(true);
                setErrorMsg(data.data.error);
            }   
        })
    }
    return (
    <div id="LoginView">
        <div className="loginForm">
            <div className="title">
                Login to Minechat
            </div>
            <form  onSubmit={submitHandle} className="innerLoginForm">
                {hasError?<div className="errorMessage">{errorMsg}</div>:<></>}
                <div style={{textAlign:"justify", paddingBottom:4}}>Note: use your in-game password from the /login command, not your mojang account or anything else.
                    <br/>
                    This also means that you have to be an existing player to chat.
                    </div> 
                Username: <input name="username"></input>
                Password: <input name="password" type="password"></input>
                <input type="submit" value="Login" />
            </form>
        </div>
    </div>);
}