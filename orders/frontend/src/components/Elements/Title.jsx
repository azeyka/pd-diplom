import React from "react";
import PropTypes from "prop-types";

function Title({ children, className }) {
  return <h1 className={className}>{children}</h1>;
}

Title.propTypes = {
  className: PropTypes.string
};

Title.defaultProps = {
  className: "mb-5 title text-center"
};

export default Title;
