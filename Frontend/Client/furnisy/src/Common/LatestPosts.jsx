import React from "react";
import Blogimage from "../../public/images/blog-3.webp";

const posts = [
  "Modern Home Furniture",
  "Modern Toilet Chair",
  "Dining Table With Chair",
  "Large Double Sofa"
];

const LatestPosts = () => {
  return (
    <div className="sidebar-box">
      <h4>Latest Posts</h4>

      {posts.map((title, i) => (
        <div className="latest-post" key={i}>
          <img src={Blogimage} alt="" />
          <div>
            <p>{title}</p>
            <span>24 May 2025</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestPosts;
