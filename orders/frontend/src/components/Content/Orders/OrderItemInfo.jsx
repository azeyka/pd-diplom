import React from "react";
import PropTypes from "prop-types";
import List from "../../Elements/List";
import ListItem from "../../Elements/ListItem";
import Col from "../../Elements/Col";
import Container from "../../Elements/Container";
import Title from "../../Elements/Title";

function OrderItemInfo({ order, isUser }) {
  const statusClass = {
    Новый: "danger",
    Доставлен: "success",
    Подтвержден: "info",
    Собран: "info",
    Отправлен: "info",
    Отменен: "danger"
  };

  const ucFirst = str => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  };

  return (
    <Container className="p-0">
      <Col className="p-0">
        <Title className="h5">
          Заказ №{order.id}{" "}
          <span className="font-weight-normal">
            {" "}
            от {new Date(order.dt).toLocaleString("ru")}{" "}
          </span>
          <span className={`badge badge-${statusClass[order.state]}`}>
            {order.state}
          </span>
        </Title>
      </Col>

      <Container className="p-0">
        {isUser ? (
          <Col className="p-0">
            <Title className="h6">Магазин:</Title>
            {order.shop ? order.shop.name : "[МАГАЗИН УДАЛЕН]"}
          </Col>
        ) : (
          ""
        )}

        <Col className="p-0">
          <Title className="h6">Список товаров:</Title>
          {order.shop ? (
            <List items={order.items}>
              {items =>
                items.map(item => (
                  <ListItem key={item.id}>
                    <small className="text-muted">
                      {item.product_info.product.name} ({item.quantity}шт.)
                    </small>
                  </ListItem>
                ))
              }
            </List>
          ) : (
            "[ИНФОРМАЦИИ О ТОВАРАХ БОЛЬШЕ НЕ СУЩЕСТВУЕТ]"
          )}
        </Col>

        <Col className="p-0">
          <Title className="h6">Контактные данные:</Title>
          {order.user ? (
            <Container>
              <small className="row text-muted m-0">
                Имя получателя: {order.user.first_name || order.user.username}{" "}
                {order.user.last_name}
              </small>
              <small className="row text-muted m-0">
                Телефон: {order.contact.phone}
              </small>
              <small className="row text-muted m-0">
                E-mail: {order.user.email}
              </small>
              <small className="row text-muted m-0">
                Адрес: г.{ucFirst(order.contact.city)}, ул.
                {ucFirst(order.contact.street)}, д.{order.contact.house},
                {order.contact.structure
                  ? `корп.${order.contact.structure}, `
                  : ""}
                {order.contact.building
                  ? `стр.${order.contact.building}, `
                  : ""}
                {order.contact.apartment
                  ? `кв.${order.contact.apartment} `
                  : ""}
              </small>
            </Container>
          ) : (
            <p className="ml-3">[ПОЛЬЗОВАТЕЛЬ УДАЛЕН]</p>
          )}
        </Col>
      </Container>
    </Container>
  );
}

OrderItemInfo.propTypes = {
  order: PropTypes.object
};

export default OrderItemInfo;
