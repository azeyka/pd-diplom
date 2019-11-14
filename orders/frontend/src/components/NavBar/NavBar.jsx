import React from "react";
import { useStore } from "../../store/useStore";
import NavBarBase from "./NavBarBase";
import SectionsLinkLoggedIn from "./SectionsLinkLoggedIn";
import SectionsLinkLoggedOut from "./SectionsLinkLoggedOut";

function NavBar() {
  const { state } = useStore();

  return (
    <NavBarBase>
      {state.token ? <SectionsLinkLoggedIn /> : <SectionsLinkLoggedOut />}
    </NavBarBase>
  );
}

export default NavBar;
