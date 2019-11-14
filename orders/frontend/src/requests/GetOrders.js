import Fetch from "./Fetch";

export default function GetOrders(onSucsess, onFail) {
  const requestParams = {
    method: "GET",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };
  Fetch(onSucsess, onFail, process.env.REACT_APP_ORDER, requestParams);
}
