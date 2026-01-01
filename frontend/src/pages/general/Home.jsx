import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Like or Unlike a video

    async function likeVideo(item) {
    try {
        const response = await axios.post(
            "http://localhost:3000/api/food/like",
            { foodId: item._id },
            { withCredentials: true }
        );

        if (response.data.like) {
            setVideos(prev =>
                prev.map(v =>
                    v._id === item._id
                        ? { ...v, likeCount: v.likeCount + 1 }
                        : v
                )
            );
        } else {
            setVideos(prev =>
                prev.map(v =>
                    v._id === item._id
                        ? { ...v, likeCount: v.likeCount - 1 }
                        : v
                )
            );
        }
    } catch (err) {
        console.error("LIKE ERROR:", err.response?.data || err.message);
    }
}

    // Save or Unsave a video
    
    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home