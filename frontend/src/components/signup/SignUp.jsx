import { useState } from "react";
import axiosInstance from "../../../axiosConfig";
import './Signup.css';
import { useNotification } from "../../NotificationContext";

const SignUp = ({ setIsSignUp, setIsLogin, setUserData }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    const { showNotification } = useNotification();

    const onSignUpClick = async() => {
        try {
            let someError = false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!name){
                someError = true;
                setNameError('Empty name');
            }
            if(!emailRegex.test(email)){
                someError = true;
                setEmailError('Invalid email format');
            }
            if(!email){
                someError = true;
                setEmailError('Empty email');
            }
            if(!password){
                someError = true;
                setPasswordError('Empty password');
            }
            if(password !== confirmPassword){
                someError = true;
                setConfirmPasswordError('Password not match');
            }
            if(!confirmPassword){
                someError = true;
                setConfirmPasswordError('Please confirm password');
            }
            if(someError){
                return;
            }

            await axiosInstance.post('/signup', {
                name,
                email,
                password,
            });

            const userData = { name, email }
            setUserData(userData);
            setIsLogin(true);
        } catch (error) {
            showNotification(error.response.data.error);
        }
    }

    const onLoginClick = () => {
        setIsSignUp(false);
    }

    return (
        <>
            <h1>SignUp</h1>
            <hr/>
            <div style={{ display: "grid" }}>
                <input
                    value={ name }
                    placeholder="Enter name"
                    onChange={ (e) => { 
                        setName(e.target.value);
                        if(!e.target.value){
                            setNameError('Empty name');
                        }else{
                            setNameError(null);
                        }
                    }}
                    className="item-signup"
                />
                { nameError && <p className="error-message-signup">{ nameError }</p>}
                <input
                    value={ email }
                    placeholder="Enter email"
                    onChange={ (e) => {
                        setEmail(e.target.value);
                        if(!e.target.value){
                            setEmailError('Empty email');
                        }else {
                            setEmailError(null);
                        }
                    }}
                    type="email"
                    className="item-signup"
                />
                { emailError && <p className="error-message-signup">{ emailError }</p>}
                <input
                    value={ password }
                    placeholder="Enter password"
                    onChange={ (e) => {
                        setPassword(e.target.value);
                        if(!e.target.value){
                            setPasswordError('Empty password')
                        }else{
                            setPasswordError(null);
                        }
                    }}
                    type="password"
                    className="item-signup"
                />
                { passwordError && <p className="error-message-signup">{ passwordError }</p>}
                <input
                    value={ confirmPassword }
                    placeholder="Confirm Password"
                    onChange={ (e) => {
                        setConfirmPassword(e.target.value);
                        if(!e.target.value){
                            setConfirmPasswordError('Please confirm password');
                        }else{
                            setConfirmPasswordError(null);
                        }
                    }}
                    type="password"
                    className="item-signup"
                />
                { confirmPasswordError && <p className="error-message-signup">{ confirmPasswordError }</p>}
                <button onClick={ onSignUpClick } className="item-signup">
                    Sing Up
                </button>

                <button onClick={ onLoginClick } className="item-signup">
                    already have an account?
                </button>
            </div>
        </>
    )
}

export default SignUp;