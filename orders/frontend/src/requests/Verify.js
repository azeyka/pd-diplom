import Fetch from "./Fetch";

export default function RequestToken(onSucsess, onFail, uuid) {
  const formData = new FormData();
  formData.append("uuid", uuid);
  const url = process.env.REACT_APP_VERIFY;
  const params = {
    method: "POST",
    body: formData
  };
  Fetch(onSucsess, onFail, url, params);
}
