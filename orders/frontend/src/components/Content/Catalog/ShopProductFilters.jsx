import React from "react";
import Filters from "../../Elements/Filters";

function ShopProductFilters({ handleClick, productList, categories }) {
  return (
    <section className="filters">
      {productList.length > 0 ? (
        <Filters handleClick={handleClick} filters={categories} />
      ) : (
        <p className="ml-4">Нет товаров</p>
      )}
    </section>
  );
}

ShopProductFilters.propTypes = {};

export default ShopProductFilters;
