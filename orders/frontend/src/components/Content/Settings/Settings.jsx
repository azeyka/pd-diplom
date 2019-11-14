import React from "react";
import UserInfo from "./UserInfo";
import Contacts from "./Contacts";
import UserShopInfo from "./UserShopInfo";
import Title from "../../Elements/Title";
import Tabs from "../../Elements/Tabs";

function Settings() {
  const tabsList = [
    {
      id: 1,
      name: "Основное",
      component: <UserInfo />
    },
    {
      id: 2,
      name: "Контакты",
      component: <Contacts />
    },
    {
      id: 3,
      name: "Магазин",
      component: <UserShopInfo />
    }
  ];

  return (
    <>
      <div className="container mt-3">
        <Title className="h5">Настройки</Title>
        <br />
        <Tabs tabsList={tabsList} localStorageName="settingsTabId" />
      </div>
    </>
  );
}

export default Settings;
