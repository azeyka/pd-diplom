import React from "react";
import PropTypes from "prop-types";

function ButtonStyledLinkOrButton({
  className,
  href,
  onClick,
  type,
  disabled,
  children
}) {
  return (
    <>
      {href ? (
        <a className={className} href={href} disabled={disabled}>
          {children}
        </a>
      ) : (
        <button
          type={type}
          className={className}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </>
  );
}

ButtonStyledLinkOrButton.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

ButtonStyledLinkOrButton.defaultProps = {
  className: "btn btn-outline-primary ml-1",
  disabled: false,
  type: "button"
};

export default ButtonStyledLinkOrButton;
