import React from "react";
import PropTypes from "prop-types";
import Contacts from "../Settings/Contacts";

function OderingContact({ switchTab, contact, setcontact }) {
  const contactHandleClick = clicked => {
    setcontact(clicked);
  };

  return (
    <div>
      <div className="mt-3">
        <p>Выберите контакт кликнув по нему или добвьте новый</p>
        <Contacts
          contactHandleClick={contactHandleClick}
          chosenClassName="bg-chosen border rounded border-success"
        />
      </div>
      <div className="d-flex justify-content-between ">
        <button onClick={() => switchTab(false)} className="btn btn-secondary">
          <i className="material-icons align-middle">chevron_left</i>
          Назад
        </button>

        <button
          onClick={() => switchTab(true)}
          className="btn btn-success"
          disabled={!contact}
        >
          Подтвердить выбор
          <i className="material-icons align-middle">chevron_right</i>
        </button>
      </div>
    </div>
  );
}

OderingContact.propTypes = {
  switchTab: PropTypes.func.isRequired,
  contact: PropTypes.object.isRequired,
  setcontact: PropTypes.func.isRequired
};

export default OderingContact;
