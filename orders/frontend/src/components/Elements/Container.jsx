import React from "react";
import PropTypes from "prop-types";

function Container({ children, className }) {
  return <div className={`container ${className}`}>{children}</div>;
}

Container.propTypes = {
  className: PropTypes.string
};

Container.defaultProps = {
  classname: "mt-3"
};

export default Container;
