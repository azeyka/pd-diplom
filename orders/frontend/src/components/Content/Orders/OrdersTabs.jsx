import React, { useState, useCallback, useEffect } from "react";
import Tabs from "../../Elements/Tabs";
import { useStore } from "../../../store/useStore";
import GetOrders from "../../../requests/GetOrders";
import OrdersTab from "./OrdersTab";
import Container from "../../Elements/Container";

function OrderTabs() {
  const { dispatch, state } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [orders, setOrders] = useState({ user: [], shop: [] });

  const getOrders = () => {
    const onSucsess = info => setOrders(info);
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });

    GetOrders(onSucsess, onFail);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const tabsList = [
    {
      id: 1,
      name: `Ваши заказы (${orders.user.length})`,
      component: (
        <OrdersTab orders={orders.user} type="user" reload={getOrders} />
      )
    }
  ];

  if (state.userInfo.type === "shop") {
    tabsList.push({
      id: 2,
      name: `Заказы магазину (${orders.shop.length})`,
      component: (
        <OrdersTab orders={orders.shop} type="shop" reload={getOrders} />
      )
    });
  }

  return (
    <Container>
      <Tabs tabsList={tabsList} localStorageName={"ordersTabsId"} />
    </Container>
  );
}

export default OrderTabs;
