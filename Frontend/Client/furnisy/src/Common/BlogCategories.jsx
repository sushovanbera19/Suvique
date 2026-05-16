import React from "react";

const categories = [
  "Furniture",
  "Living Room",
  "Decoration",
  "Office",
  "Accessories"
];

const BlogCategories = () => {
  return (
    <div className="sidebar-box">
      <h4>Categories</h4>
      <ul>
        {categories.map((cat, i) => (
          <li key={i}>{cat}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogCategories;
