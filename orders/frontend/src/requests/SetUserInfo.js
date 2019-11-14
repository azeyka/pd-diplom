import Fetch from "./Fetch";

export default function GetShopInfo(onSucsess, onFail, data) {
  const formData = new FormData();
  for (let name in data) {
    if (data[name]) {
      formData.append(name, data[name]);
    }
  }

  const requestParams = {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };

  Fetch(onSucsess, onFail, process.env.REACT_APP_GET_INFO, requestParams);
}
