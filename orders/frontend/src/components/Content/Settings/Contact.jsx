import React from "react";
import PropTypes from "prop-types";
import Title from "../../Elements/Title";

function Contact(props) {
  const {
    contact,
    editContact,
    delContact,
    contactHandleClick,
    className,
    setchosenContact
  } = props;

  const ucFirst = str => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleClick = () => {
    contactHandleClick(contact);
    setchosenContact(contact);
  };

  return (
    <>
      <div
        className={`list-group-item d-flex justify-content-between lh-condensed ${className}`}
        onClick={handleClick}
      >
        <div>
          <Title className="my-0 h6">{ucFirst(contact.city)}</Title>
          <small className="text-muted m-0">
            ул.{ucFirst(contact.street)}, д.{contact.house},
            {contact.structure ? `корп.${contact.structure}, ` : ""}
            {contact.building ? `стр.${contact.building}, ` : ""}
            {contact.apartment ? `кв.${contact.apartment}, ` : ""}
          </small>
          <small className="row text-muted m-0">{contact.phone}</small>
        </div>
        <div className="row align-middle">
          <button
            onClick={() => editContact(contact.id)}
            className="p-3 button-unstyled text-muted"
          >
            <i className="material-icons">edit</i>
          </button>
          <button
            onClick={() => delContact(contact.id)}
            className="p-3 button-unstyled text-muted"
          >
            <i className="material-icons">delete_forever</i>
          </button>
        </div>
      </div>
    </>
  );
}

Contact.propTypes = {
  contact: PropTypes.object.isRequired,
  editContact: PropTypes.func.isRequired,
  delContact: PropTypes.func.isRequired,
  contactHandleClick: PropTypes.func,
  className: PropTypes.string,
  setchosenContact: PropTypes.func
};

export default Contact;
