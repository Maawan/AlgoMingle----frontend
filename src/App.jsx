import { Outlet } from "react-router";
import Header from "./components/Header";
import authService from "./services/AuthService";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
