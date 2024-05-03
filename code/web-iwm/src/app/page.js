"use client";
import React, { useState, useEffect } from 'react';
import {ip, port} from '../../../backend/global.js';
import axios from 'axios';

const Home = () => {
  const images = [1,1,1, 1, 1, 1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1]
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesLeft = images.length - currentIndex;
  const [gridColumns, setGridColumns] = useState(4); // Initial calculation
  const [favouriteItems, setfavouriteItems] = useState([]);

  const handleNextClick = () => {
    const viewportWidth = window.innerWidth;
    const imagesToShift = Math.floor(viewportWidth / 250); // Assuming each image is 300px wide

    console.log(imagesLeft, " left, to shift " ,imagesToShift)

    if (imagesLeft > imagesToShift) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      console.log(imagesToShift);
    }
  };

  const handlePrevClick = () => {
    const viewportWidth = window.innerWidth;
    const imagesToShift = Math.floor(viewportWidth / 250); // Assuming each image is 300px wide

    if (currentIndex > 0){
      setCurrentIndex(prevIndex => prevIndex - 1);
      console.log(imagesToShift);
    }
  };


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevClick();
      } else if (event.key === 'ArrowRight') {
        handleNextClick();
      }
    };

    const handleResize = () => {
      const imagesToShift = Math.floor(window.innerWidth / 300); // Assuming each image is 300px wide
      setCurrentIndex(prevIndex => Math.min(prevIndex, images.length - imagesToShift));

      const gridColumns = Math.floor(window.innerWidth / 300); // Assuming each grid column is 250px wide
      setGridColumns(gridColumns); // Assuming you have state for gridColumns
    };

    handleResize();

    document.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleNextClick, handlePrevClick]);


  async function getFavouriteItems(){
    try {
      const data = await localStorage.getItem('isLoggedIn')
      if(data){
        if(data === 'true'){
          const token = await localStorage.getItem('token');
          const response = await axios.post(`http://${ip}:${port}/userdata`, {token: token})

          const result = await axios.get(`http://${ip}:${port}/get-all-items`,{
            params: {
              currentUser: response.data.data,
            }
          });

          const items = result.data
          .filter(item => item.isFav === true) // Filter to include only items where isFav is true
          .map((item) => ({
              id: item._id,
              Tags: item.Tags,
              isFav: item.isFav,
              ImageSrc: `http://${ip}:${port}/${item.Path}`
          }));
          setfavouriteItems(items);
        }
        else{
          console.log("Fatal Error: User not logged In");
          return;
        }
      }
    }
    catch(err){
      console.log(err);
    }
  }

  getFavouriteItems();

  return (
    <div>

      {/* White background section */}
      <div className="white-background">
        <div className="text">
          <p>Streamline Your Style,</p>
          <p>Simplify Your Life.</p>
        </div>
        <img src="/home-illustration.svg" alt="Homepage Icon" className="icon" />
      </div>

      {/* Currently Trending section */}
      <div className="trending-text">
        <h2>What's Trending?</h2>
      </div>
      <div className="trending-section">
        <div className="carousel-wrapper">
          <div className="carousel">
              {images.slice(currentIndex, currentIndex + 6).map((image, index) => (
                  <img key={index} src={`scrapped_images/image_${index + 1 + currentIndex}.jpg`} alt={`Image ${index + 1}`} className="carousel-image" />
              ))}
          </div>
          <button className="prev" onClick={handlePrevClick} disabled={currentIndex === 0}><span>{'<'}</span></button>
          <button className="next" onClick={handleNextClick} disabled={imagesLeft <= 4}><span>{'>'}</span></button>
        </div>
        <div className="favorites-text">
          <h2>Your Favorites</h2>
        </div>
        <div className="grid">
          {favouriteItems.map((item) => (
            <div key={item.id}>
              <img src={item.ImageSrc} className="grid-image" alt="item" />
            </div>
          ))}
        </div>
      </div>
      {/* CSS Styles */}
      <style jsx>{`
        .navbar {
          background-color: white;
          padding: 10px 20px;
          position: fixed;
          width: 100%;
          height: 6%;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          margin-top: -1.1%;
          margin-left: -0.2%;
        }

        .logo {
          font-size: 3.5vw; /* Adjust font size using viewport width */
          font-weight: bold;
          font-family: Poppins, sans-serif;
          color: black;
          margin-left: 2vw; /* Adjust margin using viewport width */
        }

        .links {
          display: flex;
          margin-right: auto;
          margin-left: 0.5vw; /* Adjust margin using viewport width */
        }

        .links a {
          text-decoration: none;
          color: black;
          font-size: 1.5vw; /* Adjust font size using viewport width */
          margin-right: 3vw; /* Adjust margin using viewport width */
          padding-top: 1vw; /* Adjust padding using viewport width */
          padding-left: 3vw;
          font-family: Helvetica, sans-serif;
        }

        .white-background {
          background-color: white;
          height: 30%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 50px;
          overflow-x: hidden;
        }

        .icon {
          height: 25%;
          width: 50%;
          margin-left: auto;
        }

        .text {
          margin-top: -3%;
          margin-left: 4%;
          padding: 5%;
          font-size: 4vw; /* Adjust font size using viewport width */
        }

        .text p {
          font-size: 3vw; /* Adjust font size using viewport width */
          font-weight: bold;
          font-family: Poppins, sans-serif;
          margin-bottom: -1%;
          // text-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
        }

        .trending-section {
          background-color: #f9f9f9;
          padding: 20px;
          overflow-x: hidden;
        }

        .trending-text {
          font-size: 2vw;
          font-weight: bold;
          font-family: Poppins, sans-serif;
          text-align: center;
        }

        .carousel-wrapper {
          position: relative;
          overflow-x: hidden;
        }

        .carousel {
          display: flex;
          margin-bottom: 20px;
        }

        .carousel-image {
          width: 20vw; /* Adjust width using viewport width */
          height: 25vw; /* Allow images to scale proportionally */
          border-radius: 10px; /* Adjust border radius as needed */
          margin-right: 5vw; /* Adjust margin using viewport width */
          padding: 1vw; /* Adjust padding using viewport width */
          min-width: 300px; /* Minimum width for the image */
          min-height: 312.5px; /* Minimum height for the image */
        }

        .favorites-text {
          font-size: 2vw; /* Adjust font size using viewport width */
          font-weight: bold;
          font-family: Poppins, sans-serif;
          text-align: center;
          // margin-top: 8%;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(${Math.min(gridColumns, 4)}, 1fr); /* Dynamic number of columns, capped at 4 */
          gap: 20px; /* Adjust gap between grid items */
          padding: 5%;
          margin-top: -4%;
        }

        .grid-image {
          width: 20vw; /* Ensure grid items take full width of their container */
          height: 25vw; /* Allow images to scale proportionally */
          border-radius: 10px; /* Adjust border radius as needed */
          min-width: 250px; /* Minimum width for the image */
          min-height: 300px; /* Minimum height for the image */
        }

        .prev,
        .next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: black;
          border: none;
          color: white;
          font-size: 30px;
          cursor: pointer;
          width: 50px; /* Adjust button width */
          height: 50px; /* Adjust button height */
          border-radius: 50%; /* Make the button circular */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1; /* Ensure buttons appear above carousel */
        }

        .prev span,
        .next span {
          line-height: 1; /* Center align the text */
        }

        .prev {
          left: 10px; /* Adjust left position */
        }

        .next {
          right: 10px; /* Adjust right position */
        }
      `}</style>
    </div>
  );
}

export default Home;


// {images
//   .filter(image => image[1] === 1)
//   .map((image, index) => {
//     const originalIndex = images.findIndex(img => img === image);
//     return (
//       <img
//         key={originalIndex}
//         src={`/image${originalIndex + 1}.jpg`}
//         alt={`Image ${originalIndex + 1}`}
//         className="grid-image"
//       />
//     );
//   })}
