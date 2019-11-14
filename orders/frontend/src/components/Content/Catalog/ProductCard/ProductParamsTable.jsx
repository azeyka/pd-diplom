import React from "react";
import PropTypes from "prop-types";
import Title from "../../../Elements/Title";
import Table from "../../../Elements/Table";
import TableRow from "../../../Elements/TableRow";
import TableData from "../../../Elements/TableData";

function ProductParamsTable({ params }) {
  return (
    <Table className="table-hover mt-3">
      <TableRow>
        <TableData colspan={2}>
          <Title className="h4">Параметры продукта</Title>
        </TableData>
      </TableRow>

      {params.map(param => (
        <TableRow key={param.id}>
          <TableData isHead={true}>{param.parameter}</TableData>
          <TableData>{param.value}</TableData>
        </TableRow>
      ))}
    </Table>
  );
}

ProductParamsTable.propTypes = {
  params: PropTypes.array.isRequired
};

export default ProductParamsTable;
