import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import authService from "./services/AuthService";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { login } from "./store/slices/user";
import { useDispatch } from "react-redux";


function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      localStorage.getItem("user") !== undefined &&
      localStorage.getItem("user") !== null
    ) {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Data Retrieved", user);
      dispatch(login(user));
      authService
        .getCurrentUser(user?.token)
        .then((res) => {
          if (res) {
          } else {
            dispatch(signout());
            console.log("Oops !!! Token is invalid");
            localStorage.setItem("user", null);
          }
        })
        .catch((err) => {
          dispatch(signout());
          console.log("Oops !!! Token is invalid");
          localStorage.setItem("user", null);
        });
    }
  }, []);


  return (
    <>
    {
      !location.pathname.includes("/interview/") ? (<Header />):(null)
    }
      
      <Outlet />
      {
      !location.pathname.includes("/interview/") ? (<Footer />):(null)
      }
    </>
  );
}

export default App;
