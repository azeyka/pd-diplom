import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import PropTypes from "prop-types";
import ChangeOrder from "../../../requests/ChangeOrder";
import Title from "../../Elements/Title";
import OrderItemInfo from "./OrderItemInfo";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function OrderItem({ order, isUser, reload }) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [selectedStatus, setselectedStatus] = useState("new");

  const status = {
    new: "Новый",
    confirmed: "Подтвержден",
    assembled: "Собран",
    sent: "Отправлен",
    delivered: "Доставлен",
    canceled: "Отменен"
  };

  useEffect(() => {
    setselectedStatus(
      Object.keys(status).find(key => status[key] === order.state)
    );
  }, []);

  const changeState = (state, event) => {
    event.preventDefault();
    const onSuccess = info => {
      showNotification({ message: "Успешно изменено.", isSuccess: true });
      reload();
    };
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });

    ChangeOrder(onSuccess, onFail, order.id, state);
  };

  const handleChangeState = event => setselectedStatus(event.target.value);

  return (
    <>
      <OrderItemInfo order={order} isUser={isUser} />

      <div className="text-md-right text-lg-right text-left col-md-4">
        <Title className="h4 p-1">
          <span className="h6">Оплачено: </span>
          {order.total_summ}
          <span className="text-muted"> ₽</span>
        </Title>
        {isUser ? (
          <div>
            {order.state === "Отправлен" ? (
              <button
                className="btn btn-outline-success btn-sm btn-block"
                onClick={event => changeState("delivered", event)}
              >
                Подтвердить доставку
              </button>
            ) : order.state === "Отменен" || order.state === "Доставлен" ? (
              ""
            ) : (
              <button
                className="btn btn-outline-danger btn-sm btn-block mt-2 p-1 pl-3 pr-3"
                onClick={event => changeState("canceled", event)}
              >
                Отменить заказ
              </button>
            )}
          </div>
        ) : (
          <form className="mt-2">
            <select
              className={`form-control-sm w-100`}
              name="state"
              id=""
              value={selectedStatus}
              onChange={handleChangeState}
            >
              {Object.keys(status).map(key => (
                <option key={key} disabled={key === "delivered"} value={key}>
                  {`${status[key]}`}
                </option>
              ))}
            </select>

            <ButtonStyledLinkOrButton
              className="btn btn-sm btn-secondary btn-block"
              onClick={event => changeState(selectedStatus, event)}
            >
              Сменить статус
            </ButtonStyledLinkOrButton>
          </form>
        )}
      </div>
    </>
  );
}

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  isUser: PropTypes.bool.isRequired,
  reload: PropTypes.func.isRequired
};

export default OrderItem;
