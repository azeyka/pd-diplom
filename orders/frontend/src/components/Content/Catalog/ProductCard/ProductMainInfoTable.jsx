import React from "react";
import PropTypes from "prop-types";
import Title from "../../../Elements/Title";
import Table from "../../../Elements/Table";
import TableRow from "../../../Elements/TableRow";
import TableData from "../../../Elements/TableData";

function ProductMainInfoTable({ productInfo }) {
  return (
    <Table className="table-hover mt-3">
      <TableRow>
        <TableData colspan={2}>
          <Title className="h4">Основные характеристики</Title>
        </TableData>
      </TableRow>

      {Object.keys(productInfo).map(name => (
        <TableRow key={name}>
          <TableData isHead={true}>{name}</TableData>
          <TableData>{`${productInfo[name]}`}</TableData>
        </TableRow>
      ))}
    </Table>
  );
}

ProductMainInfoTable.propTypes = {
  productInfo: PropTypes.object.isRequired
};

export default ProductMainInfoTable;
