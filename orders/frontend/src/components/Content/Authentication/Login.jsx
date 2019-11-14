import React, { useState, useCallback } from "react";
import { useStore } from "../../../store/useStore";
import { Redirect } from "react-router-dom";
import Input from "../../Elements/Input";
import GetUserInfo from "../../../requests/GetUserInfo";
import LogIn from "../../../requests/Login";
import Title from "../../Elements/Title";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function Login() {
  const { dispatch } = useStore();
  const setUserInfo = useCallback(
    params => dispatch({ type: "setUserInfo", params: params }),
    [dispatch]
  );
  const setToken = useCallback(
    token => dispatch({ type: "setToken", params: token }),
    [dispatch]
  );

  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );

  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [logInForm, setLogInForm] = useState({
    email: "",
    password: ""
  });

  const [isActivated, setisActivated] = useState(true);

  const logIn = event => {
    event.preventDefault();
    LogIn(onSucsess, onFail, logInForm);
  };

  const onFail = err => {
    showNotification({ message: err.toString(), isSuccess: false });
    if (err === "Ваш аккаунт не активирован.") setisActivated(false);
  };

  const onSucsess = info => {
    setToken(info.token);

    const onSucsess = userInfo => {
      setUserInfo(userInfo);
      showNotification({
        message: `Привет, ${userInfo.first_name || userInfo.username}!`,
        isSuccess: true
      });
      setJustLoggedIn(true);
    };

    const onFail = err => {
      showNotification({ message: err.toString(), isSuccess: false });
    };

    GetUserInfo(onSucsess, onFail);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setLogInForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  if (justLoggedIn) return <Redirect to="/catalog" />;

  return (
    <form className="col-md-4 p-3 m-auto" onSubmit={logIn}>
      <Title>Войти</Title>
      <Input
        className="mb-3"
        type="text"
        name="username"
        value={logInForm.username}
        onChange={handleChange}
        required
      >
        Имя пользователя
      </Input>
      <Input
        className="mb-3"
        type="password"
        name="password"
        value={logInForm.password}
        onChange={handleChange}
        required
      >
        Пароль
      </Input>
      {isActivated ? (
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Войти
        </button>
      ) : (
        <a
          href={`/confirm/${logInForm.username}`}
          className="btn btn-success btn-lg btn-block"
        >
          Активировать аккаунт
        </a>
      )}

      <ButtonStyledLinkOrButton href="/signup" className="btn btn-block">
        Зарегистрироваться
      </ButtonStyledLinkOrButton>
    </form>
  );
}

export default Login;
