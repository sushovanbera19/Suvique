import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../../assets/style/Header.css";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import SearchModal from "./SearchModal";
import MobileSidebar from "./MobileSidebar";
import { menuItems, rightMenuItems } from "./menuData";
import Flag from "../../../public/images/united-states.png";


const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [countries, setCountries] = useState([]);
    const [languages, setLanguages] = useState([]);
    useEffect(() => {
        fetch(
            "https://restcountries.com/v3.1/all?fields=name,languages,flags"
        )
            .then(res => res.json())
            .then(data => {
                setCountries(
                    data.map(c => c.name.common)
                );
                let langs = new Set();
                data.forEach(c => {
                    if (c.languages) {
                        Object.values(c.languages)
                            .forEach(l => langs.add(l));
                    }
                });
                setLanguages([...langs]);
            });
    }, []);



    const dynamicRight = [

        {
            name: countries[0] || "USD",
            flag: Flag,
            subMenu: countries

        },
        {
            name: languages[0] || "EN",
            flag: Flag,
            subMenu: languages
        },
        ...rightMenuItems
    ];
    return (
        <header className="topHeader">
            <div className="hamburger" onClick={() => setSidebarOpen(true)}><FontAwesomeIcon icon={faBars} /> </div>
            <LeftMenu menuItems={menuItems} />
            <div className="center-logo"><Link to="/"><img src="/images/logo.png" alt="logo" /></Link> </div>
            <RightMenu rightMenuItems={dynamicRight} openSearchModal={() => setSearchOpen(true)} />
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
            <MobileSidebar open={sidebarOpen} menuItems={menuItems} rightMenuItems={dynamicRight} onClose={() => setSidebarOpen(false)} />
        </header>
    );
};


export default Header;