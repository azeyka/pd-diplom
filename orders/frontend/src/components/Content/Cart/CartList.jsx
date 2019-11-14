import React from "react";
import PropTypes from "prop-types";
import CartItem from "./CartItem";
import Table from "../../Elements/Table";
import TableRow from "../../Elements/TableRow";
import Title from "../../Elements/Title";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";
import TableData from "../../Elements/TableData";
import Col from "../../Elements/Col";

function CartList({ cartList, setisOdering, getCart, totalSumm }) {
  return (
    <>
      <Table>
        <TableRow className="d-flex">
          <TableData size={5} isHead={true}></TableData>
          <TableData size={2} isHead={true}>
            Цена
          </TableData>
          <TableData size={2} isHead={true}>
            Кол-во
          </TableData>
          <TableData size={2} isHead={true}>
            Сумма
          </TableData>
          <TableData> </TableData>
        </TableRow>
        {cartList.map(item => (
          <CartItem key={item.id} item={item} refreshCart={getCart} />
        ))}
      </Table>

      <Col className="d-flex justify-content-end">
        <Title className="h5 m-3">
          Общая сумма: {totalSumm}
          <span className="text-muted"> ₽</span>
        </Title>
      </Col>

      <ButtonStyledLinkOrButton
        className="btn btn-primary btn-block mt-2"
        onClick={() => setisOdering(true)}
      >
        Оформить заказ
      </ButtonStyledLinkOrButton>
    </>
  );
}

CartList.propTypes = {
  cartList: PropTypes.array.isRequired,
  setisOdering: PropTypes.func.isRequired,
  getCart: PropTypes.func.isRequired,
  totalSumm: PropTypes.number.isRequired
};

export default CartList;
