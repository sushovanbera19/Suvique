import { useRef, useState, useEffect } from "react";
import "../assets/style/VideoSlider.css";

const API = "http://localhost:5000";

const VideoSlider = () => {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/videos/active`)
            .then((r) => r.json())
            .then((d) => { if (d.success && d.data.length > 0) setVideos(d.data); })
            .catch(() => {});
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const resolvePath = (p) => {
        if (!p) return "";
        if (p.startsWith("http")) return p;
        return p.startsWith("/") ? p : `/images/${p}`;
    };

    if (videos.length === 0) return null;

    return (
        <div
            className="slider-container"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            {videos.map((item) => (
                <div className="slider-item" key={item.id}>
                    {playingVideo === item.id ? (
                        <video
                            src={resolvePath(item.video_url)}
                            controls
                            autoPlay
                            loop
                            muted
                            width="1000px"
                            height="500px"
                            style={{ borderRadius: "12px", objectFit: "cover" }}
                            onEnded={() => setPlayingVideo(null)}
                        />
                    ) : (
                        <div
                            className="video-thumbnail"
                            style={{
                                backgroundImage: `url(${resolvePath(item.thumbnail)})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                width: "1000px",
                                height: "500px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "12px",
                            }}
                            onClick={() => setPlayingVideo(item.id)}
                        >
                            <button
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "#fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="60"
                                    height="60"
                                    viewBox="0 0 24 24"
                                    fill="gray"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VideoSlider;
