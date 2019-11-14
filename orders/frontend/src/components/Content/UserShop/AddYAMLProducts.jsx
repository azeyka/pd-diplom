import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import file from "./yamlExample.yaml";
import { useStore } from "../../../store/useStore";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";
import AddProducts from "../../../requests/AddProducts";

function AddYAMLProducts({ refreshProducts, isLoading, setisLoading }) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const fileRef = useRef();

  const sendFile = file => {
    const onSucsess = () => {
      refreshProducts();
      setisLoading(false);
      showNotification({ message: "Успешно добавлено.", isSuccess: true });
    };
    const onFail = err => {
      showNotification({ message: err.toString(), isSuccess: false });
      setisLoading(false);
    };

    setisLoading(true);
    AddProducts(onSucsess, onFail, [{ name: "file", value: file }]);
  };

  const handleClickDownloadExample = event => {
    event.preventDefault();
    window.open(file);
  };

  const handleClickChooseFile = event => {
    event.preventDefault();
    fileRef.current.click();
  };

  const handleSubmit = event => {
    event.preventDefault();
    sendFile(new Blob(fileRef.current.files, { type: "text/x-yaml" }));
  };

  return (
    <form className="col-12">
      <input
        type="file"
        className="not_displayed"
        id="file"
        ref={fileRef}
        accept=".yaml"
        onChange={handleSubmit}
      />
      <ButtonStyledLinkOrButton
        className={`btn btn-outline-${
          isLoading ? "secondary" : "success"
        } align-self-start col-12`}
        onClick={handleClickChooseFile}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка..." : "+ Загрузить файл в формате YAML"}
      </ButtonStyledLinkOrButton>
      <a
        href="/"
        className="d-block small text-center"
        onClick={handleClickDownloadExample}
      >
        (Пример файла)
      </a>
    </form>
  );
}

AddYAMLProducts.propTypes = {
  refreshProducts: PropTypes.func,
  isLoading: PropTypes.bool,
  setisLoading: PropTypes.func
};

export default AddYAMLProducts;
