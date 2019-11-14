import Fetch from "./Fetch";

export default function ManageContact(onSucsess, onFail, method, data) {
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
  Fetch(onSucsess, onFail, process.env.REACT_APP_GET_CONTACTS, requestParams);
}
