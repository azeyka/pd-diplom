import React, { useCallback } from "react";
import { useStore } from "../../store/useStore";

function Notification() {
  const { state, dispatch } = useStore();
  const setIsShown = useCallback(
    isShown => dispatch({ type: "setIsShown", params: isShown }),
    [dispatch]
  );
  const type = state.notification.isSuccess ? "success" : "danger";

  if (state.notification.isShown) {
    setTimeout(() => {
      setIsShown(false);
    }, 2000);
  }

  return (
    <div
      role="alert"
      className={
        state.notification.isShown
          ? `alert alert-${type} col-md-5 fixed-top m-auto show`
          : `alert ${type} col-md-5 fixed-top m-auto fade`
      }
    >
      {state.notification.message}
    </div>
  );
}

export default Notification;
