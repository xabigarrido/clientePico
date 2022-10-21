import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmpresa, getEmpresas, buscarEmpleados, URL } from "../api";
import Piconera from "../assets/Logo-Piconera.png";
import Antique from "../assets/Logo-Antique.png";
import Rosso from "../assets/Logo-ROSSO.png";
import { AiFillIdcard, AiOutlineWhatsApp } from "react-icons/ai";
import { changeMode, addEmpleado } from "../features/userStore";
import moment from "moment";
import "moment/locale/es";
moment.locale("es-ES");

export default function PanelAdmin() {
  const user = useSelector((state) => state.userStore);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pickEmpresa, setPickEmpresa] = useState("null");
  const [empresas, setEmpresas] = useState([]);
  const [empresaActual, setEmpresaActual] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [buscarRango, setBuscarRango] = useState(null);
  const [empleadosFound, setEmpleadosFound] = useState([]);
  const [pickEmpleado, setPickEmpleado] = useState({});
  const [pickMes, setPickMes] = useState(moment().format("MMMM").toLowerCase());
  const [pickYear, setPickYear] = useState(moment().format("YYYY"));
  const [sueldo, setSueldo] = useState(0);
  if (user.empleado == null) {
    // return navigate("/");
  }
  if (user.mode == "ligth") {
    document.body.style.backgroundColor = "#E9E9E9";
  } else {
    document.body.style.backgroundColor = "gray";
  }
  const loadEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };
  const loadEmpresa = async (id) => {
    const data = await getEmpresa(id);
    const dataEmpleados = await buscarEmpleados({ empresa: data._id });
    setEmpleados(dataEmpleados);
    setEmpresaActual(data);
  };
  useEffect(() => {
    loadEmpresas();
    return () => {};
  }, []);
  useEffect(() => {
    if (pickEmpresa != "null") {
      loadEmpresa(pickEmpresa);
    }
    return () => {};
  }, [pickEmpresa]);
  const loadEmpleados = async (action) => {
    const data = await buscarEmpleados(action);
    setEmpleados(data);
  };
  useEffect(() => {
    if (buscarRango != null) {
      loadEmpleados(buscarRango);
    }

    return () => {};
  }, [buscarRango]);

  const handleBuscar = (text) => {
    console.log(text);
    if (text == "") {
      setEmpleadosFound([]);
    } else {
      let foundEmpleados = empleados.filter((empleado) => {
        if (
          empleado.nombre
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          empleado.dni.toString().toLowerCase().includes(text.toLowerCase()) ||
          empleado.apellidos
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          empleado.nombreCompleto
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase())
        ) {
          return empleado;
        }
      });
      setEmpleadosFound(foundEmpleados);
    }
  };

  return (
    <div className="container">
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
      <div className="justify-content-center mt-2">
        <div
          className={`card p-2 bg-${user.mode} text-${
            user.mode == "ligth" ? "dark" : "white"
          } mb-1`}
        >
          <div className="row justify-content-center">
            <img
              onClick={() => {
                setPickEmpresa("6350346b5e2286c0a43467c4");
              }}
              src={Piconera}
              alt="logo"
              className="col-4"
              style={{ width: "170px", height: "150px", borderRadius: "150px" }}
            />
            <img
              onClick={() => {
                setPickEmpresa("635034a45e2286c0a43467c6");
              }}
              src={Antique}
              alt="logo"
              className="col-4"
              style={{ width: "170px", height: "150px", borderRadius: "150px" }}
            />
            <img
              onClick={() => {
                setPickEmpresa("635034ab5e2286c0a43467c8");
              }}
              src={Rosso}
              alt="logo"
              className="col-4"
              style={{ width: "170px", height: "150px", borderRadius: "150px" }}
            />
          </div>
          {/* <button className="btn btn-success w-25 mt-1">Seleccionar</button> */}
          {pickEmpresa != "null" && (
            <div className="justify-content-center align-items-center row">
              <h1 className="text-center">{empresaActual.nombreEmpresa}</h1>
              <select
                onChange={(event) => {
                  if (event.target.value == "Todos") {
                    setBuscarRango({ empresa: empresaActual._id });
                  } else {
                    setBuscarRango({
                      rango: event.target.value,
                      empresa: empresaActual._id,
                    });
                  }
                }}
                className={`form-select w-25 mb-1 bg-${user.mode} text-${
                  user.mode == "ligth" ? "dark" : "white"
                }`}
                aria-label="Default select example"
              >
                <option defaultValue={""}>Seleccionar puesto de trabajo</option>
                <option value="Todos">Todos los empleados</option>
                <option value="Empleado">Empleado</option>
                <option value="Limpieza">Limpieza</option>
                <option value="RRPP">RRPP</option>
                <option value="Portero">Portero</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="DJ">DJ</option>
                <option value="Bandeja">Bandeja</option>
                <option value="Cachimbero">Cachimbero</option>
                <option value="Camarero barra">Camarero barra</option>
                <option value="Encargado">Encargado</option>
                <option value="Administrador">Administrador</option>
              </select>
              <div className="justify-content-center row">
                <input
                  type="text"
                  onChange={(e) => {
                    handleBuscar(e.target.value);
                  }}
                  placeholder="Buscar por nombre, apellido o DNI"
                  className={`form-control bg-${user.mode} text-${
                    user.mode == "ligth" ? "dark" : "white"
                  } w-50 col-2 me-2`}
                />
                {/* <button className="btn btn-success col-2">Buscar</button> */}
              </div>
            </div>
          )}
        </div>

        {empleadosFound.length != 0 && (
          <div
            className={`card p-2 bg-${user.mode} text-${
              user.mode == "ligth" ? "dark" : "white"
            }`}
          >
            <div className="row p-2 justify-content-center">
              {empleadosFound.map((empleado) => (
                <div
                  key={empleado._id}
                  className={`card col-sm-12 col-lg-3 col-xl-2 col-12 shadow-sm bg-${
                    user.mode
                  } text-${user.mode == "ligth" ? "dark" : "white"} col-2 m-1`}
                >
                  <img
                    src={`${URL}/${empleado.foto}`}
                    style={{ borderRadius: "50px" }}
                    className="p-1"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{empleado.nombre}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {empleado.apellidos}
                    </h6>
                    <p className="card-text fs-6">
                      <AiFillIdcard size="1.5em" />
                      {empleado.dni} <br /> <AiOutlineWhatsApp size="1.5em" />{" "}
                      {empleado.telefono}
                    </p>
                    {empleado.tikado == true ? (
                      <button className="btn btn-success mb-1">
                        Trabajando
                      </button>
                    ) : (
                      <button className="btn btn-secondary mb-1">
                        Descansando
                      </button>
                    )}
                    {empleado.habilitadoUser == false && (
                      <button className="btn btn-danger mb-1">
                        Cuenta Suspendida
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => setPickEmpleado(empleado)}
                    >
                      Ver tikadas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {empleadosFound.length == 0 && (
          <>
            {empleados.length != 0 && (
              <div
                className={`card p-2 bg-${user.mode} text-${
                  user.mode == "ligth" ? "dark" : "white"
                }`}
              >
                <h1 className="text-center">
                  {buscarRango != null ? buscarRango.rango : "Todos"}{" "}
                  <span className="badge bg-secondary">{empleados.length}</span>{" "}
                </h1>
                <div className="row p-2 justify-content-center">
                  {empleados.map((empleado) => (
                    <div
                      key={empleado._id}
                      className={`card col-sm-12 col-lg-3 col-xl-2 col-12 shadow-sm bg-${
                        user.mode
                      } text-${
                        user.mode == "ligth" ? "dark" : "white"
                      } col-2 m-1`}
                    >
                      <img
                        src={`${URL}/${empleado.foto}`}
                        style={{ borderRadius: "50px" }}
                        className="p-1"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{empleado.nombre}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {empleado.apellidos}
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {empleado.rango}
                        </h6>
                        <p className="card-text fs-6">
                          <AiFillIdcard size="1.5em" />
                          {empleado.dni} <br />{" "}
                          <AiOutlineWhatsApp size="1.5em" /> {empleado.telefono}
                        </p>
                        {empleado.tikado == true ? (
                          <button className="btn btn-success mb-1">
                            Trabajando
                          </button>
                        ) : (
                          <button className="btn btn-secondary mb-1">
                            Descansando
                          </button>
                        )}
                        {empleado.habilitadoUser == false && (
                          <button className="btn btn-danger mb-1">
                            Cuenta Suspendida
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => setPickEmpleado(empleado)}
                        >
                          Ver tikadas
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div
              className={`modal-header bg-${user.mode} text-${
                user.mode == "ligth" ? "dark" : "white"
              }`}
            >
              <h5 className="modal-title" id="exampleModalLabel">
                {pickEmpleado.nombre} {pickEmpleado.apellidos}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className={`modal-body bg-${user.mode} text-${
                user.mode == "ligth" ? "dark" : "white"
              }`}
            >
              <select
                onChange={(event) => {
                  setPickMes(event.target.value);
                }}
                className={`form-select w-25 mb-1 bg-${user.mode} text-${
                  user.mode == "ligth" ? "dark" : "white"
                }`}
                aria-label="Default select example"
              >
                <option value={moment().format("MMMM").toLowerCase()}>{moment().format("MMMM")}</option>
                <option value="enero">Enero</option>
                <option value="febrero">Febrero</option>
                <option value="marzo">Marzo</option>
                <option value="abril">Abril</option>
                <option value="mayo">Mayo</option>
                <option value="junio">Junio</option>
                <option value="julio">Julio</option>
                <option value="agosto">Agosto</option>
                <option value="septiembre">Septiembre</option>
                <option value="octubre">Octubre</option>
                <option value="noviembre">Noviembre</option>
                <option value="diciembre">Diciembre</option>
              </select>
              <select
                onChange={(event) => {
                  setPickYear(event.target.value);
                }}
                className={`form-select w-25 mb-1 bg-${user.mode} text-${
                  user.mode == "ligth" ? "dark" : "white"
                }`}
                aria-label="Default select example"
              >
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
              <input
                type="number"
                className={`form-control w-50 bg-${user.mode} text-${
                  user.mode == "ligth" ? "dark" : "white"
                }`}
                id="sueldo"
                placeholder="Euros la hora"
                onChange={(event) => setSueldo(event.target.value)}
              />
            </div>
            <div
              className={`modal-body bg-${user.mode} text-${
                user.mode == "ligth" ? "dark" : "white"
              }`}
            >
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                data-bs-dismiss="modal"
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  navigate(
                    `/tikadas/${pickEmpleado._id}/${pickMes}/${pickYear}/${sueldo}`
                  );
                }}
              >
                Consultar tikadas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
