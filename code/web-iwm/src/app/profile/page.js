"use client";
import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import {ip,port} from '../../../../backend/global.js';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmDialog } from 'primereact/confirmdialog';
// import { Toast } from 'primereact/toast';

// import AsyncStorage from '@react-native-async-storage/async-storage';


function ProfilePage() {
  // different modes
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordMode, setChangePasswordMode] = useState(false);

  // profile attributes
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const redirectButtonRef = useRef(null);

  // change password attributes
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [newConfirmPassword, setnewConfirmPassword] = useState("");

  // const accept = () => {
  //   toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  // }

  // const reject = () => {
  //     toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  // }


  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
    if (redirectButtonRef.current) {
      redirectButtonRef.current.click();
    }
  }

  async function DeleteAccount() {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this Account?');
        if(isConfirmed){

          const data = {
            email: email,
          };
          localStorage.setItem("token", "");
          localStorage.setItem("isLoggedIn", JSON.stringify(false));
  
          console.log(`query sent for /delete-account : ${data}`)
          const response = await axios.post(`http://${ip}:${port}/delete-account`, data);
          
          if(!response.data.success){
             toast.error(response.data.message)
          }
          else{
            if (redirectButtonRef.current) {
              redirectButtonRef.current.click();
            }
          }
        }
        // navigationOps.goToHome(navigation);

    } catch (error) {
        console.error('Error:', error);
    } 
  }

  // const handleDeleteAccount = () => {
  //     console.log('delete account')
  // }
  // const handleEditProfile = () => {
  //   setIsEditMode(true);
  // }

  async function checkAndUpdatePassword() {
    try {
        const data = {
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: newConfirmPassword,
        };
        console.log(`query sent : ${data}`)
        const response = await axios.post(`http://${ip}:${port}/password-update`, data);

        if (response.data.success) {
            setChangePasswordMode(false);
        } else {
            toast.error(response.data.message);
            setErrorMessage(response.data.message);
            console.log('Error modifying data:', response.data.message);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
      }
}

  async function getData(){
    try{
      const token = await localStorage.getItem('token');
      console.log(token);
      axios
        .post(`http://${ip}:${port}/userdata`, {token: token})
        .then(res => {
          console.log(res.data);
          setName(res.data.data.name);
          setEmail(res.data.data.email);
          setMobile(String(res.data.data.mobile));
          setGender(res.data.data.gender);
        });
    } catch(error){
        console.log("Error:",error);
    }
  }

  useEffect(() => {
    getData();
  }, [])
  
  async function saveData() {
    try {
      const data = {
        name: name,
        mobile: mobile,
        email: email,
        gender: gender,
      };
      console.log(`query sent : ${data}`)
      const response = await axios.post(`http://${ip}:${port}/profile-update`, data);

      if (response.data.success) {
        // console.log('data saved successfully')
        setIsEditMode(false);
      } else {
        toast.error(response.data.message);
        console.log('Error modifying data:', response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="profile-container">
      <ToastContainer/>
      <button ref={redirectButtonRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} onClick={() => { window.location.href = "/"; }}></button>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Right Content */}
      <div className="right-content">
        {/* Top Image */}
        <div className="top-image">
          <img src="/topimage.jpg" alt="Top Image" />
          <div className="circular-image">
            {/* Circular Cropped Image */}
            <img src="/circular-image-Male.png" alt="Circular Cropped Image" />
            {/* <p className="p-user-name">{name}</p> */}
          </div>
        </div>
        {isChangePasswordMode && (
          <div className="additional-info">
             <div className="info-box">
               <p className="category">old Password</p>
                <input className="value" type="password" onChange={(e) => setoldPassword(e.target.value)}/>
             </div>

             <div className="info-box">
               <p className="category">New Password</p>
                <input className="value" type="password" onChange={(e) => setnewPassword(e.target.value)} />
             </div>

             <div className="info-box">
               <p className="category">Confirm New Password</p>
                <input className="value" type="password" onChange={(e) => setnewConfirmPassword(e.target.value)} />
             </div>
          </div>
        )}

        {!isChangePasswordMode && (
          <div className="additional-info">
            <div className="info-box">
              <p className="category">Name</p>
              {isEditMode ? (
                <input className="value" type="text" value={name} onChange={(e) => setName(String(e.target.value))} />
              ) : (
                <p className="value">{name}</p>
              )}

            </div>
            <div className="info-box">
              <p className="category">Email</p>
              <p className="value">{email}</p>
            </div>
            <div className="info-box">
              <p className="category">Phone Number</p>
              {isEditMode ? (
                <input className="value" type="text" value={mobile} onChange={(e) => setMobile(String(e.target.value))} />
              ) : (
                <p className="value">{mobile}</p>
              )}
            </div>
            <div className="info-box">
              <p className="category">Gender</p>
              {isEditMode ? (
                <select className="value" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select> 
              ) : ( 
                <p className="value">{gender}</p>
              )}
            </div>
          </div>
        )}
        {/* {errorMessage && (
          <div className="div-error-message">
            <span className='p-error-message'>{errorMessage}</span>
          </div>
        )} */}

        <div className="profile-info">
          {/* <h2>{name}</h2> */}
          {isEditMode && (
            <div className="profile-control">
              <button className="edit-profile-button" onClick={saveData}>Save Changes</button>
              <button className="edit-profile-button" onClick={() => setIsEditMode(false)}>Cancel</button>
             </div>
          )}
          {isChangePasswordMode && (
            <div className="profile-control">
            <button className="edit-profile-button" onClick={checkAndUpdatePassword}>Save Changes</button>
            <button className="edit-profile-button" onClick={() => setChangePasswordMode(false)}>Cancel</button>
           </div>
          )}
          { !(isEditMode || isChangePasswordMode) && (
            <div className="profile-control">
              <button className="edit-profile-button" onClick={() => setIsEditMode(true)}>Edit Profile</button>
              <button className="edit-profile-button" onClick={() => setChangePasswordMode(true)}>Change password</button>
              <button className="edit-profile-button" onClick={handleLogout}>Logout</button>
              <button className="edit-profile-button" onClick={DeleteAccount}>Delete Account</button>
            </div>
          )}

        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .profile-container {
          display: flex;
          /* background-color:red; */
          /* height: 80vh; */
          /* height: 100vh; */
        }

        .logo {
          font-size: 60px;
          font-weight: bold;
          color: black;
          margin-bottom: 20px;
          font-family: 'Poppins', sans-serif; /* Apply Poppins font */
          text-align: center;
        }

        .line {
          height: 2px;
          background-color: #ccc; /* Grey line color */
          margin-bottom: 50px;
        }
/* 
        .sidebar-links a {
          display: block;
          color: black;
          text-decoration: none;
          margin-bottom: 10px;
          padding: 20px;
          font-size: 25px;
          color: #444;
        }

        .sidebar-links a img {
          width: 40px; /* Adjust the width of the icons */
       

        .right-content {
          width: 70%;
          margin: auto;
          height:90vh;
          /* overflow-y: auto;  */
          /* background-color:red; */
          background-color: #f9f9f9; 
        }

        .logout-link {
          display: flex;
          justify-content: center;
          margin-top: 20px; /* Adjust as needed */
        }

        .logout-btn {
          padding: 10px 20px; /* Adjust padding as needed */
          border: 2px solid white; /* Thick white outline */
          border-radius: 20px; /* Rounded rectangle */
          background-color: red; /* Red background */
          color: white; /* White text */
          font-weight: bold;
          cursor: pointer;
        }

        .logout-btn:hover {
          background-color: darkred; /* Darker red on hover */
        }

        .top-image {
          height: 30vh;
          /* position: relative; */
          background-color: red;
          }

        .top-image img {
          width: 100%;
          height: 100%;
        }

        .circular-image {
          /* position: absolute;
          top: 50%;
          left: 16%; */
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          transform: translate(0,-100%);  
          width: 150px; /* Adjust as needed */
          height: 200px; /* Adjust as needed */
          /* border-radius: 50%; */
          /* background-color:green;  */
          width:70vw;
          /* border: 10px solid white; */
          /* overflow: hidden;  */
        }

        .circular-image img {
          width: 150px;
          height: 150px;
          border-radius: 75px;
          /* object-fit: cover; Maintain aspect ratio */
        }
        .profile-info {
          font-family: 'Poppins', sans-serif; /* Apply Poppins font */
          /* margin-top:2%; */
          display:flex;
          justify-content:center;
          margin-top:50px;
          /* flex-wrap: wrap-reverse; */
          /* background-color:red; */
          /* margin-bottom: 10px; /* Add margin between profile info elements */
          /* margin-top: -11%;
          padding-left: 7%; */ */
          /* margin-top:-5%; */
        }
        .profile-control {
          display:flex;
          flex-wrap: wrap;
          /* margin-right: 8%; */
          /* width:30%; */
          /* background-color: red; */
          justify-content:space-between;
        }

        /* .profile-info h2 {
          font-size: 44px;
          font-weight: bold;
          margin-left: 8%;
          /* margin-bottom: -10px; Reduce margin between heading and role */
          /* font-family: 'Poppins', sans-serif; /* Apply Poppins font */
        /* } */

        .edit-profile-button
        {
          /* padding: 20px 80px; */
          height: 60px;
          border-radius: 50px;
          width: 170px;
          margin:20px 30px;
          cursor: pointer;
          font-weight: bold;
          background-color: #bf9260;
          color: white;
          cursor: pointer;
          border: none;
          /* margin-left: -1%; */
          font-size: 16px;
          /* margin-bottom: -5%; */
        }
        .edit-profile-button:hover
        {
          background-color:#654321;
        }
        /* .edit-profile-button {
          background-color: #bf9260;
          color: white;
          cursor: pointer;
          border: none;
          /* margin-left: -1%; */
          /* font-size: 16px;
        } */ 

        /* .logout-button {
          background-color:#bf9260;
          border:none;
          color:white;
          cursor:pointer;
          /* margin-left: 2%; */
          /* font-size: 16px;
        } */ 
        .role {
          font-size: 25px;
          color: grey;
          margin-bottom: -10px; /* Reduce margin between role and gender */
          font-family: 'Poppins', sans-serif; /* Apply Poppins font */
        }

        .gender {
          font-size: 25px;
          color: grey;
          font-family: 'Poppins', sans-serif; /* Apply Poppins font */
        }



        .additional-info {
          margin:0px 50px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 10px;
          /* padding: 5%; *
          /* margin-left: -5%; */
        }

        .info-box {
          /* background-color: white; */
          /* display:flex; */
          /* align-items: center;
          justify-content: center; */
          padding: 10px 20px;
          border-radius: 25px;
          /* box-shadow: 0 0 5px grey;  */
          margin: 1% 5%;
          /* margin-top: 2.5%;
          margin-left: 10%; */
        }

        .category {
          font-size: 14px;
          /* font-weight: bold; */
          color: grey;
          margin-left:20px;
          margin-bottom:5px;
          font-family: 'Poppins', sans-serif; /* Apply Poppins font */
        }
        
        .value {
          font-size: 20px;
          font-weight: bold;
          color: black;
          margin: 0;
          font-family: 'Poppins', sans-serif; 
          background-color:white;
          padding:15px 20px;
          border-radius:30px;
          box-shadow: 0 0 5px grey; 
          border:none;
          width:100%;
          /* Apply Poppins font */
        }
        .div-error-message {
           display:flex;
           justify-content:center;
           align-items:center;
        }
        .p-error-message {
            color:red;
        }
        /* .info-box .value-1{
          font-size: 20px;
          font-weight: bold;
          color: black;
          margin: 0;
          font-family: 'Poppins', sans-serif; 
          background-color:white;
          padding:10px 20px;
          border-radius:20px;
          box-shadow: 0 0 5px grey; 
          border:none;
          background-color:red;
          width:100%;
        } */  
        

      `}</style>
    </div>
  );
}

ProfilePage.disableNavbar = true;

export default ProfilePage;

// <div className="sidebar">
// <button ref={redirectButtonRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} onClick={() => { window.location.href = "/"; }}></button>
// <h2 className="logo">IWM</h2> {/* IWM Logo */}
// <div className="line"></div> {/* Grey line above links */}
// <div className="sidebar-links">
//   <a href="www.google.com">
//     <img src="/wardrobe-icon.png" alt="Wardrobe Icon" />
//     Your Wardrobe
//   </a>
//   <a href="www.google.com">
//     <img src="/recommendations-icon.png" alt="Recommendations Icon" />
//     Recommendations
//   </a>
//   <a href="www.google.com">
//     <img src="/trending-icon.png" alt="Currently Trending Icon" />
//     Currently Trending
//   </a>
//   <a href="www.google.com">
//     <img src="/home-icon.png" alt="Home Icon" />
//     Home
//   </a>
//   <a href="www.google.com">
//     <img src="/about-icon.png" alt="About Us Icon" />
//     About Us
//   </a>
// </div>
// <div className="line"></div> {/* Grey line below links */}

// {/* Logout link */}
// <div className="logout-link">
//   {/* Styled Logout button */}
//   <button className="logout-btn" onClick={handleLogout}>
//     Logout
//   </button>
// </div>

// </div>
