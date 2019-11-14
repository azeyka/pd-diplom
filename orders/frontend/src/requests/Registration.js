import Fetch from "./Fetch";

export default function Registration(onSucsess, onFail, params) {
  const formData = new FormData();

  for (let name in params) {
    if (params[name]) {
      formData.append(name, params[name]);
    }
  }

  const requestParams = {
    method: "POST",
    body: formData
  };

  Fetch(
    onSucsess,
    onFail,
    process.env.REACT_APP_REGISRTATION_URL,
    requestParams
  );
}
