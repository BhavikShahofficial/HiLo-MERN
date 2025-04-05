import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import AdminOrders from "./pages/admin/orders";
import AdminFeatures from "./pages/admin/features";
import ShopLayout from "./components/shopper/layout";
import NotFound from "./pages/not-found/notfound";
import ShopperAccount from "./pages/shopper/account";
import ShopperListing from "./pages/shopper/listing";
import ShopperCheckout from "./pages/shopper/checkout";
import ShopperHome from "./pages/shopper/home";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/un-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/authSlice/index";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopper/paypal-return";
import PaymentSuccessPage from "./pages/shopper/payment-success";
import ShopperSearch from "./pages/shopper/search";
import AuthForgotPassword from "./pages/auth/forgot-password";
import AuthResetPassword from "./pages/auth/reset-password";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const rawToken = sessionStorage.getItem("token");
    if (rawToken) {
      const token = JSON.parse(rawToken); // ✅ Parse it before using
      dispatch(checkAuth(token));
    }
  }, [dispatch]);

  if (isLoading) {
    return (
      <Skeleton className="w-full max-w-md h-64 bg-muted mx-auto mt-20 rounded-xl" />
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />}
        />

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<AuthForgotPassword />} />
          <Route path="reset-password/:token" element={<AuthResetPassword />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShopLayout />
            </CheckAuth>
          }
        >
          <Route path="account" element={<ShopperAccount />} />
          <Route path="home" element={<ShopperHome />} />
          <Route path="listing" element={<ShopperListing />} />
          <Route path="checkout" element={<ShopperCheckout />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<ShopperSearch />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/unauth-page" element={<UnauthPage />} />
      </Routes>
    </div>
  );
}

export default App;
