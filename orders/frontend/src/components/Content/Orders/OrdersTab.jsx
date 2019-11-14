import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OrdersList from "./OrdersList";
import Filters from "../../Elements/Filters";

function OrdersTab({ orders, type, reload }) {
  const filters = [
    { id: 1, name: "Новый" },
    { id: 2, name: "Подтвержден" },
    { id: 3, name: "Собран" },
    { id: 4, name: "Отправлен" },
    { id: 5, name: "Доставлен" },
    { id: 6, name: "Отменен" }
  ];

  const [filteredOrders, setfilteredOrders] = useState(orders);
  const filterOrders = id => {
    if (!id) {
      setfilteredOrders(orders);
    } else {
      const filter = filters.find(el => el.id === id);
      setfilteredOrders(orders.filter(order => order.state === filter.name));
    }
  };

  useEffect(() => {
    setfilteredOrders(orders);
  }, [orders]);

  return (
    <div>
      <Filters filters={filters} handleClick={filterOrders} />
      <OrdersList orders={filteredOrders} type={type} reload={reload} />
    </div>
  );
}

OrdersTab.propTypes = {
  orders: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  reload: PropTypes.func.isRequired
};

export default OrdersTab;
