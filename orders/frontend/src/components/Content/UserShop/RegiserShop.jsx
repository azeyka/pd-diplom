import React, { useCallback, useState } from "react";
import { useStore } from "../../../store/useStore";
import Input from "../../Elements/Input";
import { Redirect } from "react-router-dom";
import ManageShopInfo from "../../../requests/ManageShopInfo";
import Title from "../../Elements/Title";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function RegiserShop() {
  const { dispatch } = useStore();
  const setShopInfo = useCallback(
    params => dispatch({ type: "setShopInfo", params: params }),
    [dispatch]
  );

  const fields = {
    name: "",
    url: "",
    agreement: false
  };

  const [regForm, setRegForm] = useState({
    ...fields
  });

  const [errorState, setErrorState] = useState({
    ...fields
  });

  const [shopIsRegistered, setshopIsRegistered] = useState(false);

  const handleChange = ({ target }) => {
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setRegForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const register = event => {
    event.preventDefault();
    ManageShopInfo(onSucsess, onFail, "POST", regForm);
  };

  const onSucsess = info => {
    setShopInfo(info);
    setshopIsRegistered(true);
  };

  const onFail = errors => {
    for (let field in errorState) {
      if (field in errors) {
        setErrorState(prevForm => ({ ...prevForm, [field]: errors[field] }));
      } else {
        setErrorState(prevForm => ({ ...prevForm, [field]: "" }));
      }
    }
  };

  if (shopIsRegistered) return <Redirect to="/my_shop" />;
  return (
    <form id="reg-form" className="form col-7 m-auto" onSubmit={register}>
      <Title className="mb-3 mt-3 text-center">Регистрация магазина</Title>

      <Input
        className="mb-3"
        type="text"
        name="name"
        value={regForm.name}
        onChange={handleChange}
        error={errorState.name}
        required
      >
        Название магазина
      </Input>

      <Input
        className="mb-3"
        type="link"
        name="url"
        value={regForm.url}
        onChange={handleChange}
        error={errorState.url}
      >
        Ссылка на сайт (не обязательно)
      </Input>

      <input
        className="mr-2"
        type="checkbox"
        name="agreement"
        checked={regForm.agreement}
        onChange={handleChange}
        required
      />
      <label htmlFor="agreement">
        Согласен с <a href="/">условиями</a>
      </label>
      <ButtonStyledLinkOrButton
        className="btn btn-primary btn-lg btn-block"
        type="submit"
      >
        Зарегистрировать
      </ButtonStyledLinkOrButton>
    </form>
  );
}

export default RegiserShop;
