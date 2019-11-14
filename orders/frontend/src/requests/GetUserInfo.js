import Fetch from "./Fetch";

export default function GetUserInfo(onSucsess, onFail) {
  const params = {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  };
  Fetch(onSucsess, onFail, process.env.REACT_APP_GET_INFO, params);
}
