import Fetch from "./Fetch";

export default function ManageShopInfo(onSucsess, onFail, method, data) {
  const url =
    method === "PUT"
      ? process.env.REACT_APP_SHOP_INFO
      : process.env.REACT_APP_SHOP_MANAGE;

  const formData = new FormData();

  for (let field in data) {
    formData.append(field, data[field]);
  }

  const requestParams = {
    method,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    },
    body: formData
  };
  Fetch(onSucsess, onFail, url, requestParams);
}
