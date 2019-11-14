import React from "react";
import PropTypes from "prop-types";

function SectionLink({ className, href, materialIcon, children }) {
  return (
    <a className={className} href={href}>
      {materialIcon ? (
        <span className="align-middle">
          <i className="material-icons">{materialIcon}</i>
        </span>
      ) : (
        ""
      )}

      <p className="mb-0">{children}</p>
    </a>
  );
}

SectionLink.defaultProps = {
  className: "p-2 text-white"
};

SectionLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  materialIcon: PropTypes.string
};

export default SectionLink;
