import React from "react";
import PropTypes from "prop-types";
import Table from "../../Elements/Table";
import TableRow from "../../Elements/TableRow";
import TableData from "../../Elements/TableData";
import Title from "../../Elements/Title";

function UserProductFormInfo({
  handleChange,
  productInfo,
  productName,
  productCategory,
  categoriesList
}) {
  const tableInfo = [
    {
      th: "ID",
      type: "number",
      name: "external_id",
      value: productInfo.external_id
    },
    { th: "Наименование", type: "text", name: "name", value: productName },
    {
      th: "Категория",
      type: "text",
      name: "category",
      value: productCategory.name,
      categories: categoriesList
    },
    { th: "Модель", type: "text", name: "model", value: productInfo.model },
    {
      th: "Количество",
      type: "number",
      name: "quantity",
      value: productInfo.quantity
    },
    { th: "Цена", type: "number", name: "price", value: productInfo.price },
    {
      th: "Розничная цена",
      type: "number",
      name: "price_rrc",
      value: productInfo.price_rrc
    }
  ];

  return (
    <Table className="table-hover">
      <Title className="h5">Информация</Title>
      {tableInfo.map(field => (
        <TableRow key={field.name}>
          <TableData isHead={true}>{field.th}</TableData>

          {field.name === "category" ? (
            <TableData>
              <select
                className="form-control table-input col-md-12"
                name={field.name}
                value={field.value}
                onChange={handleChange}
                required
              >
                <option>---Выберите категорию---</option>
                {field.categories.map(category => (
                  <option key={category.id}>{category.name}</option>
                ))}
              </select>
            </TableData>
          ) : (
            <TableData>
              <input
                className="form-control table-input col-md-12"
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleChange}
                required
              />
            </TableData>
          )}
        </TableRow>
      ))}
    </Table>
  );
}

UserProductFormInfo.propTypes = {
  tableInfo: PropTypes.array.isRequired
};

export default UserProductFormInfo;
