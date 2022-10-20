import React, { useEffect, useState } from "react";
import { changeMode, addEmpleado } from "../features/userStore";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEmpresa,
  getEmpresas,
  buscarEmpleados,
  URL,
  getTikadas,
} from "../api";
import "./Table.css";
import Piconera from "../assets/Logo-Piconera.png";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function Tikadas() {
  const user = useSelector((state) => state.userStore);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sueldo, setSueldo] = useState(8);
  const [sueldoTotal, setSueldoTotal] = useState(0);
  const [tikadas, setTikadas] = useState([]);
  const [tiempoTrabajado, setTiempoTrabajado] = useState(0);
  const params = useParams();
  const [isDarkMode, setDarkMode] = useState(
    user.mode == "ligth" ? true : false
  );

  const toggleDarkMode = () => {
    if (isDarkMode == true) {
      dispatch(changeMode("dark"));
      setDarkMode(false);
    } else {
      dispatch(changeMode("ligth"));
      setDarkMode(true);
    }
    console.log(isDarkMode);
  };
  function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }
  const DineroGanado = (tiempo, sueldo) => {
    const separar = tiempo.split(":");
    const horasTrabajadas = separar[0];
    const minutosTrabajados = separar[1];
    const minutosTrabajadosEntero = minutosTrabajados / 60;
    const dineroHoras = horasTrabajadas * sueldo;
    const dineroMinutos = minutosTrabajadosEntero * sueldo;
    const dineroTotalGanado = dineroHoras + dineroMinutos;
    return financial(dineroTotalGanado);
  };
  function secondsToString(seconds) {
    var hour = Math.floor(seconds / 3600);
    hour = hour < 10 ? "0" + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = minute < 10 ? "0" + minute : minute;
    var second = seconds % 60;
    second = second < 10 ? "0" + second : second;
    return hour + ":" + minute + ":" + second;
  }
  const loadTikadas = async () => {
    console.log(params)
    const data = await getTikadas(params.id, params.mes, params.year);
    setTikadas(data);
    setSueldo(params.sueldo)
    let dineroPagar = 0;
    let horasTrabajadas = 0;
    let minutosTrabajados = 0;
    const algo = data.map((element, index) => {
      // console.log(DineroGanado(element.totalTrabajado, sueldo));
      //   segundosTrabajados = Number(segundosTrabajados) + Number(element.segundos);
      horasTrabajadas = Number(horasTrabajadas) + Number(element.horas);
      minutosTrabajados = Number(minutosTrabajados) + Number(element.minutos);
      dineroPagar += Number(DineroGanado(element.totalTrabajado, sueldo));
    });
    if (minutosTrabajados > 60) {
      var hrs = Math.floor(minutosTrabajados / 60);
      var min = minutosTrabajados % 60;
      horasTrabajadas = horasTrabajadas + hrs;
      minutosTrabajados = min;
    }
    setSueldoTotal(financial(dineroPagar));
    setTiempoTrabajado(`${horasTrabajadas} h ${minutosTrabajados} min`);
    console.log(dineroPagar)
  };
  useEffect(() => {
    loadTikadas();
    return () => {};
  }, [sueldo]);

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
      <div className="position-relative">
        <div className={`position-absolute top-0 start-50 translate-middle-x darkmode btn btn-${user.mode == "ligth" ? 'dark':'secondary'} p-1`} onClick={toggleDarkMode}> 
          <DarkModeSwitch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            size={22}
          />
        </div>
      </div>

      <div className="row">
        <div
          className={`card bg-${user.mode} text-${
            user.mode == "ligth" ? "dark" : "white"
          }`}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="col">
                <h4 className="p-0 m-0">Jesus</h4>
                <h5 className="p-0 m-0">Luque</h5>
                <p className="p-0 m-0">48789050-R</p>
              </div>
              <div className="col-2 text-center">
                <img
                  src={Piconera}
                  alt="logo"
                  className="col-3"
                  style={{
                    width: "75px",
                    height: "75px",
                    borderRadius: "150px",
                  }}
                />
                <p className="p-0 m-0 fw-bold">Noviembre 2022</p>
              </div>
            </div>
            <table
              className={`table table-striped table-${user.mode} text-${
                user.mode == "ligth" ? "dark" : "white"
              } fs-6`}
            >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Entrada</th>
                  <th scope="col">Salida</th>
                  <th scope="col">Tiempo</th>
                  <th scope="col">Dinero</th>
                </tr>
              </thead>
              <tbody>
                {tikadas.map((tikada, index) => (
                  <tr key={index} className="p-0">
                    <th className="p-0" scope="row">
                      {index + 1}
                    </th>
                    <td className="p-0">{tikada.entradaHumana.slice(0, -3)}</td>
                    <td className="p-0">{tikada.salidaHumana.slice(0, -3)}</td>
                    <td className="p-0">
                      {tikada.horas} h {tikada.minutos} min
                    </td>
                    <td className="p-0">
                      {DineroGanado(tikada.totalTrabajado, sueldo)} €
                    </td>
                  </tr>
                ))}
                <tr>
                  <th className="p-0"></th>
                  <td className="p-0"></td>
                  <td className="p-0 fw-bold">Total</td>
                  <td className="p-0 fw-bold">{tiempoTrabajado}</td>
                  <td className="p-0 fw-bold">{sueldoTotal}€</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
  );
}
