import { useEffect, useState } from 'react'
import './App.css'
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import axiosInstance from '../axiosConfig';

function App() {
  const [isLoadig, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    isValidToken();
  },[]);

  const logout = async() => {
    await axiosInstance.post('/logout');
    setIsSignUp(false);
    setIsLogin(false);
    setUserData(null);
  }

  const isValidToken = async() => {
    try {
      const response = await axiosInstance.get('/user');
      setUserData(response.data.userData);
      setIsLogin(response.data.isValidToken);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {
        isLoadig ? <p>...loading</p> : 
        (
          isLogin ? <Dashboard userData={ userData } setUserData={ setUserData} logout={ logout}/>
          : isSignUp ? <SignUp setIsSignUp={ setIsSignUp } setIsLogin={ setIsLogin } setUserData={ setUserData }/> : <Login setIsSignUp={ setIsSignUp } setIsLogin={ setIsLogin } setUserData= { setUserData}/>
        )  
      }
    </>
  )
}

export default App
