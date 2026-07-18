import React, { useState, useEffect } from "react";
import "../assets/style/ShowroomPage.css";
import { AiOutlinePushpin, AiOutlinePhone } from "react-icons/ai";
import { LocateFixed } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "../context/LanguageContext";

const API = "http://localhost:5000";

const ShowroomPage = () => {
  const { t } = useTranslation();
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchShowrooms();
  }, []);

  const fetchShowrooms = async () => {
    try {
      const res = await fetch(`${API}/api/showrooms/active`);
      const data = await res.json();
      if (data.success) setShowrooms(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cities = ["All", ...new Set(showrooms.map((s) => s.city))];

  const filteredShowrooms = showrooms.filter((store) => {
    if (selectedLocation !== "All" && store.city !== selectedLocation) return false;
    if (searchText &&
      !store.name.toLowerCase().includes(searchText.toLowerCase()) &&
      !store.address.toLowerCase().includes(searchText.toLowerCase())
    ) return false;
    return true;
  });

  return (
    <div className="pageContainer">
      <h2 className="heading">{t("showroom.heading")}</h2>

      <div className="mainContent">
        <div className="leftColumn">
          <LocationFilters
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            searchText={searchText}
            setSearchText={setSearchText}
            cities={cities}
            t={t}
          />
          {loading ? (
            <div className="showroom-loading">{t("common.loading")}</div>
          ) : (
            <StoreList showrooms={filteredShowrooms} t={t} />
          )}
        </div>

        <MapSection />
      </div>
    </div>
  );
};

const LocationFilters = ({ selectedLocation, setSelectedLocation, searchText, setSearchText, cities, t }) => (
  <div className="filterContainer">
    <div className="searchInputWrapper">
      <span className="searchIcon"><FaSearch /></span>
      <input
        type="text"
        placeholder={t("showroom.findNearest")}
        className="filterSearchInput"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        className="locationButton"
        type="button"
        onClick={() => { setSearchText(""); setSelectedLocation("All"); }}
      >
        <LocateFixed />
      </button>
    </div>

    <div className="filterButtons">
      {cities.map((city) => (
        <button
          key={city}
          className={`filterButton ${selectedLocation === city ? "activeFilter" : ""}`}
          onClick={() => setSelectedLocation(city)}
        >
          {city}
        </button>
      ))}
    </div>
  </div>
);

const StoreList = ({ showrooms, t }) => (
  <div className="storeList">
    {showrooms.length === 0 ? (
      <div className="showroom-empty">{t("showroom.noStores")}</div>
    ) : (
      showrooms.map((store) => <StoreItem key={store.id} store={store} t={t} />)
    )}
  </div>
);

const StoreItem = ({ store, t }) => (
  <div className="storeItem">
    <div className="storeInfo">
      <h4 style={{ margin: "0 0 5px 0" }}>{store.name}</h4>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <AiOutlinePushpin /> {store.address}
      </div>
      {store.phone && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
          <AiOutlinePhone /> {store.phone}
        </div>
      )}
      <div className="showroomDetails">{t("showroom.details")}</div>
    </div>
    <img
      src={store.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}
      alt={store.name}
      className="storeImage"
      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"; }}
    />
  </div>
);

const MapSection = () => (
  <div className="mapContainer">
    <iframe
      src="https://www.google.com/maps?q=United+States&output=embed"
      title="Map"
      style={{ width: "100%", height: "100%", border: 0, borderRadius: 10 }}
      allowFullScreen
      loading="lazy"
    />
  </div>
);

export default ShowroomPage;
