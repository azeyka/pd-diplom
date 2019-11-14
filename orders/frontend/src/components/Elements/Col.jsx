import React from "react";
import PropTypes from "prop-types";

export default function Col({ children, className }) {
  return <div className={`col ${className}`}>{children}</div>;
}

Col.propTypes = {
  className: PropTypes.string
};

Col.defaultProps = {
  className: ""
};
