import { Link } from "react-router-dom";

const Dropdown = ({ items }) => {
  return (
    <ul className="dropdown">
      {items.map((sub, idx) => (
        <li key={idx}>
          {sub.path ? (
            <Link to={sub.path}>{sub.label}</Link>
          ) : (
            sub
          )}
        </li>
      ))}
    </ul>
  );
};

export default Dropdown;