import React, { useState } from "react";
import PropTypes from "prop-types";
import Title from "../../Elements/Title";
import Table from "../../Elements/Table";
import TableRow from "../../Elements/TableRow";
import TableData from "../../Elements/TableData";
import Row from "../../Elements/Row";

function UserProductFormParameters({
  productParameters,
  setproductParameters
}) {
  const [newParameter, setnewParameter] = useState({
    parameter: "",
    value: ""
  });

  const handleChangeParameter = (parameter, event) => {
    const { name, value } = event.target;

    setproductParameters(prevForm => {
      const newForm = [];
      const newParameter = { ...parameter };
      newParameter[name] = value;

      prevForm.forEach(el => {
        el !== parameter ? newForm.push(el) : newForm.push(newParameter);
      });

      return newForm;
    });
  };

  const handleChangeNewParameter = event => {
    const { name, value } = event.target;
    setnewParameter(prevForm => ({ ...prevForm, [name]: value }));
  };

  const addParameter = event => {
    event.preventDefault();
    if (newParameter.value !== "" && newParameter.parameter !== "") {
      setproductParameters(prevForm => [...prevForm, newParameter]);
      setnewParameter({
        parameter: "",
        value: ""
      });
    }
  };

  const removeParameter = (event, parameter) => {
    event.preventDefault();
    setproductParameters(prevForm => {
      const newParameters = [];
      prevForm.forEach(el => {
        if (el !== parameter) newParameters.push(el);
      });
      return newParameters;
    });
  };

  return (
    <Table className="table-hover">
      <TableRow>
        <TableData colspan={2}>
          <Title className="h5">Параметры</Title>
        </TableData>
      </TableRow>

      <TableRow>
        <TableData isHead={true}>Название</TableData>
        <TableData isHead={true}>Значение</TableData>
      </TableRow>

      {productParameters.map(parameter => (
        <TableRow key={parameter.id} className="col-md-12">
          <TableData>
            <input
              className="col-md-12 form-control table-input"
              type="text"
              value={parameter.parameter}
              name="parameter"
              onChange={event => handleChangeParameter(parameter, event)}
            />
          </TableData>
          <TableData>
            <Row>
              <input
                className="col-md-10 ml-3 form-control table-input"
                type="text"
                name="value"
                value={parameter.value}
                onChange={event => handleChangeParameter(parameter, event)}
              />
              <button
                className="ml-2 p-0 button-unstyled"
                onClick={event => removeParameter(event, parameter)}
              >
                <i className="material-icons text-muted">
                  remove_circle_outline
                </i>
              </button>
            </Row>
          </TableData>
        </TableRow>
      ))}

      <TableRow>
        <TableData>
          <input
            className="col-md-12 form-control"
            type="text"
            name="parameter"
            value={newParameter.parameter}
            onChange={handleChangeNewParameter}
          />
        </TableData>
        <TableData>
          <Row>
            <input
              className="col-md-10 ml-3 form-control"
              type="text"
              name="value"
              value={newParameter.value}
              onChange={handleChangeNewParameter}
            />
            <button className="ml-2 p-0 button-unstyled" onClick={addParameter}>
              <i className="material-icons text-muted">add_circle</i>
            </button>
          </Row>
        </TableData>
      </TableRow>
    </Table>
  );
}

UserProductFormParameters.propTypes = {
  productParameters: PropTypes.array.isRequired,
  setproductParameters: PropTypes.func.isRequired
};

export default UserProductFormParameters;
