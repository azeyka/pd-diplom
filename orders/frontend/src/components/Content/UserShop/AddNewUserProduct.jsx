import React, { useState } from "react";
import PropTypes from "prop-types";
import UserProductForm from "./UserProductForm";

function AddNewUserProduct(props) {
  const { setisAddNewProductActive, reload } = props;
  const [productName, setproductName] = useState("");
  const [productCategory, setproductCategory] = useState({
    id: "",
    name: ""
  });

  const [productInfo, setproductInfo] = useState({
    external_id: "",
    model: "",
    quantity: "",
    price: "",
    price_rrc: ""
  });

  const [productParameters, setproductParameters] = useState([]);

  return (
    <div className="list-group-item bg-light ">
      <UserProductForm
        productName={productName}
        setproductName={setproductName}
        productCategory={productCategory}
        setproductCategory={setproductCategory}
        productInfo={productInfo}
        setproductInfo={setproductInfo}
        productParameters={productParameters}
        setproductParameters={setproductParameters}
        setformIsShown={setisAddNewProductActive}
        reload={reload}
      />
    </div>
  );
}

AddNewUserProduct.propTypes = {
  setisAddNewProductActive: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired
};

export default AddNewUserProduct;
