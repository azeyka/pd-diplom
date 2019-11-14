import Fetch from "./Fetch";

export default function GetCategories(onSucsess, onFail, shop_id) {
  const params = {
    method: "GET"
  };

  if (shop_id) {
    const formData = new FormData();
    formData.append("shop_id", shop_id);

    params["method"] = "POST";
    params["body"] = formData;
  }

  Fetch(onSucsess, onFail, process.env.REACT_APP_CATEGORIES, params);
}
