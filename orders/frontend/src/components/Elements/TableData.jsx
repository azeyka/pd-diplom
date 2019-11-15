import React from "react";
import PropTypes from "prop-types";

function TableData({ children, size, isHead, className, colspan }) {
  const colSizeClassname = size ? `col-${size}` : "";
  return isHead ? (
    <th className={`${colSizeClassname} ${className}`} colSpan={colspan}>
      {children}
    </th>
  ) : (
    <td className={`${colSizeClassname} ${className}`} colSpan={colspan}>
      {children}
    </td>
  );
}

TableData.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  isHead: PropTypes.bool
};

TableData.defaultProps = {
  isHead: false,
  className: "",
  colspan: 1
};

export default TableData;
