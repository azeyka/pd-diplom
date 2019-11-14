import React, { useState } from "react";
import PropTypes from "prop-types";
import OderingProductList from "./OderingProductList";
import OderingContact from "./OderingContact";
import OderingPayment from "./OderingPayment";
import Container from "../../Elements/Container";
import Title from "../../Elements/Title";
import CreateNewOrder from "../../../requests/CreateNewOrder";
import NavTabs from "../../Elements/NavTabs";
import ActiveTab from "../../Elements/ActiveTab";

function Ordering({ cartList, totalSumm }) {
  const [contact, setcontact] = useState("");
  const [switcher, setSwitcher] = useState(1);

  const switchTab = isForward => {
    setSwitcher(prev => {
      return isForward ? prev + 1 : prev - 1;
    });

    activeTab = tabsList.find(tab => tab.id === switcher);
  };

  const createOrder = (onSuccess, onFail) => {
    CreateNewOrder(onSuccess, onFail, contact.id);
  };

  const tabsList = [
    {
      id: 1,
      name: "1. Подтверждение списка товаров",
      component: (
        <OderingProductList
          switchTab={switchTab}
          cartList={cartList}
          totalSumm={totalSumm}
        />
      )
    },
    {
      id: 2,
      name: "2. Выбор адреса",
      component: (
        <OderingContact
          switchTab={switchTab}
          contact={contact}
          setcontact={setcontact}
        />
      )
    },
    {
      id: 3,
      name: "3. Оплата",
      component: (
        <OderingPayment
          switchTab={switchTab}
          totalSumm={totalSumm}
          createOrder={createOrder}
        />
      )
    }
  ];

  let activeTab = tabsList.find(tab => tab.id === switcher);

  return (
    <Container>
      <Title className="h5">Оформление заказа</Title>
      <br />
      <NavTabs tabsList={tabsList} onSwitch={() => {}} switcher={switcher} />
      <ActiveTab>{activeTab.component}</ActiveTab>
    </Container>
  );
}

Ordering.propTypes = {
  cartList: PropTypes.array.isRequired,
  totalSumm: PropTypes.string.isRequired
};

export default Ordering;
