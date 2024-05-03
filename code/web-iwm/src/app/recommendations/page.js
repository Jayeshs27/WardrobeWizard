"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ip, port } from '../../../../app-iwm/global.js'
import './style.css';


const UserRecommendations = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isRecommended, setRecommended] = useState(false);
    const [top, setTop] = useState('')
    const [bottom, setBottom] = useState('')
    const [message, setMessage] = useState('')
    const [images, setImages] = useState([]);
    const [loading, setloading] = useState(false);

    async function getImages() {
        try {
            const data = localStorage.getItem('isLoggedIn');
            if (data) {
                if (data === 'true') {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`http://${ip}:${port}/userdata`, { token : token})
                    
                    const result = await axios.get(`http://${ip}:${port}/get-all-items`, {
                      params : {
                          currentUser : response.data.data,
                      }
                    });
                    const items = result.data.map((item, index) => ({
                        id : item._id,
                        Tags : item.Tags,
                        ImageSrc : `http://${ip}:${port}/${item.Path}`
                    }));
                    
                    setImages(items);
                }
                else {
                    console.log("Fatal error: User not logged in");
                    // This should be changed to display a message on the screen
                    return ;
                }
            }
        }
        catch (err) {
          console.log(err)
        }
    }

    useEffect(() => {
        getImages();
    });

    const sendQuery = async () => {
        try {
            setloading(true);
            console.log(searchQuery);
            const response = await axios.post(`http://${ip}:${port}/recommend`, { 'input' : searchQuery , 'clothes': images});

            if (!response.data['top'] && !response.data['bottom']){
                setMessage('No clothes match the occasion');
                setTop('')
                setBottom('')
            }
            else if (!response.data['top']) {
               setMessage('You have no good tops for the occasion');
               setTop('')
               setBottom(response.data['bottom'])
            }
            else if (!response.data['bottom']) {
               setMessage('You have no good bottoms for the occasion');
               setTop(response.data['top'])
               setBottom('');

            }
            else{
                setMessage('')
                setTop(response.data['top'])
                setBottom(response.data['bottom'])
            }

            setTop(response.data['top'])
            setBottom(response.data['bottom'])
            setRecommended(true);
            setloading(false);
        }
        catch (err) {
            setloading(false);
            console.log("This" + err);
        }
    }

    useEffect(() => {
      console.log("Top: ", top);
      console.log("Bottom: ", bottom);
    }, [top, bottom]);
  

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if(searchQuery != ""){
                sendQuery();
            }
        }
    }

    const handleNewQuery = () => {
        setRecommended(false);
        setSearchQuery('');
        setTop('');
        setBottom('');
    }

    return(
     <div>
        {loading ? (
            <div className="loading-container">
                <img src="/loading.gif" alt="loading.gif" />
            </div>
        ) : (
            <div className="container">
                {!isRecommended && (
                    <div className="search-container">
                        <div className="search-box-container">
                            <div className="get-recommendation-text">
                                Get Your Recommendations Now!
                            </div>
                            <div className="search-container">
                                <input type="text" value={searchQuery} placeholder="Search for occasion" onKeyDown={handleKeyDown} className='input-recommendation-search' onChange={(e) => setSearchQuery(e.target.value)}/>
                            </div>
                        </div>
                        <img src="/recommendations.svg" className="search-right-svg" alt="recommendation-svg" />
                    </div>
                )}
                {/* {!isRecommended && (
                )} */}
                {(top || bottom ) && (
                    <div className="div-recommendation-box">
                        <div className="div-recommendation-heading">
                            Your Recommendations
                        </div>
                        <div className="div-image-grid">
                            {top && (
                                <img className='recommendation-img' src={top} />
                            )}
                            {bottom && (
                                <Img className="recommendation-img" src={bottom}></Img>
                            )}
                        </div>
                    </div>
                )}
                {isRecommended && (
                    <div className="recommendation-container">
                        {message && (
                            <div className="recommendation-message-box">
                                {message}
                            </div>
                        )}
                        <div className="div-recommended-control">
                            <button className="button-below-recommendations" onClick={sendQuery}>Regenerate</button>
                            <button className="button-below-recommendations" onClick={handleNewQuery}>New Search</button>
                        </div>  
                    </div>
                )}
            </div>
        )}
    </div>
    )
}

export default UserRecommendations;