import React, { useCallback, useState } from "react";
import { useStore } from "../../../store/useStore";
import Input from "../../Elements/Input";
import GetShopInfo from "../../../requests/GetShopInfo";
import ManageShopInfo from "../../../requests/ManageShopInfo";

function UserShopInfo() {
  const { dispatch, state } = useStore();
  const showNotification = useCallback(
    params => dispatch({ type: "show", params: params }),
    [dispatch]
  );
  const setShopInfo = useCallback(
    params => dispatch({ type: "setShopInfo", params: params }),
    [dispatch]
  );
  const delShopInfo = useCallback(() => dispatch({ type: "delShopInfo" }), [
    dispatch
  ]);

  const [infoForm, setInfoForm] = useState({
    name: "",
    url: ""
  });

  const [errorState, setErrorState] = useState({
    name: "",
    url: ""
  });

  const [isInfoGet, setisInfoGet] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setInfoForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const getShopInfo = () => {
    const onSucsess = info => {
      setInfoForm(info);
      setShopInfo(info);
    };

    const onFail = err => {
      showNotification({ message: err.toString(), isSuccess: false });
    };

    GetShopInfo(onSucsess, onFail);
  };

  const editShopInfo = event => {
    event.preventDefault();
    const onSucsess = () => {
      showNotification({ message: "Успешно сохранено.", isSuccess: true });
      getShopInfo();
      onFail([]);
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

    ManageShopInfo(onSucsess, onFail, "PUT", infoForm);
  };

  const deleteShop = event => {
    event.preventDefault();

    const onSucsess = () => {
      showNotification({ message: "Успешно удалено.", isSuccess: true });
      delShopInfo();
    };

    const onFail = err => {
      showNotification({ message: err.toString(), isSuccess: false });
    };

    ManageShopInfo(onSucsess, onFail, "DELETE");
  };

  if (state.userInfo.type === "shop" && !isInfoGet) {
    setisInfoGet(true);
    getShopInfo();
  }

  return (
    <div>
      {state.userInfo.type === "shop" ? (
        <div>
          <form className="mb-3" onSubmit={editShopInfo}>
            <Input
              className="mb-3"
              type="text"
              name="name"
              value={infoForm.name}
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
              value={infoForm.url}
              onChange={handleChange}
              error={errorState.url}
            >
              Ссылка на сайт
            </Input>
            <button
              id="submit-btn"
              className="btn btn-primary btn-block"
              type="submit"
            >
              Сохранить изменения
            </button>
          </form>

          <a
            className="row align-middle text-muted m-2"
            href="/"
            onClick={deleteShop}
          >
            <i className="material-icons m-0">delete_forever</i>
            Удалить магазин и все товары
          </a>
          <div className="error">{errorState.delete}</div>
        </div>
      ) : (
        <p>
          Ваш аккаунт не зарегистрирован как магазин, хотите
          <a href="/regiser_shop"> зарегистрировать</a>?
        </p>
      )}
    </div>
  );
}

export default UserShopInfo;
