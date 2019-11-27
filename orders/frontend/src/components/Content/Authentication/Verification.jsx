import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Verify from "../../../requests/Verify";

function Verification(props) {
  const [message, setmessage] = useState("Идет подтверждение...");
  const [isVerifyed, setisVerifyed] = useState(false);
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );

  const verify = () => {
    const onSuccess = () => {
      showNotification({
        message: "Ваш e-mail успешно подтвержден.",
        isSuccess: true
      });
      setisVerifyed(true);
    };

    const onFail = err => {
      showNotification({
        message: err,
        isSuccess: false
      });
      setmessage(err);
    };

    Verify(onSuccess, onFail, props.match.params.uuid);
  };

  useEffect(() => {
    verify();
  }, []);

  return isVerifyed ? (
    <div className="ml-4">{message}</div>
  ) : (
    <Redirect to="/login" />
  );
}

Verification.propTypes = {};

export default Verification;
