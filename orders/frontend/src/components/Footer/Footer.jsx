import React from "react";

export default function Footer() {
  return (
    <footer className="mt-4 py-3 text-muted text-center border-top text-small">
      <p className="mb-1">&copy; 2017-2019 Магазин</p>
      <ul className="list-inline">
        <li className="list-inline-item">
          <a href="/">Privacy</a>
        </li>
        <li className="list-inline-item">
          <a href="/">Terms</a>
        </li>
        <li className="list-inline-item">
          <a href="/">Support</a>
        </li>
      </ul>
    </footer>
  );
}
