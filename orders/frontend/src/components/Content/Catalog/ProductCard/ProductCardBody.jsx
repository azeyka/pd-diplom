import React, { useCallback, useState } from "react";
import { useStore } from "../../../../store/useStore";
import { Redirect } from "react-router-dom";
import AddToCart from "../../../../requests/ChangeCart";
import PropTypes from "prop-types";
import ButtonStyledLinkOrButton from "../../../Elements/ButtonStyledLinkOrButton";
import Row from "../../../Elements/Row";
import Title from "../../../Elements/Title";
import Container from "../../../Elements/Container";

function ProductCardBody({ product }) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [isAuthenticated, setisAuthenticated] = useState(true);

  const addToCart = () => {
    const onSucsess = info =>
      showNotification({
        message: `Добавлено! Осталось ${info.remain}.`,
        isSuccess: true
      });
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    AddToCart(product.id, "+", false, onSucsess, onFail);
  };

  const handleClickAddToCart = () => {
    localStorage.getItem("username") ? addToCart() : setisAuthenticated(false);
  };

  if (!isAuthenticated) return <Redirect to="/login" />;
  return (
    <Container className="card-body">
      <Title className="h6 card-title text-truncate">
        <a href={`/products/${product.id}`}>{product.product.name}</a>
      </Title>
      <Row>
        <a href={`/shop/${product.shop.id}`} className="small container">
          {product.shop.name.toUpperCase()}
        </a>
      </Row>

      <small>Доступно к заказу: {product.quantity} шт.</small>

      <Title className="h4 pricing-card-title">{product.price_rrc}₽</Title>
      <ButtonStyledLinkOrButton
        onClick={handleClickAddToCart}
        className={`btn btn-${
          product.quantity === 0 ? "danger" : "primary"
        } m-0 col`}
        disabled={
          product.quantity === 0 ||
          product.shop.name === localStorage.getItem("shopName")
        }
      >
        {product.shop.name === localStorage.getItem("shopName")
          ? "Ваш товар"
          : product.quantity === 0
          ? "РАСПРОДАНО"
          : "В корзину"}
      </ButtonStyledLinkOrButton>
    </Container>
  );
}

ProductCardBody.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCardBody;
