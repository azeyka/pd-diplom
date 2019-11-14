import React from "react";
import PropTypes from "prop-types";

function TableRow({ className, children }) {
  return <tr className={className}>{children}</tr>;
}

TableRow.propTypes = {
  className: PropTypes.string
};

export default TableRow;
