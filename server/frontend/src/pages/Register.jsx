import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

function Register() {

  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "", 
  });

  useEffect(() => {
    if(localStorage.getItem("app-user")){
      navigate("/chat");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()){
      const {password, name, username, email} = values;
      try {
        const { data } = await axios.post(registerRoute, {
          name, 
          username, 
          email, 
          password,
        }, {
          timeout: 20000 // 20 seconds timeout
        });
        if(data.status === false){
          toast.error(data.msg, toastOptions);
        }
        if(data.status === true){
          localStorage.setItem("app-user", JSON.stringify(data.user));
          navigate("/chat");
        }
      } catch (error) {
        if (error.response) {
          // Server responded with a status code out of 2xx range
          if (error.response.status === 504) {
            toast.error("Gateway Timeout. Please try again later.", toastOptions);
          } else {
            toast.error(`Error: ${error.response.data.msg || error.message}`, toastOptions);
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response from server. Please check your network connection and try again.", toastOptions);
        } else {
          // Something happened in setting up the request that triggered an error
          toast.error(`Error: ${error.message}`, toastOptions);
        }
      }
    }
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = () => {
    const {password, confirmPassword} = values;
    if(password !== confirmPassword){
      toast.error("Passwords do not match.", toastOptions);
      return false;
    } else if (password.length < 8){
      toast.error("Password should be at least 8 characters.", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value});
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className='brand'>
            <img src={Logo} alt='logo' />
            <h1>fChat</h1>
          </div>
          <input type='text' placeholder='Name' name='name' onChange={handleChange} />
          <input type='text' placeholder='Username' name='username' onChange={handleChange} />
          <input type='email' placeholder='Email' name='email' onChange={handleChange} />
          <input type='password' placeholder='Password' name='password' onChange={handleChange} />
          <input type='password' placeholder='Confirm Password' name='confirmPassword' onChange={handleChange} />
          <button type='submit'>Create User</button>
          <span>
            Already a user? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #B0E1FA;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: black;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #468EF6;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: black;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: black;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: black;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;
