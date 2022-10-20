import React from 'react'
import { changeMode, addEmpleado } from "../features/userStore";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmpresa, getEmpresas, buscarEmpleados, URL } from "../api";

export default function Tikadas() {
    const user = useSelector((state) => state.userStore);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    if (user.empleado == null) {
        // return navigate("/");
      }
      if (user.mode == "ligth") {
        document.body.style.backgroundColor = "#E9E9E9";
      } else {
        document.body.style.backgroundColor = "gray";
      }
  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className={`card bg-${user.mode} text-${user.mode == 'ligth' ? 'dark' : 'white'}`}>
                <div className="card-body">
                    <p>edwe</p>
                </div>
            </div>
        </div>
    </div>
  )
}
