import React, { useCallback } from "react";
import { useStore } from "../../../store/useStore";
import { Redirect } from "react-router-dom";

function Logout() {
  const { dispatch } = useStore();
  const delToken = useCallback(() => dispatch({ type: "delToken" }), [
    dispatch
  ]);
  const delUserInfo = useCallback(() => dispatch({ type: "delUserInfo" }), [
    dispatch
  ]);

  delToken();
  delUserInfo();
  return <Redirect to="/catalog" />;
}

export default Logout;
