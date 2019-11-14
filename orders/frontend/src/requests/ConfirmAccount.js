import Fetch from "./Fetch";

export default function ConfirmAccount(onSucsess, onFail, username, code) {
  const formData = new FormData();
  formData.append("code", code);
  formData.append("username", username);

  const url = process.env.REACT_APP_CONFIRM;
  const params = {
    method: "POST",
    body: formData
  };
  Fetch(onSucsess, onFail, url, params);
}
