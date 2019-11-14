import Fetch from "./Fetch";

export default function ChangeCart(id, operator, count, onSuccess, onFail) {
  const formData = new FormData();
  formData.append("id", id);

  if (operator) formData.append("operator", operator);
  if (count) formData.append("count", count);

  const url = process.env.REACT_APP_CART;
  const requestParams = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };

  Fetch(onSuccess, onFail, url, requestParams);
}
