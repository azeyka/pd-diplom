import React from "react";

function ActiveTab({ children }) {
  return (
    <div className="tab-content mt-4">
      <div className="container tab-pane active">{children}</div>
    </div>
  );
}

export default ActiveTab;
