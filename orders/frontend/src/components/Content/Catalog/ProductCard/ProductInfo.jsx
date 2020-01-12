import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../../store/useStore";
import { Redirect } from "react-router-dom";
import GetProducts from "../../../../requests/GetProducts";
import AddToCart from "../../../../requests/ChangeCart";
import Container from "../../../Elements/Container";
import Title from "../../../Elements/Title";
import ProductCardImg from "./ProductCardImg";
import Col from "../../../Elements/Col";
import ButtonStyledLinkOrButton from "../../../Elements/ButtonStyledLinkOrButton";
import ProductParamsTable from "./ProductParamsTable";
import ProductMainInfoTable from "./ProductMainInfoTable";

function ProductInfo(props) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [isAuthenticated, setisAuthenticated] = useState(true);
  const id = props.match.params.id;
  const [product, setproduct] = useState({
    shop: { id: 0 },
    product: { name: "Название товара" }
  });
  const [productInfo, setproductInfo] = useState([
    {
      id: "",
      category: "",
      model: ""
    }
  ]);
  const [params, setparams] = useState([]);

  const addToCart = () => {
    const onSucsess = info =>
      showNotification({
        message: `Добавлено! Осталось ${info.remain}.`,
        isSuccess: true
      });
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    AddToCart(id, "+", false, onSucsess, onFail);
  };

  const handleClickAddToCart = () => {
    localStorage.getItem("username") ? addToCart() : setisAuthenticated(false);
  };

  const getProductList = () => {
    const onSucsess = info => {
      if (info.length > 0) {
        setproduct(info[0]);
        setparams(info[0].product_parameters);
        setproductInfo({
          "Код товара": info[0].external_id,
          Категория: info[0].product.category.name,
          Модель: info[0].model
        });
      }
    };

    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });

    const params = [
      {
        name: "product_id",
        value: id
      }
    ];

    GetProducts(onSucsess, onFail, params);
  };

  useEffect(() => {
    getProductList();
  }, []);

  if (!isAuthenticated) return <Redirect to="/login" />;
  return (
    <Container>
      <Title className="h4">{product.product.name}</Title>
      <Container className="mt-4 p-3 bg-light border rounded d-flex flex-wrap">
        <ProductCardImg
          className="img-fluid bd-placeholder-img col-md-6 p-0 border rounded"
          src={product.image ? product.image : undefined}
        />
        <Col className="col-md-6 align-self-center text-center">
          <Title className="pb-2">
            {product.price_rrc} <span className="text-muted">₽</span>
          </Title>
          <p>Доступно к заказу: {product.quantity} шт.</p>
          <ButtonStyledLinkOrButton
            className={`btn btn-lg btn-${
              product.quantity === 0 ? "danger" : "primary"
            } col-md-8 col`}
            onClick={handleClickAddToCart}
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
        </Col>
        <ProductMainInfoTable productInfo={productInfo} />
        <ProductParamsTable params={params} />
      </Container>
      <ButtonStyledLinkOrButton
        className="btn btn-block btn-sm btn-outline-primary mt-2 "
        href={`/shop/${product.shop.id}`}
      >
        Другие товары продавца
      </ButtonStyledLinkOrButton>
    </Container>
  );
}

export default ProductInfo;
