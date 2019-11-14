import React, { useState } from "react";
import Input from "../../Elements/Input";
import Registration from "../../../requests/Registration";
import Row from "../../Elements/Row";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";
import Title from "../../Elements/Title";

export default function Signup(props) {
  const [regForm, setRegForm] = useState({
    firstname: "",
    lastname: "",
    company: "",
    position: "",
    email: "",
    username: "",
    password: "",
    password_repeat: ""
  });

  const [errorState, setErrorState] = useState({});

  const register = event => {
    event.preventDefault();
    Registration(onSuccess, onFail, regForm);
  };

  const onSuccess = () => {
    props.history.push(`/confirm/${regForm.username}`);
  };

  const onFail = errors => {
    setErrorState(errors);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setRegForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  return (
    <form id="reg-form" className="form col-7 m-auto" onSubmit={register}>
      <Title className="medium">Регистрация</Title>

      <Row>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="firstname"
          value={regForm.firstname}
          onChange={handleChange}
          error={errorState.firstname}
        >
          Имя
        </Input>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="lastname"
          value={regForm.lastname}
          onChange={handleChange}
          error={errorState.lastname}
        >
          Фамилия
        </Input>
      </Row>

      <Row>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="company"
          value={regForm.company}
          onChange={handleChange}
          error={errorState.company}
        >
          Компания
        </Input>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="position"
          value={regForm.position}
          onChange={handleChange}
          error={errorState.position}
        >
          Должность
        </Input>
      </Row>

      <Input
        className="mb-3"
        type="email"
        name="email"
        value={regForm.email}
        onChange={handleChange}
        error={errorState.email}
        required
      >
        Email
      </Input>

      <Input
        className="mb-3"
        type="text"
        name="username"
        value={regForm.username}
        onChange={handleChange}
        error={errorState.username}
        required
      >
        Имя пользователя
      </Input>

      <Input
        className="mb-3"
        type="password"
        name="password"
        value={regForm.password}
        onChange={handleChange}
        error={errorState.password}
        required
      >
        Пароль
      </Input>

      <Input
        className="mb-3"
        type="password"
        name="password_repeat"
        value={regForm.password_repeat}
        onChange={handleChange}
        error={errorState.password_repeat}
        required
      >
        Повторите пароль
      </Input>

      <ButtonStyledLinkOrButton
        className={"btn btn-primary btn-lg btn-block"}
        type="submit"
      >
        Зарегистрировать
      </ButtonStyledLinkOrButton>
    </form>
  );
}
