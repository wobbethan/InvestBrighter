import {
  Route,
  Routes,
  BrowserRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductPage,
  BestSellingPage,
  EventsPage,
  FaqPage,
  ProductDetailsPage,
  OrderSuccessPage,
  ProfilePage,
  CheckoutPage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  ShopHomePage,
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllCoupons,
  ShopAllEvents,
  ShopPreviewPage,
  ShopTeamMembersPage,
  AdminPage,
  AddAdminPage,
  ManageSectionPage,
  ShopAllOrders,
  AdminAllOrdersPage,
  AdminAllCompaniesPage,
  AdminAllUsersPage,
  AdminInvestmentRoundPage,
  AdminManageRoundPage,
  ShopSettingsPage,
  NotFound,
  ForgotPasswordPage,
  ShopForgotPasswordPage,
  ShopPasswordPage,
  OrderFailPage,
  AdminMyOrders,
  AdminChangePassword,
  AdminCreateUsersPage,
} from "./routes/Routes.js";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { loadSeller, loadUser } from "./redux/actions/user";
import Store from "./redux/store";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import { useDispatch, useSelector } from "react-redux";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute.js";

function App() {
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" Component={NotFound} />
        <Route path="/" Component={HomePage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/sign-up" Component={SignupPage} />
        <Route
          path="/activation/:activation_token"
          Component={ActivationPage}
        />
        <Route
          path="/company/activation/:activation_token"
          Component={SellerActivationPage}
        />
        <Route path="/shop/preview/:id" Component={ShopPreviewPage} />
        <Route path="/forgot-password" Component={ForgotPasswordPage} />
        <Route
          path="/company-forgot-password"
          Component={ShopForgotPasswordPage}
        />

        {/* Shop Routes */}
        <Route path="/create-company" Component={ShopCreatePage} />
        <Route path="/company-login" Component={ShopLoginPage} />
        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-info"
          element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-change-password"
          element={
            <SellerProtectedRoute>
              <ShopPasswordPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupons"
          element={
            <SellerProtectedRoute>
              <ShopAllCoupons />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-team"
          element={
            <SellerProtectedRoute>
              <ShopTeamMembersPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />
        <Route path="/best-selling" Component={BestSellingPage} />
        <Route path="/events" Component={EventsPage} />
        <Route path="/faq" Component={FaqPage} />
        <Route path="/order/success/" Component={OrderSuccessPage} />
        <Route path="/order/fail/" Component={OrderFailPage} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage></CheckoutPage>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage></AdminPage>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/manage-admins"
          element={
            <ProtectedAdminRoute>
              <AddAdminPage></AddAdminPage>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/manage-sections"
          element={
            <ProtectedAdminRoute>
              <ManageSectionPage></ManageSectionPage>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminAllOrdersPage></AdminAllOrdersPage>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/my-orders"
          element={
            <ProtectedAdminRoute>
              <AdminMyOrders></AdminMyOrders>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/change-password/:id"
          element={
            <ProtectedAdminRoute>
              <AdminChangePassword></AdminChangePassword>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/admin-companies"
          element={
            <ProtectedAdminRoute>
              <AdminAllCompaniesPage></AdminAllCompaniesPage>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <ProtectedAdminRoute>
              <ProductPage></ProductPage>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/admin-users"
          element={
            <ProtectedAdminRoute>
              <AdminAllUsersPage></AdminAllUsersPage>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedAdminRoute>
              <AdminCreateUsersPage></AdminCreateUsersPage>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/investment-rounds"
          element={
            <ProtectedAdminRoute>
              <AdminInvestmentRoundPage></AdminInvestmentRoundPage>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/manage-rounds"
          element={
            <ProtectedAdminRoute>
              <AdminManageRoundPage></AdminManageRoundPage>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
    </BrowserRouter>
  );
}

export default App;
