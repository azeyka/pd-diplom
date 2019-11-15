import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "../../Elements/Table";
import TableRow from "../../Elements/TableRow";
import TableData from "../../Elements/TableData";
import Title from "../../Elements/Title";
import Row from "../../Elements/Row";

function UserProductFormInfo({
  handleChange,
  productInfo,
  productName,
  productCategory,
  categoriesList,
  addNewCategory,
  setproductCategory
}) {
  const [newCategoryName, setnewCategoryName] = useState("");
  const handleChangeNewCategoryInput = event => {
    setnewCategoryName(event.target.value);
  };

  const handleClickAddCategory = event => {
    event.preventDefault();
    addNewCategory(newCategoryName);
    setproductCategory({ name: newCategoryName });
    setnewCategoryName("");
  };

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
      <TableRow>
        <TableData colspan={2}>
          <Title className="h5">Информация</Title>
        </TableData>
      </TableRow>

      {tableInfo.map(field => (
        <TableRow key={field.name}>
          <TableData isHead={true}>{field.th}</TableData>

          {field.name === "category" ? (
            <TableData>
              <select
                className="form-control table-input col-md-12 border"
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

              <Row>
                <input
                  className="col-md-10 mt-3 ml-3 form-control table-input"
                  type="text"
                  name="value"
                  placeholder="Добавить свою категорию"
                  value={newCategoryName}
                  onChange={handleChangeNewCategoryInput}
                />
                <button
                  className="mt-3 ml-2 p-0 button-unstyled"
                  onClick={handleClickAddCategory}
                >
                  <i className="material-icons text-muted">
                    add_circle_outline
                  </i>
                </button>
              </Row>
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
  handleChange: PropTypes.func.isRequired,
  productInfo: PropTypes.object.isRequired,
  productName: PropTypes.string.isRequired,
  productCategory: PropTypes.object.isRequired,
  categoriesList: PropTypes.array.isRequired
};

export default UserProductFormInfo;
