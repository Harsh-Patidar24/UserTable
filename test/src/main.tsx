import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App"; 
import Profile from "./components/ProfilePage";
import RegisterForm from "./components/form/RegisterForm";
import LoginForm from "./components/form/LoginForm";
import UserTable from "./components/UserTable";
const router = createBrowserRouter([
  {
    path: "/", 
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/profile/:id", 
    element: <Profile />, 
  },
  // {
  //   path: "/users",
  //   element: (
  //     <UserTable />
  //   ),
  // },
  
]);

// Mount router
createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
