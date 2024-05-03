"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles.css';
import Card from '../../components/wardrobecard';
const Tags = [
    'Casualwear', 'Partywear', 'Formalwear'
]
import { ip, port } from '../../../../app-iwm/global.js'


const Wardrobe = () => {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const [uploading, setuploading] = useState(false);
    const [loading, setloading] = useState(false);



    async function getAllItems() {
        try {
            setloading(true);
            console.log("trying", `http://${ip}:${port}/get-all-items`);
            // const token = await AsyncStorage.getItem('token');
            const token = localStorage.getItem('token');
            console.log("token", token);
            const response = await axios.post(`http://${ip}:${port}/userdata`, { token: token })
            console.log("response", response);

            const query = {
                currentUser: response.data.data,
            };
            console.log(query, "QUERY!!!");
            const result = await axios.get(`http://${ip}:${port}/get-all-items`, {
                params: query // Use params instead of query
            });
            // const result = await axios.get(`http://${ip}:${port}/get-all-items`);
            console.log(result);
            const items = result.data.map((item, index) => ({
                id: item._id,
                Tags: item.Tags,
                isFav: item.isFav,
                ImageSrc: `http://${ip}:${port}/${item.Path}`
            }));
            setWardrobeItems(items);
            setFilteredItems(items);
            setloading(false);
        } catch (err) {
            setloading(false);
            console.log(err);
        }
    }
    useEffect(() => {
        getAllItems();
    }, []);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    useEffect(() => {
        const updatedFilteredItems = selectedTags.length > 0
            ? wardrobeItems.filter(item => item.Tags.some(tag => selectedTags.includes(tag)))
            : wardrobeItems;
        setFilteredItems(updatedFilteredItems);
    }, [selectedTags, wardrobeItems]);

    const UpdateLikeOption = async (item) => {
        try {
            console.log("UPDATE ITEM",item);
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                const token = localStorage.getItem('token');
                const response = await axios.post(`http://${ip}:${port}/userdata`, { token: token });
                const query = {
                    currentUser: response.data.data,
                    item: item
                };
                console.log(query, "query");
                const result = await axios.post(`http://${ip}:${port}/toggle-like-option`, query);
                console.log(result.data, "HIIII");
            } else {
                console.log("Fatal Error: User not logged in");
                return;
            }
        } catch (err) {
            console.log(err);
        }
    };
    const toggleLikeOption = (likedItem) => {
        console.log(likedItem);
        const isToggled = UpdateLikeOption(likedItem);

        setFilteredItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === likedItem) {
                    return { ...item, isFav: item.isFav ? 0 : 1 }; // Toggle the isFav property
                }
                return item;
            });
        });
    };
    const DeleteItem = async (removedItem) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            const isConfirmed = window.confirm('Are you sure you want to delete this item?');
            console.log(removedItem);
            if (isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(`http://${ip}:${port}/userdata`, { token: token });
                    const currentUser = response.data.data;
                    console.log(currentUser);
                    const deleteResponse = await axios.post(`http://${ip}:${port}/delete-item`, { currentUser:currentUser, item: { id: removedItem.id, ImageSrc:removedItem.ImageSrc }, token: token });
                    console.log(deleteResponse.data); // log the response from the backend
                    // If the backend confirms successful deletion, update the frontend
                    if (deleteResponse.data.success) {
                        const updatedWardrobeItems = wardrobeItems.filter(item => item.id !== removedItem.id);
                        setWardrobeItems(updatedWardrobeItems);

                        const updatedFilteredItems = filteredItems.filter(item => item.id !== removedItem.id);
                        setFilteredItems(updatedFilteredItems);
                    } else {
                        console.error('Failed to delete item from backend');
                        // You can handle the failure as per your application's requirements
                    }
                } catch (error) {
                    console.error('Error deleting item:', error);
                }
            }
        } else {
            console.log("User is not logged in");
        }
    };

    async function handleChoosePhoto(event){
        const selectedFile = event.target.files[0];
        setImage(selectedFile);
    };

    const handleResetInput = () => {
        // Reset the input element
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    };
    const saveImage = async () => {
        if (!image) {
            console.error('No image selected');
            return;
        }
        try{
            setloading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://${ip}:${port}/userdata`, {token: token})

            const formData = new FormData();

            formData.append("image", image);
            formData.append("currentUser", JSON.stringify(response.data.data));
            console.log('append done');
            await axios.post(
                `http://${ip}:${port}/upload-image`,
                formData,
                {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
            ).then(res => {
                console.log(res.data.message)
                console.log('Image uploaded successfully');
                // setImage(null);
                getAllItems();
                handleResetInput();
                setloading(false);
                // setImage(null);
                // setfileInputRef(null);
            })
            .catch(err => {
                setloading(false);
                console.log(err);
            })

            // setfileInputRef(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    return (
        <div>
            {loading ? (
                <div className="loading-container">
                     <img className='img-loading-gif' src="/white-loading.gif" alt="" />
                </div>
            ):(
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2%' }}>
                    <div className="vertical-filters-filters categories-container">
                        <div>
                            <span className="vertical-filters-header">Categories</span>
                            <ul className="categories-list">
                                {Tags.map((tag, index) => (
                                    <li key={index}>
                                        <label className="common-customCheckbox vertical-filters-label">
                                            <input
                                                type="checkbox"
                                                value={tag}
                                                checked={selectedTags.includes(tag)}
                                                onChange={() => toggleTag(tag)}
                                                />
                                            {tag}
                                            <span className="categories-num">({filteredItems.filter(item => item.Tags.includes(tag)).length})</span>
                                            <div className="common-checkboxIndicator"></div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {uploading && (
                            <div className="div-img-upload">
                            {/* <form ref={fileInputRef}> */}
                                <input type="file" ref={fileInputRef} onChange={handleChoosePhoto} accept="image/jpeg image/png"/>
                                <button onClick={saveImage}>Upload</button>
                            {/* </form> */}
                            </div>
                        )}
                        {!uploading && (
                            <button className="button-add-item" onClick={() => setuploading(true)}>Add Item</button>
                        )}
                    </div>
                    {(filteredItems.length > 0) ? (
                        <div className="wardrobe">
                            {filteredItems.map(item => (
                                <Card
                                key={item.id}
                                item={item}
                                toggleLikeOption={toggleLikeOption}
                                deleteItem={DeleteItem}
                                />
                            ))}
                        </div>
                    ) : (
                          selectedTags.length > 0 ? (
                            <div className="div-empty-wardrobe-container">
                              <img className='img-empty-wardrobe' src="/empty-wardrobe.png" alt="empty-wardrobe.png" />
                              <div className="div-empty-wardrobe-text">
                                No clothes match the selected filters
                              </div>
                            </div>
                          ) : (
                            <div className="div-empty-wardrobe-container">
                              <img className='img-empty-wardrobe' src="/empty-wardrobe.png" alt="empty-wardrobe.png" />
                              <div className="div-empty-wardrobe-text">
                                Start Your Fashion Journey  <br></br>
                                Add Clothes to your wardrobe Now!
                              </div>
                            </div>
                          )
                        )
                    }
                </div>
            )}
        </div>

    );

};

export default Wardrobe;
