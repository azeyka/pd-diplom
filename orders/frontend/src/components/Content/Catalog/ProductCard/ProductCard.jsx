import React from "react";
import Col from "../../../Elements/Col";

function ProductCard({ children }) {
  return (
    <Col className="col-md-3 col-sm-6 col-12 p-0 d-flex align-items-stretch">
      <Col className="card col-12 m-1 p-0">{children}</Col>
    </Col>
  );
}

export default ProductCard;
