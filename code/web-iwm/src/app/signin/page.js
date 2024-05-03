"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ip, port } from '../../../../backend/global.js'
import './index.css'
import {
  Container,
  SignUpContainer,
  GhostButton2,
  SignInContainer,
  Title2,
  Text2,
  Form,
  Title,
  Input,
  Button,
  GhostButton,
  Anchor,
  OverlayContainer,
  Overlay,
  OverlayPanel,
  LeftOverlayPanel,
  RightOverlayPanel,
  Paragraph1,
  Paragraph2,
  Image,
  Text
} from './Components.js';

function App() {
  const [signIn, setSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('Male');
  const [errorMessage, setErrorMessage] = useState('');
  const redirectButtonRef = useRef(null); // Create a ref for the invisible button

  const toggle = (value) => {
    setSignIn(value);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = signIn ? `http://${ip}:${port}/signin` : `http://${ip}:${port}/signup`;
    try {
      let requestData;
      if (signIn) {
        requestData = { email, password };
      } else {
        requestData = { name, email, password, confirmPassword, mobile, gender };
      }
      const response = await axios.post(endpoint, requestData);
      console.log(response.data);
      if (response.data.success) {
        if (signIn) {
          localStorage.setItem("token", response.data.data);
          localStorage.setItem("isLoggedIn", JSON.stringify(true));
          // Trigger click event on the invisible button
          if (redirectButtonRef.current) {
            redirectButtonRef.current.click();
          }
        }
        setSignIn(!signIn);
      } else {
        toast.error(response.data.message);
        setErrorMessage(response.data.message);
      }

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMobile('');
      setGender('Male');
    } catch (error) {
      console.error('Error: ', error);
      setErrorMessage(error.message);
      toast.error('An error occurred. Please try again later.');

    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'mobile':
        setMobile(value);
        break;
      case 'gender':
        setGender(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <ToastContainer/>

    <Container>
      {/* Invisible button to trigger redirection */}
      <button ref={redirectButtonRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} onClick={() => { window.location.href = "/"; }}></button>

      {signIn ? (
        <SignInContainer signinin={signIn}>
          <Form onSubmit={handleSubmit}>
            <Title>Sign in</Title>
            <Input type='email' name="email" placeholder='Email ID*' value={email} onChange={handleChange} />
            <Input type='password' name="password" placeholder="Password*" value={password} onChange={handleChange} />
            <Anchor href='#'>Forgot Password?</Anchor>
            <Button type="submit">Sign In</Button>
          </Form>
        </SignInContainer>
      ) : (
        <SignUpContainer signinin={signIn}>
          <Form onSubmit={handleSubmit}>
            <Title>Create Account</Title>
            <Input type='text' name="name" placeholder="Name*" value={name} onChange={handleChange} />
            <Input type='email' name="email" placeholder="Email ID*" value={email} onChange={handleChange} />
            <Input type='password' name="password" placeholder="Password*" value={password} onChange={handleChange} />
            <Input type='password' name="confirmPassword" placeholder="Confirm Password*" value={confirmPassword} onChange={handleChange} />

            <Input type='text' name="mobile" placeholder="Mobile*" value={mobile} onChange={handleChange} />
            {/* <Input type='text' name="gender" placeholder="Male/Female/Other*" value={gender} onChange={handleChange} /> */}
            <select className="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <Button type="submit">Sign Up</Button>
          </Form>
        </SignUpContainer>
      )}

      <OverlayContainer signinin={signIn}>
        <Overlay signinin={signIn}>
          <LeftOverlayPanel signinin={signIn}>
            <Title2>Welcome Back!</Title2>
            <Paragraph2>
              To keep connected with us please login with your information.
            </Paragraph2>
            <GhostButton onClick={() => toggle(true)}>Sign In</GhostButton>
          </LeftOverlayPanel>

          <RightOverlayPanel signinin={signIn}>
            <Text2>New? Sign Up!</Text2>
            <Paragraph1>Enter Your Personal Details and start a new Trend!</Paragraph1>
            <GhostButton onClick={() => toggle(false)}>Sign Up</GhostButton>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
    </div>
  );
}

export default App;
