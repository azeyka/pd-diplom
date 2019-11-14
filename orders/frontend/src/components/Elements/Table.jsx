import React from "react";
import PropTypes from "prop-types";

function Table({ className, children }) {
  console.log(children);
  return (
    <table className={`table ${className}`}>
      <thead>{children[0]}</thead>
      <tbody>{children.slice(1)}</tbody>
    </table>
  );
}

Table.propTypes = {
  className: PropTypes.string
};

export default Table;
