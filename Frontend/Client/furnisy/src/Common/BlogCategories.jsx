import React, { useEffect, useState } from "react";

const BlogCategories = ({
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}) => {

  const [categories, setCategories] = useState([]);

  useEffect(() => {

    const loadCategories = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/product-category/all"
        );

        const data = await res.json();

        setCategories(
          data.categories || data.data || data || []
        );

      } catch (err) {

        console.log(err);

      }

    };

    loadCategories();

  }, []);

  return (
    <div className="sidebar-box">

      <h4>Categories</h4>

      <ul>

        <li
          className={selectedCategory === "" ? "active" : ""}
          style={{ cursor: "pointer" }}
          onClick={() => {

            setSelectedCategory("");

            setCurrentPage(1);

          }}
        >
          All Categories
        </li>

        {categories.map((cat) => (

          <li
            key={cat.category_id}
            className={
              selectedCategory == cat.category_id
                ? "active"
                : ""
            }
            style={{ cursor: "pointer" }}
            onClick={() => {

              setSelectedCategory(cat.category_id);

              setCurrentPage(1);

            }}
          >
            {cat.category_name}
          </li>

        ))}

      </ul>

    </div>
  );
};

export default BlogCategories;