import Fetch from "./Fetch";

export default function CreateNewOrder(onSuccess, onFail, id) {
  const formData = new FormData();
  formData.append("contact", id);

  const requestParams = {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };

  Fetch(onSuccess, onFail, process.env.REACT_APP_ORDER, requestParams);
}
