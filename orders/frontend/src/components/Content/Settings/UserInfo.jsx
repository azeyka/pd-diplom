import React, { useCallback, useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import { Redirect } from "react-router-dom";
import Input from "../../Elements/Input";
import GetUserInfo from "../../../requests/GetUserInfo";
import SetUserInfo from "../../../requests/SetUserInfo";
import Row from "../../Elements/Row";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";
import DeleteUser from "../../../requests/DeleteUser";

function UserInfo() {
  const { dispatch } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const delToken = useCallback(() => dispatch({ type: "delToken" }), [
    dispatch
  ]);
  const delUserInfo = useCallback(() => dispatch({ type: "delUserInfo" }), [
    dispatch
  ]);
  const [isJustDeleted, setisJustDeleted] = useState(false);
  const [infoForm, setInfoForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    company: "",
    position: "",
    type: ""
  });

  const onFail = err => {
    showNotification({ message: err.toString(), isSuccess: false });
  };

  const getInfo = () => {
    const onSucsess = info => {
      setInfoForm(info);
    };
    GetUserInfo(onSucsess, onFail);
  };

  const setInfo = event => {
    event.preventDefault();
    const onSucsess = info => {
      setInfoForm(info);
      showNotification({ message: "Успешно изменено.", isSuccess: true });
    };
    SetUserInfo(onSucsess, onFail, infoForm);
  };

  const deleteUser = event => {
    event.preventDefault();
    const onSucsess = () => {
      showNotification({ message: "Успешно удалено.", isSuccess: true });
      delToken();
      delUserInfo();
      setisJustDeleted(true);
    };
    DeleteUser(onSucsess, onFail);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setInfoForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  useEffect(() => {
    getInfo();
  }, []);

  if (isJustDeleted) return <Redirect to="/catalog" />;

  return (
    <form className="form" onSubmit={setInfo}>
      <Row>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="username"
          value={infoForm.username}
          onChange={handleChange}
          disabled
        >
          Имя пользователя
        </Input>
        <Input
          className="col-md-6 mb-3"
          type="email"
          name="email"
          value={infoForm.email}
          onChange={handleChange}
          disabled
        >
          Email
        </Input>
      </Row>

      <Row>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="first_name"
          value={infoForm.first_name}
          onChange={handleChange}
        >
          Имя
        </Input>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="last_name"
          value={infoForm.last_name}
          onChange={handleChange}
        >
          Фамилия
        </Input>
      </Row>

      <Row>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="company"
          value={infoForm.company}
          onChange={handleChange}
        >
          Компания
        </Input>
        <Input
          className="col-md-6 mb-3"
          type="text"
          name="position"
          value={infoForm.position}
          onChange={handleChange}
        >
          Должность
        </Input>
      </Row>

      <ButtonStyledLinkOrButton
        id="submit-btn"
        className="btn btn-primary btn-block mt-2"
        type="submit"
      >
        Сохранить изменения
      </ButtonStyledLinkOrButton>

      <ButtonStyledLinkOrButton
        className="button-unstyled row align-middle text-muted m-2"
        onClick={deleteUser}
      >
        <i className="material-icons m-0">delete_forever</i>
        Удалить аккаунт
      </ButtonStyledLinkOrButton>
    </form>
  );
}

export default UserInfo;
