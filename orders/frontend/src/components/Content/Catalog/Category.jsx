import React, { useState } from "react";
import PropTypes from "prop-types";
import CategoryProducts from "./CategoryProducts";

function Category({ category }) {
  const [isEmpty, setisEmpty] = useState(true);

  return (
    <>
      <div
        className={
          isEmpty
            ? "not_displayed"
            : "list-group-item d-flex justify-content-between lh-condensed bg-light"
        }
      >
        <div>
          <h6 className="my-0">{category.name}</h6>
        </div>
      </div>
      <CategoryProducts
        category={category}
        isEmpty={isEmpty}
        setisEmpty={setisEmpty}
      />
    </>
  );
}

Category.propTypes = {
  category: PropTypes.object.isRequired
};

export default Category;
