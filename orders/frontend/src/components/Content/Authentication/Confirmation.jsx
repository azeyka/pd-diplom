import React, { useState, useCallback, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import { Redirect } from "react-router-dom";
import RequestToken from "../../../requests/RequestToken";
import ConfirmAccount from "../../../requests/ConfirmAccount";
import Input from "../../Elements/Input";
import Title from "../../Elements/Title";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function Confirmation(props) {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );

  const [code, setCode] = useState("");
  const [isConfirmed, setisConfirmed] = useState(false);

  const onFail = err => {
    showNotification({ message: err.toString(), isSuccess: false });
  };

  const handleChange = event => {
    setCode(event.target.value);
  };

  const confirm = event => {
    event.preventDefault();
    const onSuccess = () => {
      showNotification({
        message: "Ваш e-mail успешно подтвержден!",
        isSuccess: true
      });
      setisConfirmed(true);
    };

    ConfirmAccount(onSuccess, onFail, props.match.params.username, code);
  };

  const sendTokentoEmail = event => {
    if (event) event.preventDefault();
    const onSuccess = () => {
      showNotification({
        message: "Код подтверждения отправлен на e-mail.",
        isSuccess: true
      });
    };
    RequestToken(onSuccess, onFail, props.match.params.username);
  };

  useEffect(() => {
    sendTokentoEmail();
  }, []);

  if (isConfirmed) return <Redirect to="/login" />;

  return (
    <React.Fragment>
      <form className="col-md-7 m-auto p-5 text-center" onSubmit={confirm}>
        <Title className="h3 text-center">Введите код подтверждения:</Title>
        <Input
          className="mb-3"
          type="text"
          name="code"
          value={code}
          onChange={handleChange}
        />
        <ButtonStyledLinkOrButton
          type="submit"
          className="btn btn-primary btn-block"
        >
          Активировать
        </ButtonStyledLinkOrButton>
        <a onClick={sendTokentoEmail} href="/">
          Не пришло письмо? Отправить еще раз!
        </a>
      </form>
    </React.Fragment>
  );
}

export default Confirmation;
