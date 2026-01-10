import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {

  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!hasMore || loading) return

    setLoading(true)

    axios.get(`http://localhost:3000/api/food?page=${page}`, {
      withCredentials: true
    })
      .then(res => {
        if (res.data.foodItems.length === 0) {
          setHasMore(false) 
          return
        }

        setVideos(prev => [...prev, ...res.data.foodItems])
      })
      .catch(err => {
        console.error("FETCH ERROR:", err)
      })
      .finally(() => {
        setLoading(false)
      })

  }, [page])

  // 🔥 INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setPage(prev => prev + 1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ❤️ LIKE / UNLIKE
  async function likeVideo(item) {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: item._id },
        { withCredentials: true }
      )

      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { ...v, likeCount: v.likeCount + (res.data.like ? 1 : -1) }
            : v
        )
      )
    } catch (err) {
      console.error("LIKE ERROR:", err.response?.data || err.message)
    }
  }

  // 🔖 SAVE / UNSAVE
  async function saveVideo(item) {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      )

      setVideos(prev =>
        prev.map(v =>
          v._id === item._id
            ? { ...v, savesCount: v.savesCount + (res.data.save ? 1 : -1) }
            : v
        )
      )
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err.message)
    }
  }

  return (
    <>
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No videos available."
      />

      {/* 🔄 LOADER */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '16px', color: '#fff' }}>
          Loading more videos...
        </div>
      )}

      {/* 🚫 END MESSAGE */}
      {!hasMore && (
        <div style={{ textAlign: 'center', padding: '16px', color: '#aaa' }}>
          You’ve reached the end 👀
        </div>
      )}
    </>
  )
}

export default Home