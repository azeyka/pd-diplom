import Fetch from "./Fetch";

export default function AddProducts(onSucsess, onFail, params) {
  const formData = new FormData();
  if (params) {
    params.forEach(param => {
      formData.append(param.name, param.value);
    });
  }

  const requestParams = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };
  Fetch(onSucsess, onFail, process.env.REACT_APP_SHOP_PRODUCTS, requestParams);
}
