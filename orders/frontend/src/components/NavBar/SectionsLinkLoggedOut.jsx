import React from "react";
import SectionLink from "./SectionLink";
import ButtonStyledLinkOrButton from "../Elements/ButtonStyledLinkOrButton";

function SectionsLinkLoggedOut() {
  return (
    <>
      <SectionLink href="/login" className="p-3 text-white">
        Войти
      </SectionLink>
      <ButtonStyledLinkOrButton href="/signup">
        Зарегистроваться
      </ButtonStyledLinkOrButton>
    </>
  );
}

export default SectionsLinkLoggedOut;
