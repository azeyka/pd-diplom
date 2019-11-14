import React, { useState, useCallback } from "react";
import { useStore } from "../../../store/useStore";
import PropTypes from "prop-types";
import ChangeCart from "../../../requests/ChangeCart";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";
import TableRow from "../../Elements/TableRow";
import TableData from "../../Elements/TableData";
import Row from "../../Elements/Row";

function CartItem(props) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const { item, refreshCart } = props;
  const [itemQuantity, setitemQuantity] = useState(item.quantity);
  const [newQuantity, setnewQuantity] = useState(null);
  const [oldQuantity, setoldQuantity] = useState(item.quantity);

  const handleClick = operator => {
    const onSuccess = info => {
      setitemQuantity(info.quantity);
      refreshCart();

      if (info.quantity !== 0) {
        showNotification({
          message: `Доступно для добавления ${info.remain}.`,
          isSuccess: true
        });
      }
    };

    const onFail = err => {
      showNotification({ message: err.toString(), isSuccess: false });
    };

    ChangeCart(item.product_info.id, operator, newQuantity, onSuccess, onFail);
  };

  const handleFocus = () => {
    setoldQuantity(item.quantity);
  };

  const handleBlur = () => {
    const onFail = err => {
      setitemQuantity(oldQuantity);
      setnewQuantity(null);
      refreshCart();
      showNotification({ message: err.toString(), isSuccess: false });
    };

    const onSuccess = info => {
      setitemQuantity(newQuantity);
      setnewQuantity(null);
      refreshCart();

      if (info.quantity !== 0) {
        showNotification({
          message: `Доступно для добавления ${info.remain}.`,
          isSuccess: true
        });
      }
    };

    ChangeCart(item.product_info.id, null, itemQuantity, onSuccess, onFail);
  };

  const handleChange = event => {
    setitemQuantity(event.target.value);
    setnewQuantity(event.target.value);
  };

  const handleDlete = () => {
    ChangeCart(item.product_info.id, null, "0", refreshCart, refreshCart);
  };

  return (
    <>
      <TableRow className="d-flex">
        <TableData size={5}>
          {item.product_info.product.name}
          <span className="font-weight-bold">
            {" "}
            [{item.product_info.shop.name}]
          </span>
        </TableData>

        <TableData size={2}>
          {item.product_info.price_rrc}
          <span className="text-muted"> ₽</span>
        </TableData>

        <TableData size={2}>
          <Row className="align-center">
            <ButtonStyledLinkOrButton
              className="btn btn-outline-secondary col-md-2 m-1 p-1"
              onClick={() => handleClick("-")}
            >
              -
            </ButtonStyledLinkOrButton>

            <input
              onChange={handleChange}
              className="form-control text-center col-md-4 p-1"
              type="text"
              name="external_id"
              value={itemQuantity}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />

            <ButtonStyledLinkOrButton
              className="btn btn-outline-secondary col-md-2 m-1 p-1"
              onClick={() => handleClick("+")}
            >
              +
            </ButtonStyledLinkOrButton>
          </Row>
        </TableData>

        <TableData size={2}>
          {item.product_info.price_rrc * item.quantity}
          <span className="text-muted"> ₽</span>
        </TableData>

        <TableData>
          <ButtonStyledLinkOrButton
            onClick={handleDlete}
            className="btn bg-white m-1 p-0"
          >
            <i className="material-icons">delete_forever</i>
          </ButtonStyledLinkOrButton>
        </TableData>
      </TableRow>
    </>
  );
}

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  refreshCart: PropTypes.func.isRequired
};

export default CartItem;
