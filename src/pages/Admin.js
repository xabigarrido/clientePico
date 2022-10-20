import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeMode, addEmpleado } from "../features/userStore";
import { API } from "../api";
import {useNavigate} from 'react-router-dom'
export default function Admin() {
  const user = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(user);
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  if (user.mode == "ligth") {
    document.body.style.backgroundColor = "#E9E9E9";
  } else {
    document.body.style.backgroundColor = "gray";
  }
  const handleLogin = async () => {
    try {
      const data = await fetch(`${API}/empleados/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userLogin),
      });
      const res = await data.json();
      if (res[0] == true) {
       dispatch(addEmpleado(res[1]));
       navigate('/paneladmin')
      } else {

        alert(res[1].message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className={`card bg-${user.mode} align-items-center`}>
          {/* <div className={`text-${user.mode == "ligth" ? "dark" : "white"}`}>
            Probando
          </div> */}
          <div className="mb-3 mt-2">
            {/* <label for="email" className={`form-label text-${user.mode == "ligth" ? "dark" : "white"}`}>
              Correo Electronico o DNI
            </label> */}
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Correo electronico o DNI Piconera"
              onChange={(event) =>
                setUserLogin({ ...userLogin, email: event.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              onChange={(event) =>
                setUserLogin({ ...userLogin, password: event.target.value })
              }
            />
          </div>
          <button
            className="btn btn-success mb-2"
            onClick={() => handleLogin()}
          >
            Entrar
          </button>
          {user.mode == "ligth" ? (
            <div
              className="btn btn-primary"
              onClick={() => {
                console.log("first");
                dispatch(changeMode("dark"));
              }}
            >
              Cambiar a oscuro
            </div>
          ) : (
            <div
              className="btn btn-primary"
              onClick={() => {
                console.log("first");
                dispatch(changeMode("ligth"));
              }}
            >
              Cambiar a ligth
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
