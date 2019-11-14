import React, { useCallback, useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import Category from "./Category";
import GetCategories from "../../../requests/GetCategories";

function Catalog() {
  const { dispatch } = useStore();
  const show = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const [categoriesList, setCategoriesList] = useState([]);

  const getCategories = () => {
    const onSucsess = info => {
      setCategoriesList(info);
    };

    const onFail = err => {
      show({ message: err.toString(), isSuccess: false });
    };

    GetCategories(onSucsess, onFail);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {categoriesList.length <= 0 ? (
        <p className="ml-4">Не добалено ни одной категории товаров</p>
      ) : (
        <div className="list-group">
          {categoriesList.map(category => (
            <Category key={category.id} category={category} />
          ))}
        </div>
      )}
    </>
  );
}

export default Catalog;
