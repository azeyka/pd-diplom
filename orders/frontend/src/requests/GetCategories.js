import Fetch from "./Fetch";

export default function GetCategories(onSucsess, onFail, shop_id) {
  let url = process.env.REACT_APP_CATEGORIES;

  if (shop_id) url += shop_id + "/";

  Fetch(onSucsess, onFail, url);
}
