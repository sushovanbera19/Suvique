import { useRef, useEffect } from "react";          // useRef for DOM reference, useEffect for side effects
import image1 from "../../public/images/img-1 (1).webp"; // Import image1 from public folder
import image2 from "../../public/images/img-2.webp";     // Import image2 from public folder
import image3 from "../../public/images/img-3.webp";     // Import image3 from public folder
import image4 from "../../public/images/img-4.webp";     // Import image4 from public folder
import image5 from "../../public/images/img-5.webp";     // Import image5 from public folder
import "../assets/style/categoryptoduct.css";           // Import CSS file for styling

// Array of categories with image, title, and link
const categories = [
  { img: image1, title: "Bed Room", link: "/category1" },         // Category 1 object
  { img: image2, title: "Living Room", link: "/category2" },     // Category 2 object
  { img: image3, title: "Office", link: "/category3" },          // Category 3 object
  { img: image4, title: "Accessories", link: "/category4" },     // Category 4 object
  { img: image5, title: "Kitchen Accessories", link: "/category5" }, // Category 5 object
];

const Catagory = () => {
  const scrollRef = useRef(null); // Create a ref to access the category-grid DOM element

  useEffect(() => {               // useEffect runs once after component mounts
    const el = scrollRef.current; // Get the DOM element from the ref

    const onWheel = (e) => {      // Function to handle mouse wheel event
      e.preventDefault();         // Prevent default vertical scrolling
      el.scrollLeft += e.deltaY;  // Scroll horizontally by the vertical wheel value
    };

    el.addEventListener("wheel", onWheel); // Attach wheel event listener to element

    return () => el.removeEventListener("wheel", onWheel); // Cleanup on unmount
  }, []); // Empty dependency array means it runs only once

  return (
    <div className="category-container">  {/* Main container for the category section */}
      <h1>Shop by Category</h1>           {/* Heading */}
      <p>Discover everything you need through the categories!</p> {/* Subheading */}

      <div className="category-grid" ref={scrollRef}> {/* Scrollable grid container */}
        {categories.map((cat, index) => (              // Loop through each category
          <a key={index} href={cat.link} className="category-item"> {/* Link item */}
            <img src={cat.img} alt={cat.title} />     {/* Category image */}
            <p>{cat.title}</p>                        {/* Category title */}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Catagory; // Export the component
