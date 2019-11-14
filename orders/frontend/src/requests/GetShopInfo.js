import Fetch from "./Fetch";

export default function GetShopInfo(onSucsess, onFail, id) {
  const requestParams = {
    method: "POST",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };

  if (id) {
    const formData = new FormData();
    formData.append("id", id);
    requestParams["body"] = formData;
  }

  Fetch(onSucsess, onFail, process.env.REACT_APP_SHOP_INFO, requestParams);
}
