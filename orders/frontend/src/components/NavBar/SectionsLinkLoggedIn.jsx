import React from "react";
import { useStore } from "../../store/useStore";
import SectionLink from "./SectionLink";
import Row from "../Elements/Row";

function SectionsLinkLoggedIn() {
  const { state } = useStore();
  return (
    <>
      <Row className="pr-3 pl-3">
        {state.userInfo.type === "shop" ? (
          <SectionLink
            className="p-2 text-blue"
            href="/my_shop"
            materialIcon="local_mall"
          >
            Мои товары
          </SectionLink>
        ) : (
          ""
        )}
        <SectionLink href="/orders" materialIcon="local_shipping">
          Заказы
        </SectionLink>
        <SectionLink href="/cart" materialIcon="shopping_cart">
          Корзина
        </SectionLink>
      </Row>

      <Row className="pr-3 pl-3">
        <SectionLink href="/settings" materialIcon="settings">
          Настройки
        </SectionLink>
        <SectionLink href="/logout" materialIcon="exit_to_app">
          Выйти
        </SectionLink>
      </Row>
    </>
  );
}

export default SectionsLinkLoggedIn;
