import React from "react";
import PropTypes from "prop-types";
import no_img from "../../../../no-image.jpg";

function ProductCardImg({ src, className }) {
  return (
    <img
      className={className}
      width="100%"
      height="150"
      src={src}
      alt="card_img"
    />
  );
}

ProductCardImg.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string
};

ProductCardImg.defaultProps = {
  className: "img-fluid bd-placeholder-img card-img-top",
  src: no_img
};

export default ProductCardImg;
