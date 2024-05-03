import React, { useState } from 'react';
import './card.css';

const Card = ({ item, toggleLikeOption, deleteItem }) => {

    const [isLiked, setIsLiked] = useState(item.isFav);


    const handleToggleLike = () => {

        toggleLikeOption(item);
        setIsLiked(prevIsLiked => !prevIsLiked);
    };


    const likeButtonClass = isLiked ? 'likeButton liked' : 'likeButton';

    console.log(item.ImageSrc);
    return (
        <div className="card">
            <img src={item.ImageSrc} alt="Item" className="card-image" />
            <p className="card-text">
                {item.Tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </p>
            <div className="button-container">
                <div className={isLiked ? "likeButton liked" : "likeButton unliked"} onClick={handleToggleLike} >
                    <img className={isLiked ? "likeImg liked" : "likeImg unliked"} src={isLiked ? "/heart-liked.svg" : "/heart-unliked.svg"} alt="unliked" />
                </div>
                <div className="deleteButton" onClick={() => deleteItem(item)}>
                    <img className="deleteImg" src="/delete-button.svg" alt="delete" />
                </div>
                {/* <button className={likeButtonClass} onClick={handleToggleLike}>Like</button>
                    <button className="deleteButton" onClick={() => deleteItem(item)}>Delete</button> */}
            </div>
            <style jsx>{`
            .card {
                height:40vh;
            }
            .button-container{
                display:flex;
                justify-content:space-between;
            }
            .likeImg{
                height:30px;
                /* background-color: #E3E3E3; */
            }
            .likeButton{
                width:70px;
                height:50px;
                /* background-color:#E3E3E3; */
                margin:0px 20px;
            }
            .liked{
                background-color:#FF5995;
            }
            .unliked{
                background-color: #E3E3E3;
            }

            .deleteImg{
                height:25px;
                padding:0px;
            }
            .deleteButton{
                width:70px;
                height:50px;
                margin:0px 20px;
            }

            .card-text {
                display: flex;
                flex-wrap: wrap;
                gap: 5%;
                padding: 5px;
                border-radius: 10px;
            }

            .tag {
                padding: 5px 10px;
                border-radius: 20px;
                background-color: #e0e0e0;
                color: #333;
                font-size: 14px;
            }

        `}</style>
        </div>
    );
};

export default Card;
