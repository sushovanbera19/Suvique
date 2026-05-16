import "../assets/style/Topnav.css"

const Topnav = () => {
  return (
    <div className="mainTop">
      <div>
        <div>
          <p onClick={() => {

            console.log("Promo text clicked!");

          }}
          >
            15% Off On First Order - Sign Up Today
          </p>
        </div>
      </div>
      <div>
        <ul className="top-info">
          <li>info@furnify.com</li>
          <li>265 New Ave, California, USA</li>
          <li>(+0123) 2345 56789</li>
        </ul>
      </div>
    </div>
  );
}

export default Topnav;
