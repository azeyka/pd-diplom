import React from "react";
import PropTypes from "prop-types";
import Table from "../../Elements/Table";
import TableRow from "../../Elements/TableRow";
import TableData from "../../Elements/TableData";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function OderingProductList({ switchTab, cartList, totalSumm }) {
  return (
    <div>
      <Table className="table-bordered mt-3">
        <TableRow>
          <TableData isHead={true}>Наименование</TableData>
          <TableData isHead={true}>Цена</TableData>
          <TableData isHead={true}>Кол-во</TableData>
          <TableData isHead={true}>Сумма</TableData>
        </TableRow>

        {cartList.map(item => (
          <TableRow key={item.id}>
            <TableData>{item.product_info.product.name}</TableData>
            <TableData>
              {item.product_info.price_rrc}
              <span className="text-muted"> ₽</span>
            </TableData>
            <TableData>{item.quantity}</TableData>
            <TableData>
              {item.quantity * item.product_info.price_rrc}
              <span className="text-muted"> ₽</span>
            </TableData>
          </TableRow>
        ))}

        <TableRow>
          <TableData isHead={true} colspan={3}>
            Общая сумма
          </TableData>
          <TableData isHead={true} colspan={3}>
            {totalSumm}
            <span className="text-muted"> ₽</span>
          </TableData>
        </TableRow>
      </Table>

      <div className="d-flex justify-content-between ">
        <ButtonStyledLinkOrButton href="/cart" className="btn btn-secondary">
          <i className="material-icons align-middle">chevron_left</i>
          Отменить заказ
        </ButtonStyledLinkOrButton>

        <ButtonStyledLinkOrButton
          onClick={() => switchTab(true)}
          className="btn btn-success"
        >
          Подтвердить
          <i className="material-icons align-middle">chevron_right</i>
        </ButtonStyledLinkOrButton>
      </div>
    </div>
  );
}

OderingProductList.propTypes = {
  switchTab: PropTypes.func.isRequired,
  totalSumm: PropTypes.number.isRequired,
  cartList: PropTypes.array.isRequired
};

export default OderingProductList;
