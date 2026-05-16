import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumb = () => {

  const location = useLocation();

  // split route
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x);

  return (
    <div className="breadcrumb">

      {pathnames.map((value, index) => {

        const to =
          "/" + pathnames.slice(0, index + 1).join("/");

        // format text
        const name =
          value.charAt(0).toUpperCase() +
          value.slice(1);

        return (
          <div
            key={to}
            className="breadcrumb-item"
          >
            {index !== 0 && (
              <FiChevronRight className="crumb-icon" />
            )}

            {index === pathnames.length - 1 ? (
              <span className="active">{name}</span>
            ) : (
              <Link to={to}>{name}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;