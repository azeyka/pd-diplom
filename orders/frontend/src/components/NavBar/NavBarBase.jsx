import React from "react";
import MainLogo from "./MainLogo";

function NavBarBase(props) {
  return (
    <header className="header">
      <div className="d-flex flex-column flex-md-row flex-lg-row align-items-center p-2 px-md-4 mb-3 bg-dark border-bottom shadow-sm">
        <MainLogo />
        <nav className="d-flex flex-column flex-sm-row flex-md-row align-items-center text-center">
          {props.children}
        </nav>
      </div>
    </header>
  );
}

export default NavBarBase;
