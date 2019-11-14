import React from "react";
import PropTypes from "prop-types";

function OderingProductList({ switchTab, cartList, totalSumm }) {
  return (
    <div>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th scope="col">Наименование</th>
            <th scope="col">Цена</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Сумма</th>
          </tr>
        </thead>

        {cartList.map(item => (
          <tr>
            <td>{item.product_info.product.name}</td>
            <td>
              {item.product_info.price_rrc}
              <span className="text-muted"> ₽</span>
            </td>
            <td>{item.quantity}</td>
            <td>
              {item.quantity * item.product_info.price_rrc}
              <span className="text-muted"> ₽</span>
            </td>
          </tr>
        ))}

        <tr>
          <th colSpan="3">Общая сумма</th>
          <th>
            {totalSumm}
            <span className="text-muted"> ₽</span>
          </th>
        </tr>
      </table>

      <div className="d-flex justify-content-between ">
        <a href="/cart" className="btn btn-secondary">
          <i className="material-icons align-middle">chevron_left</i>
          Отменить заказ
        </a>

        <button onClick={() => switchTab(true)} className="btn btn-success">
          Подтвердить
          <i className="material-icons align-middle">chevron_right</i>
        </button>
      </div>
    </div>
  );
}

OderingProductList.propTypes = {
  switchTab: PropTypes.func.isRequired,
  totalSumm: PropTypes.string.isRequired,
  cartList: PropTypes.array.isRequired
};

export default OderingProductList;
