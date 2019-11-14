import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import PropTypes from "prop-types";
import UserProductForm from "./UserProductForm";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";
import Col from "../../Elements/Col";
import Title from "../../Elements/Title";
import Row from "../../Elements/Row";
import DeleteProduct from "../../../requests/DeleteProduct";

function UserProduct(props) {
  const { product, reload } = props;
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [formIsShown, setformIsShown] = useState(false);
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

  useEffect(() => {
    setproductName(product.product.name);
    setproductCategory(product.product.category);
    setproductInfo(product);
    setproductParameters(product.product_parameters);
  }, []);

  const handleClickEdit = () => {
    setformIsShown(prevState => !prevState);
  };

  const handleClickDelete = () => {
    const onSucsess = () => reload();
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    DeleteProduct(onSucsess, onFail, [
      { name: "id", value: productInfo.external_id }
    ]);
  };

  return (
    <>
      <div className="bg-light d-flex justify-content-between lh-condensed pl-3 pr-3">
        <Col className="col-10 p-1">
          <Title className="h6">
            <span className="font-weight-bold">
              [ID:{productInfo.external_id}]{" "}
            </span>
            {productName}
          </Title>

          <small className="row text-muted m-0">
            Категория: {productCategory.name}, Модель: {productInfo.model},
            Количество: {productInfo.quantity}, Цена: {productInfo.price},
            Розничная цена: {productInfo.price_rrc},
          </small>

          <small className="row text-muted m-0">
            {productParameters.map(
              parameter => parameter.parameter + ": " + parameter.value + ", "
            )}
          </small>
        </Col>

        <Row className="p-0">
          <ButtonStyledLinkOrButton
            className="btn bg-light text-muted m-1 p-0"
            onClick={handleClickEdit}
          >
            <i className="material-icons">edit</i>
          </ButtonStyledLinkOrButton>
          <ButtonStyledLinkOrButton
            className="btn bg-light text-muted m-1 p-0"
            onClick={handleClickDelete}
          >
            <i className="material-icons">delete_forever</i>
          </ButtonStyledLinkOrButton>
        </Row>
      </div>

      {formIsShown ? (
        <UserProductForm
          productName={productName}
          productCategory={productCategory}
          setproductCategory={setproductCategory}
          productInfo={productInfo}
          setproductInfo={setproductInfo}
          setproductName={setproductName}
          productParameters={productParameters}
          setproductParameters={setproductParameters}
          setformIsShown={setformIsShown}
          reload={reload}
        />
      ) : (
        ""
      )}
    </>
  );
}

UserProduct.propTypes = {
  product: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired
};

export default UserProduct;
