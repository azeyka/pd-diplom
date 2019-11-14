import React, { useState } from "react";
import PropTypes from "prop-types";
import ActiveTab from "./ActiveTab";
import NavTabs from "./NavTabs";

function Tabs({ tabsList, localStorageName }) {
  const [switcher, setSwitcher] = useState(
    Number(localStorage.getItem(localStorageName)) || 1
  );

  const handleSwitch = id => {
    if (localStorageName) localStorage.setItem(localStorageName, id);
    setSwitcher(id);
    activeTab = tabsList.find(tab => tab.id === switcher);
  };

  let activeTab = tabsList.find(tab => tab.id === switcher);

  return (
    <div>
      <NavTabs
        tabsList={tabsList}
        onSwitch={handleSwitch}
        switcher={switcher}
      />
      <ActiveTab>{activeTab.component}</ActiveTab>
    </div>
  );
}

Tabs.propTypes = {
  tabsList: PropTypes.array.isRequired,
  localStorageName: PropTypes.string,
  handleSwitch: PropTypes.func
};

export default Tabs;
