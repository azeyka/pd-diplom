import React from "react";
import PropTypes from "prop-types";

/**
 * Компонент создает элементы списка.
 */

function ListItem(props) {
  return <li className={props.className}>{props.children}</li>;
}

ListItem.propTypes = {
  className: PropTypes.string
};

export default ListItem;
