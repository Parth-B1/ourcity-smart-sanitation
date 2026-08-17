import { useState } from "react";
import type { FormEvent } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  login,
  type UserRole,
} from "../services/authService";


function getRolePath(role: UserRole) {
  switch (role) {
    case "nmc_officer":
      return "/dashboard";

    case "truck_operator":
      return "/truck";

    case "citizen":
    default:
      return "/";
  }
}


function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(
        username,
        password,
      );

      const from =
        (
          location.state as
            | { from?: string }
            | null
        )?.from;

      navigate(
        from ||
          getRolePath(result.user.role),
        { replace: true },
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="login-logo">
            OC
          </div>

          <h1>
            Welcome to OurCity
          </h1>

          <p>
            Municipal waste intelligence
            platform
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <label>
            Username

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value,
                )
              }
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </label>


          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>


        <div className="demo-accounts">

          <p>
            Demo accounts
          </p>

          <button
            type="button"
            onClick={() => {
              setUsername("citizen");
              setPassword("citizen123");
            }}
          >
            👤 Citizen
          </button>

          <button
            type="button"
            onClick={() => {
              setUsername("nmc");
              setPassword("nmc123");
            }}
          >
            🏢 NMC Officer
          </button>

          <button
            type="button"
            onClick={() => {
              setUsername("truck104");
              setPassword("truck123");
            }}
          >
            🚛 Truck Operator
          </button>

        </div>

      </div>
    </div>
  );
}

export default Login;