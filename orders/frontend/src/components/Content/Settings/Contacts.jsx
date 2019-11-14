import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ContactForm from "./ContactForm";
import Contact from "./Contact";
import GetContacts from "../../../requests/GetContacts";
import ManageContact from "../../../requests/ManageContact";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function Contacts(props) {
  const { contactHandleClick, chosenClassName } = props;
  const [contactList, setContactList] = useState([]);
  const [formIsShown, setFormIsShown] = useState(false);
  const [submitState, setSubmitState] = useState("add");
  const [chosenContact, setchosenContact] = useState(null);

  const fields = {
    city: "",
    street: "",
    house: "",
    structure: "",
    building: "",
    apartment: "",
    phone: "",
    id: ""
  };

  const [contactForm, setContactForm] = useState({
    ...fields
  });

  const [errorState, setErrorState] = useState({
    ...fields
  });

  const cleanForm = () => {
    setContactForm({ ...fields });
  };

  const cleanErrors = () => {
    setErrorState({ ...fields });
  };

  const getContacts = () => {
    const onSucsess = contacts => {
      setContactList(contacts);
    };
    GetContacts(onSucsess, onFail);
  };

  const addContact = () => {
    ManageContact(onSuccess, onFail, "POST", contactForm);
  };

  const addContactSubmit = () => {
    setSubmitState("add");
    setFormIsShown(true);
  };

  const editContact = id => {
    setFormIsShown(true);
    const contact = contactList.find(el => el.id === id);
    setContactForm(contact);
    setSubmitState("edit");
  };

  const editContactSubmit = () => {
    ManageContact(onSuccess, onFail, "PUT", contactForm);
  };

  const delContact = id => {
    ManageContact(onSuccess, onFail, "DELETE", { id: id });
  };

  const onSuccess = () => {
    getContacts();
    cleanForm();
    cleanErrors();
    setFormIsShown(false);
  };

  const onFail = err => {
    setErrorState(err);
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      {contactList.length <= 0 ? (
        <p>Чтобы добавить контакт нажмите на кнопку "Добавить контакт"</p>
      ) : (
        <div className="list-group">
          {contactList.map(contact => (
            <Contact
              key={contact.id}
              contact={contact}
              editContact={editContact}
              delContact={delContact}
              contactHandleClick={contactHandleClick}
              setchosenContact={setchosenContact}
              className={contact === chosenContact ? chosenClassName : ""}
            />
          ))}
        </div>
      )}
      <ButtonStyledLinkOrButton
        className={
          formIsShown
            ? "not_displayed"
            : "btn btn-outline-secondary btn-sm mt-3"
        }
        onClick={addContactSubmit}
      >
        + Добавить контакт
      </ButtonStyledLinkOrButton>

      <ContactForm
        formIsShown={formIsShown}
        setFormIsShown={setFormIsShown}
        contactForm={contactForm}
        setContactForm={setContactForm}
        submitFunction={submitState === "add" ? addContact : editContactSubmit}
        errors={errorState}
        cleanForm={cleanForm}
        cleanErrors={cleanErrors}
      />
    </>
  );
}

Contacts.defaultProps = {
  contactHandleClick: () => {},
  chosenClassName: ""
};

Contacts.propTypes = {
  contactHandleClick: PropTypes.func,
  chosenClassName: PropTypes.string
};

export default Contacts;
