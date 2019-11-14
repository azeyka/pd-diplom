import Fetch from "./Fetch";

export default function GetProducts(onSucsess, onFail, params) {
  const formData = new FormData();
  if (params) {
    params.forEach(param => {
      formData.append(param.name, param.value);
    });
  }

  const requestParams = {
    method: "POST",
    body: formData
  };

  Fetch(onSucsess, onFail, process.env.REACT_APP_PRODUCTS, requestParams);
}
