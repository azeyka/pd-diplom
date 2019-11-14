import React from "react";
import Container from "../../Elements/Container";
import Title from "../../Elements/Title";

function OderingThanks(props) {
  // Устанавливаем ordersTabsId чтобы при клике на Заказы отображалась вкладка с новым заказом
  localStorage.setItem("ordersTabsId", 1);

  return (
    <Container className="mt-3">
      <Title className="h2">Спасибо за заказ!</Title>
      <h5>Номер вашего заказа: {props.match.params.order_id}</h5>
      <p className="mb-0">
        Наш оператор свяжется с вами в ближайшее время для уточнения делатей
        заказа.
      </p>
      <p>
        Статуc заказов вы можете посмотреть в разделе{" "}
        <a href="/orders">"Заказы"</a>.
      </p>
    </Container>
  );
}

export default OderingThanks;
