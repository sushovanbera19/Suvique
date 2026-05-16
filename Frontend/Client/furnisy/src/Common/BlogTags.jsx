import React from "react";

const tags = ["Furniture", "Bedroom", "Living room", "Decor", "Office"];

const BlogTags = () => {
  return (
    <div className="sidebar-box">
      <h4>Tags</h4>
      <div className="tag-list">
        {tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogTags;
