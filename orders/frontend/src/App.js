import React from "react";
import "./css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Content from "./components/Content/Content";
import Catalog from "./components/Content/Catalog/Catalog";
import Notification from "./components/Elements/Notification";
import Signup from "./components/Content/Authentication/Signup";
import Login from "./components/Content/Authentication/Login";
import Logout from "./components/Content/Authentication/Logout";
import Confirmation from "./components/Content/Authentication/Confirmation";
import ShopProducts from "./components/Content/Catalog/ShopProducts";
import Settings from "./components/Content/Settings/Settings";
import RegiserShop from "./components/Content/UserShop/RegiserShop";
import OrderTabs from "./components/Content/Orders/OrdersTabs";
import Cart from "./components/Content/Cart/Cart";
import OrderingThanks from "./components/Content/Ordering/OderingThanks";
import UserShopProducts from "./components/Content/UserShop/UserShopProducts";
import ProductInfo from "./components/Content/Catalog/ProductCard/ProductInfo";

function App() {
  return (
    <div className="App">
      <Notification />
      <NavBar />
      <Content>
        <Router>
          <div>
            <Route path="/catalog" component={Catalog} />
            <Route path="/shop/:id" component={ShopProducts} />
            <Route path="/products/:id" component={ProductInfo} />
            <Route path="/" render={() => <Redirect to="/catalog" />} exact />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/confirm/:username" component={Confirmation} />
            <Route path="/settings" component={Settings} />
            <Route path="/regiser_shop" component={RegiserShop} />
            <Route path="/orders" component={OrderTabs} />
            <Route path="/cart" component={Cart} />
            <Route path="/thankyou/:order_id" component={OrderingThanks} />
            <Route path="/my_shop" component={UserShopProducts} />
          </div>
        </Router>
      </Content>
      <Footer />
    </div>
  );
}

export default App;
