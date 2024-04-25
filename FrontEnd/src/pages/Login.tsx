import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../contexts/UserContext";
import { LoginData } from "../interfaces/user.interface";

export function Login() {
  const { user, setUser, login, isAuthenticated, error } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(`/users/${user.name}`);
  }, [isAuthenticated]);

  const onSubmit = handleSubmit((data) => {
    login(data);
    setUser(data);
  });

  return (
    <>
      <form className="form-login-register" onSubmit={onSubmit}>
        <h1 className="title-login-register">Login</h1>
        <div className="container-errors">
          {error === "User not found" ? (
            <div className="error">{error}</div>
          ) : error === "Incorrect Password" ? (
            <div className="error">{error}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="row-input">
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9-]+\.com$/,
                  message: "Invalid Email",
                },
              })}
            />
            <div className="container-span">
              {errors.email && <span>{errors.email.message}</span>}
            </div>
          </div>
        </div>
        <div className="row-input">
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("password", {
                required: { value: true, message: "Password is required" },
              })}
            />
            <div className="container-span">
              {errors.password && <span>{errors.password.message}</span>}
            </div>
          </div>
          <div className="linkTo-login-register-span">
            <span>Need an entity account?</span>
            <Link className="linkTo-login-register" to="/register">
              Sign Up
            </Link>
          </div>
          <div className="container-button-login-register">
            <button type="submit" id="reserve" className="button-login-register">
              Sign In
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
