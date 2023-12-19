import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Signin from "./pages/Signin.jsx";
import Loading from "./components/Loading.jsx";
import Register from "./pages/Register.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path : "/login",
        element: <Signin />
      },
      {
        path: "/register",
        element: <Register />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster />
    <Loading />
    <RouterProvider router={router} />
  </Provider>
);
