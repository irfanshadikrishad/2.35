import { useState } from "react";
import { useAuth } from "../store/auth.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const {
    storeTokenInLS,
    setIsLoggedIn,
    SERVER_URI,
    errorToast,
    authenticate,
  } = useAuth();
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const handleInput = (e) => {
    const { value, name } = e.target;
    setLogin({ ...login, [name]: value });
  };
  const submit = async (e) => {
    e.preventDefault();
    const request = await fetch(`${SERVER_URI}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });
    const response = await request.json();
    if (request.status === 200) {
      storeTokenInLS(response.token);
      setIsLoggedIn(response.token);
      authenticate();
      navigate("/");
    } else {
      errorToast(response.message);
    }
  };
  return (
    <section className="container register">
      <div>
        <img
          className="register_image"
          src="/login.svg"
          alt="login image"
          draggable="false"
        />
      </div>
      <div>
        <h1>Login</h1>
        <form onSubmit={submit} className="register_form">
          <input
            onChange={handleInput}
            name="email"
            value={login.email}
            type="email"
            placeholder="Your Email"
          />
          <input
            onChange={handleInput}
            name="password"
            value={login.password}
            type="password"
            placeholder="Your Password"
            autoComplete="on"
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
