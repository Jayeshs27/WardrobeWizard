"use client";
import React from 'react';
import './style.css';

const Trends = () => {
    // Array of imported images
    const images = Array(20).fill(1);

    return (
        <div className="container">
            <div className="contentbox">
                {/* Grid section */}
                <div className="trending-text">
                  <h2>Currently Trending</h2>
                </div>
                <div className="grid">
                    {images.map((image, index) => (
                        <div key={index}>
                            <img src={`scrapped_images/image_${index + 1}.jpg`} className="grid-image" alt={`item ${index + 1}`} />
                        </div>
                    ))}
                </div>
                {/* Add any additional content if necessary */}
            </div>
            {/* CSS styles for the grid */}
            <style jsx>{`
                .grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr); /* Fixed number of columns set to 4 */
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

                .trending-text {
                  font-size: 2vw;
                  font-weight: bold;
                  font-family: Poppins, sans-serif;
                  text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Trends;
