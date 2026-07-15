import React, { useState } from "react";
import "../assets/style/ShowroomPage.css";
import { AiOutlinePushpin, AiOutlinePhone } from "react-icons/ai";
import { LocateFixed } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "../context/LanguageContext";

// Showroom data
const showroomData = [
    {
        id: 1,
        name: "Savique Furniture Austin",
        address: "301 W. Second St., Austin, TX",
        phone: "+1 559-278-4240",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        name: "Savique Furniture Phoenix",
        address: "200 W. Washington St, Phoenix, AZ",
        phone: "+1 559-278-4240",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
    
    {
        id: 4,
        name: "Savique Furniture Phoenix",
        address: "City Hall 121 N.LaSalle Street Chicago, IL",
        phone: "+1 559-278-4240",
        image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80",
    },
];

// Dynamic filter options
const filterOptions = ["All", "Austin", "Phoenix", "Chicago", "Phoenix", "Texas"];

const ShowroomPage = () => {
    const { t } = useTranslation();
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [searchText, setSearchText] = useState("");

    // Filter showrooms based on search & selected location
    const filteredShowrooms = showroomData.filter((store) => {
        if (
            selectedLocation !== "All" &&
            !store.address.toLowerCase().includes(selectedLocation.toLowerCase())
        )
            return false;

        if (
            searchText &&
            !store.name.toLowerCase().includes(searchText.toLowerCase()) &&
            !store.address.toLowerCase().includes(searchText.toLowerCase())
        )
            return false;

        return true;
    });

    return (
        <div className="pageContainer">
            <h2 className="heading">{t("showroom.heading")}</h2>

            <div className="mainContent">
                {/* Left Column: Filters + Store List */}
                <div className="leftColumn">
                    <LocationFilters
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        t={t}
                    />
                    <StoreList showrooms={filteredShowrooms} t={t} />
                </div>

                {/* Right Column: Map */}
                <MapSection />
            </div>
        </div>
    );
};

// Filters Component
const LocationFilters = ({ selectedLocation, setSelectedLocation, searchText, setSearchText, t }) => (
    <div className="filterContainer">
        {/* Search input */}
        <div className="searchInputWrapper">
            <span className="searchIcon"> <FaSearch /></span>
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
                onClick={() => {
                    setSearchText("");
                    setSelectedLocation("All");
                }}
            >
                <LocateFixed/>
            </button>
        </div>


        {/* Filter buttons */}
        <div className="filterButtons">
            {filterOptions.map((filter) => (
                <button
                    key={filter}
                    className={`filterButton ${selectedLocation === filter ? "activeFilter" : ""}`}
                    onClick={() => setSelectedLocation(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    </div>
);

// Store List
const StoreList = ({ showrooms, t }) => (
    <div className="storeList">
        {showrooms.length === 0 ? (
            <div>{t("showroom.noStores")}</div>
        ) : (
            showrooms.map((store) => <StoreItem key={store.id} store={store} t={t} />)
        )}
    </div>
);

// Single Store Item: text left, image right, icons inside text
const StoreItem = ({ store, t }) => (
    <div className="storeItem">
        <div className="storeInfo">
            <h4 style={{ margin: "0 0 5px 0" }}>
                {store.name}
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <AiOutlinePushpin /> {store.address}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                <AiOutlinePhone /> {store.phone}
            </div>
            <div className="showroomDetails">{t("showroom.details")}</div>
        </div>
        <img src={store.image} alt={store.name} className="storeImage" />
    </div>
);

// Map Section
const MapSection = () => (
    <div className="mapContainer">
        <img
            src="https://www.google.com/maps?q=California%20City%20USA&output=embed"
            alt="Map"
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
    </div>
);

export default ShowroomPage;
