import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import UserProduct from "./UserProduct";
import GetProducts from "../../../requests/GetProducts";
import List from "../../Elements/List";
import ListItem from "../../Elements/ListItem";
import AddNewButtons from "./AddNewButtons";

function UserShopProducts() {
  const { dispatch, state } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );

  const [products, setProducts] = useState([]);
  const [isEmpty, setisEmpty] = useState(true);
  const [isAddNewProductActive, setisAddNewProductActive] = useState(false);

  const getProductList = () => {
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    const onSucsess = info => {
      if (info.length > 0) {
        setProducts(info);
        setisEmpty(false);
      } else {
        setisEmpty(true);
      }
    };
    GetProducts(onSucsess, onFail, [
      { name: "shop_id", value: state.userInfo.shop.id }
    ]);
  };

  useEffect(() => {
    getProductList();
  }, []);

  const handleClickAddNewProduct = () => {
    setisAddNewProductActive(true);
  };

  return (
    <>
      <List items={products} className="list-group m-3">
        {items => (
          <>
            {isEmpty ? (
              <ListItem className="list-group-item">
                Не добавлено ни одного товара
              </ListItem>
            ) : (
              items.map(product => (
                <ListItem className="list-group-item bg-light">
                  <UserProduct
                    key={product.id}
                    product={product}
                    reload={getProductList}
                  />
                </ListItem>
              ))
            )}
          </>
        )}
      </List>

      <AddNewButtons
        handleClickAddNewProduct={handleClickAddNewProduct}
        getProductList={getProductList}
        isAddNewProductActive={isAddNewProductActive}
        setisAddNewProductActive={setisAddNewProductActive}
      />
    </>
  );
}

export default UserShopProducts;
