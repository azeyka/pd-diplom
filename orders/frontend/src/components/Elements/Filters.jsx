import React, { useState } from "react";
import PropTypes from "prop-types";
import List from "./List";
import ListItem from "./ListItem";

function Filters({ handleClick, filters }) {
  const [selected, setselected] = useState("Все");
  const setFilter = (event, id) => {
    event.preventDefault();
    handleClick(id);
    setselected(id ? filters.find(f => f.id === id).name : "Все");
  };
  return (
    <List className="list-inline" items={filters}>
      {items => (
        <>
          <ListItem className="list-inline-item mr-0">
            <a
              className={`badge badge-${
                selected === "Все" ? "primary" : "secondary"
              }`}
              href="/"
              onClick={event => setFilter(event)}
            >
              Все
            </a>
          </ListItem>
          {items.map(filter => (
            <ListItem key={filter.id} className="list-inline-item m-2">
              <a
                className={`badge badge-${
                  selected === filter.name ? "primary" : "secondary"
                }`}
                href="/"
                onClick={event => setFilter(event, filter.id)}
              >
                {filter.name}
              </a>
            </ListItem>
          ))}
        </>
      )}
    </List>
  );
}

Filters.propTypes = {
  handleClick: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired
};

export default Filters;
