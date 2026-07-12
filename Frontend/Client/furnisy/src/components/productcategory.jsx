import { useRef, useEffect, useState } from "react";
import "../assets/style/categoryptoduct.css";

const Catagory = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/product-category/all")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="category-container">
      <h1>Shop by Category</h1>
      <p>Discover everything you need through the categories!</p>

      <div className="category-grid" ref={scrollRef}>
        {categories.map((cat) => (
          <a
            key={cat.category_id}
            href={`/category/${cat.category_id}`}
            className="category-item"
          >
            <img
              src={`http://localhost:5000/uploads/${encodeURIComponent(cat.image)}`}
              alt={cat.category_name}
            />
            <p>{cat.category_name}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Catagory;