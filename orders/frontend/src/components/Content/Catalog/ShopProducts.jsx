import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import GetProducts from "../../../requests/GetProducts";
import GetCategories from "../../../requests/GetCategories";
import GetShopInfo from "../../../requests/GetShopInfo";
import ProductCard from "./ProductCard/ProductCard";
import ProductCardImg from "./ProductCard/ProductCardImg";
import ProductCardBody from "./ProductCard/ProductCardBody";
import Title from "../../Elements/Title";
import ShopProductFilters from "./ShopProductFilters";

function ShopProducts(props) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [isShopExist, setisShopExist] = useState(true);
  const [productList, setProductList] = useState([]);
  const [shopInfo, setshopInfo] = useState({ name: "" });
  const [categories, setcategories] = useState([]);
  const id = props.match.params.id;

  const onFail = err => {
    showNotification({ message: err.toString(), isSuccess: false });
  };

  const getProductList = category_id => {
    const onSucsess = info => {
      if (info.length > 0) {
        setProductList(info);
      }
    };

    const params = [
      {
        name: "shop_id",
        value: id
      }
    ];

    if (category_id) {
      params.push({
        name: "category_id",
        value: category_id
      });
    }

    GetProducts(onSucsess, onFail, params);
  };

  const getCategories = id => {
    const onSucsess = info => {
      setcategories(info);
    };

    GetCategories(onSucsess, onFail, id);
  };

  const getShopInfo = id => {
    const onSucsess = info => {
      setshopInfo(info);
      getProductList();
      getCategories(id);
    };

    const onFail = err => {
      setisShopExist(false);
    };

    GetShopInfo(onSucsess, onFail, id);
  };

  const handleClick = id => {
    getProductList(id);
  };

  useEffect(() => {
    getShopInfo(id);
  }, []);

  return (
    <section className="m-3">
      <header>
        {isShopExist ? (
          <>
            <Title className="h2 mb-0">{`Магазин "${shopInfo.name}"`}</Title>
            {shopInfo.url ? (
              <a href={shopInfo.url}>{shopInfo.url}</a>
            ) : (
              <a href={`mailto:${shopInfo.email}`}>{shopInfo.email}</a>
            )}
          </>
        ) : (
          <Title className="h2">Магазина не существует :(</Title>
        )}
      </header>

      <ShopProductFilters
        handleClick={handleClick}
        productList={productList}
        categories={categories}
      />

      <section className="card-deck text-center shadow-sm">
        {productList.map(product => (
          <ProductCard key={product.id} product={product}>
            <ProductCardImg />
            <ProductCardBody product={product} />
          </ProductCard>
        ))}
      </section>
    </section>
  );
}

export default ShopProducts;
