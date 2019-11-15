import React from "react";
import PropTypes from "prop-types";

/**
 * Компонент создает список. В props принимает название класса и список элементов, которые потом передаст для итерации в компонент ListItem.
 */

function List(props) {
  return <ul className={props.className}>{props.children(props.items)}</ul>;
}

List.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired
};

export default List;
