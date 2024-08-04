import { useState } from "react"
import axiosInstance from "../../../axiosConfig";
import './Login.css';
import { useNotification } from "../../NotificationContext";

const Login = ({ setIsSignUp, setIsLogin, setUserData }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const { showNotification } = useNotification();

    const onLoginClick = async() => {
        try {
            let someError = false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                someError = true;
                setEmailError('Invalid email format');
            }
            if(!email){
                setEmailError('Empty email');
                someError = true;
            }
            if(!password){
                someError = true;
                setPasswordError('Empty password');
            }
            if(someError){
                return;
            }
            const response = await axiosInstance.post('/login', {
                email,
                password,
            });

            setUserData(response.data.userData);
            setIsLogin(true);
        } catch (error) {
            showNotification(error.response.data.error);
        }
    }

    const onSingUpClick = () => {
        setIsSignUp(true);
    }

    return (
        <>
            <h1>Login</h1>
            <hr/>
            <div style={{ display: "grid", }}>
                <input
                    value={ email }
                    placeholder="enter email"
                    onChange={ (e) => {
                        setEmail(e.target.value);
                        if(!e.target.value){
                            setEmailError('Empty email');
                        }else{
                            setEmailError(null);
                        }
                    }}
                    type="email"
                    className="login-item"
                />
                { emailError && <p className="error-message-login">{ emailError }</p>}
                <input
                    value={ password }
                    placeholder="enter password"
                    onChange={ (e) => {
                        setPassword(e.target.value)
                        if(!e.target.value){
                            setPasswordError('Empty password');
                        }else{
                            setPasswordError(null);
                        }
                    }}
                    type="password"
                    className="login-item"
                />
                { passwordError && <p className="error-message-login">{ passwordError }</p>}
                <button onClick={ onLoginClick } className="login-item">
                    Login
                </button>

                <button onClick={ onSingUpClick } className="login-item">
                    Sign Up
                </button>
            </div>
            
        </>
    )
}

export default Login;
