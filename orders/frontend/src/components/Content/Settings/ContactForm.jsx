import React from "react";
import PropTypes from "prop-types";
import Input from "../../Elements/Input";
import Row from "../../Elements/Row";
import ButtonStyledLinkOrButton from "../../Elements/ButtonStyledLinkOrButton";

function ContactForm(props) {
  const {
    formIsShown,
    setFormIsShown,
    contactForm,
    setContactForm,
    submitFunction,
    errors,
    cleanForm,
    cleanErrors
  } = props;

  const handleChange = event => {
    const { name, value } = event.target;
    setContactForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleCancel = () => {
    cleanForm();
    cleanErrors();
    setFormIsShown(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    submitFunction();
  };

  return (
    <form
      className={
        formIsShown ? "mt-1 p-4 bg-light list-group-item" : "not_displayed"
      }
    >
      <Row>
        <Input
          className="col-md-5 mb-3"
          type="text"
          name="city"
          value={contactForm.city}
          onChange={handleChange}
          error={errors.city}
          required
        >
          Город
        </Input>
        <Input
          className="col-md-5 mb-3"
          type="text"
          name="street"
          value={contactForm.street}
          onChange={handleChange}
          error={errors.street}
          required
        >
          Улица
        </Input>
        <Input
          className="col-md-2 mb-3"
          type="text"
          name="house"
          value={contactForm.house}
          onChange={handleChange}
          error={errors.house}
          required
        >
          Дом
        </Input>
      </Row>

      <Row>
        <Input
          className="col-md-4 mb-3"
          type="text"
          name="structure"
          value={contactForm.structure}
          onChange={handleChange}
        >
          Корпус
        </Input>
        <Input
          className="col-md-4 mb-3"
          type="text"
          name="building"
          value={contactForm.building}
          onChange={handleChange}
        >
          Строение
        </Input>
        <Input
          className="col-md-4 mb-3"
          type="text"
          name="apartment"
          value={contactForm.apartment}
          onChange={handleChange}
        >
          Квартира
        </Input>
      </Row>

      <Input
        className="mb-3"
        type="phone"
        name="phone"
        value={contactForm.phone}
        onChange={handleChange}
        error={errors.phone}
        required
      >
        Телефон
      </Input>

      <div className="text-center">
        <ButtonStyledLinkOrButton
          onClick={handleCancel}
          className="btn btn-outline-secondary btn-inline-block col-md-5 m-2"
        >
          Отменить
        </ButtonStyledLinkOrButton>

        <ButtonStyledLinkOrButton
          onClick={handleSubmit}
          id="submit-btn"
          className="btn btn-primary col-md-5 m-2"
          type="submit"
        >
          Сохранить
        </ButtonStyledLinkOrButton>
      </div>
    </form>
  );
}

ContactForm.propTypes = {
  formIsShown: PropTypes.bool.isRequired,
  setFormIsShown: PropTypes.func.isRequired,
  contactForm: PropTypes.object.isRequired,
  setContactForm: PropTypes.func.isRequired,
  submitFunction: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  cleanForm: PropTypes.func.isRequired,
  cleanErrors: PropTypes.func.isRequired
};

export default ContactForm;
