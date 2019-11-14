import Fetch from "./Fetch";

export default function RequestToken(onSucsess, onFail, username) {
  const formData = new FormData();
  formData.append("username", username);

  const url = process.env.REACT_APP_SEND_TOKEN_URL;
  const params = {
    method: "POST",
    body: formData
  };
  Fetch(onSucsess, onFail, url, params);
}
