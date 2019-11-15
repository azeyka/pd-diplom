import Fetch from "./Fetch";

export default function ChangeOrder(onSuccess, onFail, id, state) {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("state", state);

  const requestParams = {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };

  Fetch(onSuccess, onFail, process.env.REACT_APP_ORDER, requestParams);
}
