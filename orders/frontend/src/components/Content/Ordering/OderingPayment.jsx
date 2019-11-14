import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../../Elements/Input";
import { Redirect } from "react-router-dom";

function OderingPayment(props) {
  const { switchTab, totalSumm, createOrder } = props;
  const [isPayed, setisPayed] = useState(false);
  const [inProcess, setinProcess] = useState(false);
  const [orderId, setorderId] = useState(0);
  const [orderState, setorderState] = useState("Оплатить");

  const pay = event => {
    setorderState("Оплата..");
    setisPayed(true);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setorderState("Создание заказа..");
    setinProcess(true);
    createOrder(onSuccess, err => {
      console.log(err);
    });
  };

  const onSuccess = data => {
    setorderId(data.order_id);
    pay();
  };

  if (isPayed) return <Redirect to={`/thankyou/${orderId}`} />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="row m-4 ">
        <h3 className="mx-auto">
          К оплате: {totalSumm}
          <span className="text-muted"> ₽</span>
        </h3>
      </div>
      <div className="row m-4">
        <div className="border rounded p-4 m-2 mx-auto">
          <div className="row">
            <Input className="col-md-7 mb-3" type="text" required>
              Номер карты
            </Input>
            <Input className="col-md-5 mb-3" type="text" required>
              CVV
            </Input>
          </div>
          <div className="row">
            <Input className="col-md-4 mb-3" type="text" required>
              Дата окончания
            </Input>
            <Input className="col-md-8 mb-3" type="text" required>
              Владелец карты
            </Input>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between ">
        <button onClick={() => switchTab(false)} className="btn btn-secondary">
          <i className="material-icons align-middle">chevron_left</i>
          Назад
        </button>

        <button type="submit" className="btn btn-success" disabled={inProcess}>
          {orderState}
          <i className="material-icons align-middle">chevron_right</i>
        </button>
      </div>
    </form>
  );
}

OderingPayment.propTypes = {
  switchTab: PropTypes.func.isRequired,
  totalSumm: PropTypes.string.isRequired,
  createOrder: PropTypes.func.isRequired
};

export default OderingPayment;
