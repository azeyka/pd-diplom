import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import GetCategories from "../../../requests/GetCategories";
import AddProducts from "../../../requests/AddProducts";
import UserProductFormInfo from "./UserProductFormInfo";
import UserProductFormParameters from "./UserProductFormParameters";

function UserProductForm(props) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );

  const {
    setformIsShown,
    productName,
    setproductName,
    productCategory,
    setproductCategory,
    productInfo,
    setproductInfo,
    productParameters,
    setproductParameters,
    reload
  } = props;

  const [categoriesList, setcategoriesList] = useState([]);
  const [isSaving, setisSaving] = useState(false);

  const getCategories = () => {
    const onSucsess = info => setcategoriesList(info);
    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    GetCategories(onSucsess, onFail);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === "name") {
      setproductName(value);
    } else if (name === "category") {
      setproductCategory(categoriesList.find(el => el.name === value));
    } else {
      setproductInfo(prevForm => ({ ...prevForm, [name]: value }));
    }
  };

  const handleCancel = () => {
    setformIsShown(false);
  };

  const addNewCategory = name => {
    setcategoriesList(prev => [...prev, { name }]);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const yamlData = makeYaml();

    const onFail = err =>
      showNotification({ message: err.toString(), isSuccess: false });
    const onSucsess = () => {
      setformIsShown(false);
      setisSaving(false);
      reload();
    };

    AddProducts(onSucsess, onFail, [{ name: "yaml", value: yamlData }]);
  };

  const makeYaml = () => {
    const yaml = require("js-yaml");

    const parameters = productParameters.reduce((dict, parameter) => {
      dict[parameter.parameter] = parameter.value;
      return dict;
    }, {});

    return yaml.safeDump({
      categories: [{ ...productCategory }],
      goods: [
        {
          id: productInfo.external_id,
          category: productCategory.name,
          name: productName,
          model: productInfo.model,
          price: productInfo.price,
          price_rrc: productInfo.price_rrc,
          quantity: productInfo.quantity,
          parameters: parameters
        }
      ]
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="list-group-item mt-3 mb-3">
      <div className="container mt-3">
        <form
          className="m-3 form-horizontal"
          name="product_form"
          id="product-form"
        >
          <UserProductFormInfo
            handleChange={handleChange}
            productInfo={productInfo}
            productName={productName}
            productCategory={productCategory}
            categoriesList={categoriesList}
            addNewCategory={addNewCategory}
            setproductCategory={setproductCategory}
          />
          <UserProductFormParameters
            productParameters={productParameters}
            setproductParameters={setproductParameters}
          />

          <div className="text-center">
            <button
              onClick={handleCancel}
              className="btn btn-secondary btn-inline-block col-md-5 m-3"
            >
              Отменить
            </button>
            <button
              onClick={handleSubmit}
              id="submit-btn"
              className="btn btn-primary col-md-5 m-3"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Сохраняется..." : "Сохранить изменеия"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

UserProductForm.propTypes = {};

export default UserProductForm;
