import React from "react";
import loginimg from "../assets/sha.png";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
const LOGIN_URL = "/authentication/login";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response));
      setAuth(user, pwd);

      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Found");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>you are logged in</h1>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
          <div className="hidden sm:block">
            <img className="w-full h-full object-cover" src={loginimg} alt="" />
          </div>
          <div className="bg-white-800 flex flex-col justify-center">
            <form
              onSubmit={handleSubmit}
              className="max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg"
            >
              <h2 className="text-4xl dark:text-white font-bold text-center">
                <p
                  ref={errRef}
                  className={errMsg ? "errMsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
                Sign In
              </h2>
              <form className="flex flex-col text-gray-400 py-2">
                <label htmlFor="username">Username</label>
                <input
                  className="rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                  type="text"
                  id="username"
                  ref={userRef}
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                />

                <div className="flex flex-col text-gray-400 py-2">
                  <label htmlFor="password">Password</label>
                  <input
                    className=" rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                  />
                </div>
              </form>
              <div>
                <button className="w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/ hover:shadow-teal-500/40 text-white font-semibold rounded-lg">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
