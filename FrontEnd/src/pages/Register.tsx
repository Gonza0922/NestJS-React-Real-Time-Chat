import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../contexts/UserContext";
import { RegisterData } from "../interfaces/user.interfaces";

export function Register() {
  const { user, isAuthenticated, signUp, error } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate(`/users/${user.name}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit((data) => {
    signUp(data);
  });

  return (
    <>
      <form className="form-login-register" onSubmit={onSubmit}>
        <h1 className="title-login-register">Register</h1>
        <div className="container-errors">
          {error === "Email already exists" ? <div className="error">{error}</div> : <div></div>}
        </div>
        <div className="row-input">
          <div className="input-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="validate"
              autoComplete="off"
              spellCheck={false}
              {...register("name", {
                required: { value: true, message: "Name is required" },
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
            />
            <div className="container-span">
              {errors.name && <span>{errors.name.message}</span>}
            </div>
          </div>
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
                minLength: { value: 5, message: "Password must be at least 5 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).+$/,
                  message: "Password must contain at least 1 uppercase letter and a number",
                },
              })}
            />
            <div className="container-span">
              {errors.password && <span>{errors.password.message}</span>}
            </div>
          </div>
          <div className="linkTo-login-register-span">
            <span>Already have an account? </span>
            <Link className="linkTo-login-register" to="/login">
              Sign In
            </Link>
          </div>
          <div className="container-button-login-register">
            <button type="submit" id="reserve" className="button-login-register">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Register;
