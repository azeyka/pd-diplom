import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "../../../store/useStore";
import GetCart from "../../../requests/GetCart";
import Title from "../../Elements/Title";

import Ordering from "../Ordering/Ordering";
import CartList from "./CartList";
import Row from "../../Elements/Row";
import Container from "../../Elements/Container";

function Cart() {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [cartList, setcartList] = useState([]);
  const [totalSumm, settotalSumm] = useState(0);
  const [isOdering, setisOdering] = useState(false);

  const getCart = () => {
    const onSucsess = info => {
      setcartList(info.cart.items);
      settotalSumm(info.totalSumm);
    };

    const onFail = err => {
      showNotification({ message: err.toString(), isSuccess: false });
    };

    GetCart(onSucsess, onFail);
  };

  useEffect(() => {
    getCart();
  }, []);

  if (isOdering) return <Ordering cartList={cartList} totalSumm={totalSumm} />;
  return (
    <Container>
      <Row>
        <Title className="d-flex h4 justify-content-between align-items-center mb-3">
          <span className="text-muted">Ваша корзина</span>
        </Title>

        {cartList.length === 0 ? (
          <div className="container p-0">
            <h6 className="text-muted">Пусто :(</h6>
            <small className="text-muted">
              Добавьте товары из <a href="/catalog">каталога</a>.
            </small>
          </div>
        ) : (
          <CartList
            cartList={cartList}
            setisOdering={setisOdering}
            getCart={getCart}
            totalSumm={totalSumm}
          />
        )}
      </Row>
    </Container>
  );
}

export default Cart;
