import React from "react";
import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import List from "../../Elements/List";
import ListItem from "../../Elements/ListItem";

function OrdersList({ orders, type, reload }) {
  return (
    <>
      {orders.length > 0 ? (
        <List items={orders} className="list-group">
          {items =>
            items.map(order => (
              <ListItem
                className="list-group-item d-flex flex-column flex-md-row justify-content-between lh-condensed"
                key={order.id}
              >
                <OrderItem
                  order={order}
                  isUser={type === "user"}
                  reload={reload}
                />
              </ListItem>
            ))
          }
        </List>
      ) : (
        <ListItem className="list-group-item">Нет заказов</ListItem>
      )}
    </>
  );
}

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

export default OrdersList;
