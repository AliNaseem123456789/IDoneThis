import Navbar from "./components/Navbar";
import NavbarLoggedIn from "./components/NavbarLoggedIn";

const Layout = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn ? <NavbarLoggedIn /> : <Navbar />}
      <main className="flex-grow pt-16">{children}</main>
    </div>
  );
};

export default Layout;
