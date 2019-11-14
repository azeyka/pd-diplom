import React from "react";
import PropTypes from "prop-types";

export default function Row({ children, className }) {
  return <div className={`row ${className}`}>{children}</div>;
}

Row.propTypes = {
  className: PropTypes.string
};

Row.defaultProps = {
  className: ""
};
