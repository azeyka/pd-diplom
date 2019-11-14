import React, { useCallback, useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import ProductCard from "./ProductCard/ProductCard";
import GetProducts from "../../../requests/GetProducts";
import ProductCardImg from "./ProductCard/ProductCardImg";
import ProductCardBody from "./ProductCard/ProductCardBody";

function CategoryProducts({ category, isEmpty, setisEmpty }) {
  const [activePageNum, setActivePageNum] = useState(1);
  const [activePageProducts, setActivePageProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const itemsCountPerPage = 4,
    pageRangeDisplayed = 5;

  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );

  const getProductList = () => {
    const onSucsess = info => {
      if (info.length > 0) {
        setProductList(info);
        setActivePageProducts(getPage(info, activePageNum));
        setisEmpty(false);
      }
    };

    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    const params = [{ name: "category_id", value: category.id }];

    GetProducts(onSucsess, onFail, params);
  };

  const getPage = (list, page) => {
    const end = itemsCountPerPage * page,
      start = end - itemsCountPerPage;
    return list.slice(start, end);
  };

  const handlePageChange = pageNumber => {
    setActivePageNum(pageNumber);
    setActivePageProducts(getPage(productList, pageNumber));
  };

  useEffect(() => {
    getProductList();
  }, []);

  const paginatorParams = {
    itemsCountPerPage,
    pageRangeDisplayed,
    onChange: handlePageChange,
    totalItemsCount: productList.length,
    hideFirstLastPages: true,
    activePage: activePageNum,
    innerClass: "pagination justify-content-center",
    itemClass: "page-item",
    activeClass: "active",
    prevPageText: "Назад",
    nextPageText: "Вперед",
    linkClass: "page-link"
  };

  return (
    <div>
      {!isEmpty ? (
        <div>
          <div className="card-deck m-3 text-center shadow-sm">
            {activePageProducts.map(product => (
              <ProductCard key={product.id}>
                <ProductCardImg />
                <ProductCardBody product={product} />
              </ProductCard>
            ))}
          </div>
          <Pagination {...paginatorParams} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

CategoryProducts.propTypes = {
  category: PropTypes.object.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  setisEmpty: PropTypes.func.isRequired
};

export default CategoryProducts;
