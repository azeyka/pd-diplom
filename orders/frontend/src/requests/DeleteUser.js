import Fetch from "./Fetch";

export default function DeleteUser(onSucsess, onFail) {
  const requestParams = {
    method: "DELETE",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  };

  Fetch(
    onSucsess,
    onFail,
    process.env.REACT_APP_REGISRTATION_URL,
    requestParams
  );
}
