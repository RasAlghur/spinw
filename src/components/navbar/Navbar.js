import { Link } from 'react-router-dom';
import React, { useState } from "react";
import NavItem from "./NavItem";
import './navbar.css';
import { ConnectWallet } from "@thirdweb-dev/react";
import flokiSpin from './flokispin-icon.png'

const MENU_LIST = [
  { text: 'Home', url: '/' },
  { text: 'Play', url: '/play' },
  { text: 'Explore', url: '/explore' },
  { text: 'Dashboard', url: '/dashboard' },
];

const NavMenu = () => {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <header>
      <nav className={`nav`}>

        <Link to='/'>
          <h1 className="logo"><img src={flokiSpin} alt='logo' width={20} height={20} /> Floki<span className='logoSpan'>spin</span></h1>
        </Link>

        <div
          onClick={() => setNavActive(!navActive)}
          className={`nav__menu-bar`}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div onClick={() => { setNavActive(false); }} className=
          {`${navActive ? "active" : ""} nav__menu-list`}>
          {MENU_LIST.map((menu, idx) => (
            <div onClick={() => { setActiveIdx(idx); setNavActive(false); }} key={idx}>
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
          ))}
        </div>

        <div className="connect">
          <ConnectWallet />
        </div>

      </nav>
    </header>
  );
};

export default NavMenu;
