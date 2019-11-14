import React from "react";
import PropTypes from "prop-types";
import List from "./List";
import ListItem from "./ListItem";
import ButtonStyledLinkOrButton from "./ButtonStyledLinkOrButton";

function NavTabs({ tabsList, onSwitch, switcher }) {
  return (
    <List items={tabsList} className="nav nav-tabs">
      {items =>
        items.map(tab => (
          <ListItem className="nav-item" key={tab.id}>
            <ButtonStyledLinkOrButton
              className={
                tab.id === switcher
                  ? "nav-link font-weight-bold active"
                  : "nav-link"
              }
              data-toggle="tab"
              onClick={() => onSwitch(tab.id)}
            >
              {tab.name}
            </ButtonStyledLinkOrButton>
          </ListItem>
        ))
      }
    </List>
  );
}

NavTabs.propTypes = {
  tabsList: PropTypes.array.isRequired,
  onSwitch: PropTypes.func.isRequired,
  switcher: PropTypes.number.isRequired
};

export default NavTabs;
