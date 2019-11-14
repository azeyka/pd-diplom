import React, { useState } from "react";
import PropTypes from "prop-types";
import AddNewUserProduct from "./AddNewUserProduct";
import AddYAMLProducts from "./AddYAMLProducts";

function AddNewButtons({
  handleClickAddNewProduct,
  getProductList,
  isAddNewProductActive,
  setisAddNewProductActive
}) {
  const [isLoading, setisLoading] = useState(false);

  return (
    <div className="d-flex flex-wrap m-3">
      <div className="col-12">
        {isAddNewProductActive ? (
          <AddNewUserProduct
            setisAddNewProductActive={setisAddNewProductActive}
            reload={getProductList}
          />
        ) : (
          <button
            className={`btn btn-outline-${
              isLoading ? "secondary" : "success"
            } align-self-start col-12`}
            onClick={handleClickAddNewProduct}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "+ Добавить новый товар"}
          </button>
        )}
      </div>

      <span className="text-muted text-center col-12 align-self-start mt-2 mb-2">
        ИЛИ
      </span>
      <AddYAMLProducts
        refreshProducts={getProductList}
        isLoading={isLoading}
        setisLoading={setisLoading}
      />
    </div>
  );
}

AddNewButtons.propTypes = {
  handleClickAddNewProduct: PropTypes.func.isRequired,
  getProductList: PropTypes.func.isRequired,
  isAddNewProductActive: PropTypes.bool.isRequired,
  setisAddNewProductActive: PropTypes.func.isRequired
};

export default AddNewButtons;
