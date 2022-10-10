import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { isCajaOpen, getProducts, addComanda, API } from "./api";
import botella from "./assets/botella.png";
import copa from "./assets/copa2.jpg";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [caja, setCaja] = useState({});
  const [tokens, setTokens] = useState([]);
  const [products, setProducts] = useState([]);
  const [listBotellas, setListBotellas] = useState([]);
  const [listRefrescos, setListRefrescos] = useState([]);
  const [listRefrescosBotella, setListRefrescosBotella] = useState([]);
  const [pickBotella, setPickBotella] = useState(null);
  const [pickBotellaCopa, setPickBotellaCopa] = useState(null);
  const [precioComanda, setPrecioComanda] = useState(0);
  const [comandas, setComandas] = useState([]);
  const loadCaja = async () => {
    const data = await isCajaOpen();
    setCaja(data[0]);
    const dataProducts = await getProducts();
    setProducts(dataProducts);
    setListBotellas(
      dataProducts.filter((element) => element.categoriaMin == "botella")
    );
    setListRefrescos(
      dataProducts.filter((element) => element.categoriaMin == "refresco")
    );
  };

  useEffect(() => {
    loadCaja();

    return () => {
      loadCaja();
    };
  }, []);
  // inicio notis

  const getTokens = async () => {
    const data = await fetch(`${API}/notification/tokens`);
    const res = await data.json();
    setTokens(res);
  };
  useEffect(() => {
    getTokens();
  }, []);

  const enviarNotificacion = async (idMesa, numMesa) => {
    let tokensArray = [];
    tokens.forEach((element) => {
      tokensArray.push(element.token);
    });

    for (let i = 0; i < tokensArray.length; i++) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        mode: "no-cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: tokensArray[i],
          data: { idMesa },
          title: "La piconera",
          body: `Comanda nueva mesa ${numMesa}`,
        }),
      });
    }
  };
  // Fin noti

  const handlePedir = () => {
    const listRefrescos = [
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784211051.png",
      "file-1663784231639.png",
      "file-1663784231639.png",
      "file-1663784231639.png",
      "file-1663784231639.png",
    ];
    const comanda = {
      idComanda: uuidv4(),
      referencia: "Botella",
      producto: "Botella",
      imagenPrincipal: "file-1663784297520.jpg",
      listRefrescos,
      precio: 120,
      pagadaIndiComanda: false,
      multiplicador: 1,
      precioReal: 120,
    };
    const newComanda = {
      idMesa: "633e36b936ae8b741ffeade3",
      datosMesa: "Ninguno",
      tipo: "Ninguno",
      contenido: comanda,
      precioComanda: 120,
      fecha: "hoy",
      atendidoPor: "Cliente QR",
      pagada: false,
      idCaja: caja._id,
    };
    addComanda(newComanda);
    enviarNotificacion("633e36b936ae8b741ffeade3", 1);
  };

  const handleBotella = (botella) => {
    console.log(botella);
    setPickBotella(botella);
  };
  const handleRefrescosPickBotella = (refresco) => {
    if (listRefrescosBotella.length < 12) {
      const newRefresco = {
        id: uuidv4(),
        refresco: refresco.imagen,
      };
      setListRefrescosBotella([...listRefrescosBotella, newRefresco]);
    }
  };
  const deleteRefrescoBotella = (id) => {
    setListRefrescosBotella(
      listRefrescosBotella.filter((element) => element.id != id)
    );
  };
  const agregarBotellaComanda = (botella, refrescos) => {
    let listRefrescosComanda = [];
    refrescos.map((element) => listRefrescosComanda.push(element.refresco));
    const newComandaBotella = {
      idComanda: uuidv4(),
      referencia: "Botella",
      producto: botella.nombre,
      imagenPrincipal: botella.imagen,
      listRefrescos: listRefrescosComanda,
      precio: botella.precio,
      pagadaIndiComanda: false,
      multiplicador: 1,
      precioReal: botella.precio,
    };
    setComandas([newComandaBotella, ...comandas]);
    setPrecioComanda(precioComanda + botella.precio);
    setPickBotella(null);
    setListRefrescosBotella([]);
  };
  const handleEliminarComanda = (comanda) => {
    console.log(comanda);
    setPrecioComanda(precioComanda - comanda.precioReal);
    setComandas(
      comandas.filter((element) => element.idComanda !== comanda.idComanda)
    );
    toast.error("Producto eliminado")
  };
  const enviarComandaBackend = () => {
    console.log(comandas);
    if (comandas.length > 0) {
      const newComanda = {
        idMesa: "633e36b936ae8b741ffeade3",
        datosMesa: "Ninguno",
        tipo: "Ninguno",
        contenido: comandas,
        precioComanda,
        fecha: "hoy",
        atendidoPor: "Codigo QR",
        pagada: false,
        idCaja: caja._id,
      };
      // enviarNotificacion(route.params.idMesa, mesa.numeroMesa);
      setComandas([]);
      setPrecioComanda(0);
      addComanda(newComanda);
      toast.success('Enviado con exito')
    } else {
      alert("Comanda vacia");
    }
  };
  const handleBotellaCopa = (botella) => {
    console.log(botella);
    setPickBotellaCopa(botella);
  };

  const agregarCopaComanda = (botella, refresco) =>{
    console.log(botella)
    const newComandaCopa = {
      idComanda: uuidv4(),
      referencia: "Copa",
      producto: botella.nombre,
      imagenPrincipal: botella.imagen,
      listRefrescos: [refresco],
      precio: 10,
      pagadaIndiComanda: false,
      multiplicador: 1,
      precioReal: 10,
    };
    setComandas([newComandaCopa, ...comandas]);
    setPrecioComanda(precioComanda + 10);
    setPickBotellaCopa(null)

  }
  return (
    <div className="container containerManual">
      <Toaster/>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Nueva peticion:</h1>
              <div className="comandas column">
                <div className="card mb-1">
                  <div className="card-body">
                    <p className="fs-1">
                      Precio total: <b>{precioComanda} €</b>
                    </p>
                    {comandas.length != 0 && (
                      <div
                        className="btn btn-success col-12"
                        onClick={() => enviarComandaBackend()}
                      >
                        Enviar peticion
                      </div>
                    )}
                  </div>
                </div>
                {comandas.map((element, index) => (
                  <>
                    <div className="card mb-2">
                      <div className="row p-1">
                        <div className="col-3 d-flex align-items-center">
                          <img
                            src={`https://lapiconera.herokuapp.com/${element.imagenPrincipal}`}
                            alt="Seleccionar botella"
                            style={{ width: 90, height: 90 }}
                          />
                        </div>
                        <div className="col-9">
                          <div className="row">
                            <div className="btn btn-dark col">
                              {element.referencia}
                            </div>
                            <div className="btn btn-secondary col">
                              {element.producto}
                            </div>
                          </div>
                          {element.listRefrescos.map((element, index) => (
                            <img
                              src={`https://lapiconera.herokuapp.com/${element}`}
                              alt="Seleccionar botella"
                              style={{ width: 40, height: 40 }}
                            />
                          ))}
                          <div class="d-flex justify-content-between">
                            <span class="btn btn-primary">
                              Precio {element.precio} €
                            </span>
                            <div
                              className="btn btn-danger"
                              onClick={() => handleEliminarComanda(element)}
                            >
                              Eliminar
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="seccionBotones mt-2">
            <div className="card">
              <div className="card-body d-flex">
                <div className="column">
                  <img
                    src={botella}
                    alt="Seleccionar botella"
                    style={{ width: 80, height: 80 }}
                    data-bs-toggle="modal"
                    data-bs-target="#botellas"
                  />
                  <p
                    className="text-center"
                    data-bs-toggle="modal"
                    data-bs-target="#botellas"
                  >
                    Botellas
                  </p>
                </div>
                <div className="column">
                  <img
                    src={copa}
                    alt="Seleccionar botella"
                    style={{ width: 80, height: 80, marginLeft: 9 }}
                    data-bs-toggle="modal"
                    data-bs-target="#copas"
                  />
                  <p className="text-center">Copas</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Botellas */}
      <div
        className="modal fade"
        id="botellas"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {pickBotella === null ? (
                  <>Seleccionar Botella:</>
                ) : (
                  <>Seleccionar Refrescos:</>
                )}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {pickBotella === null && (
                  <>
                    {listBotellas.map((element) => (
                      <div
                        className=" card p-2 col-3 mb-2"
                        onClick={() => {
                          handleBotella(element);
                        }}
                      >
                        <img
                          src={`https://lapiconera.herokuapp.com/${element.imagen}`}
                          alt=""
                          style={{ width: 80, height: 80 }}
                        />
                        <p className="text-center">
                          <b>{element.nombre}</b>
                          <br></br>
                          {element.precio} €
                        </p>
                      </div>
                    ))}
                  </>
                )}
                {pickBotella != null && (
                  <>
                    <div className="col-12">
                      <div className="row">
                        {listRefrescos.map((element) => (
                          <div
                            className=" card p-2 col-3 mb-2"
                            onClick={() => {
                              handleRefrescosPickBotella(element);
                            }}
                          >
                            <img
                              src={`https://lapiconera.herokuapp.com/${element.imagen}`}
                              alt=""
                              style={{ width: 80, height: 80 }}
                            />
                          </div>
                        ))}
                      </div>
                      <hr></hr>
                      <div className="col-12">
                        <h5>
                          Refrescos elegidos ({listRefrescosBotella.length}/12):
                        </h5>

                        <div className="row">
                          {listRefrescosBotella.map((element) => (
                            <div
                              className=" card p-2 col-3 mb-2"
                              onClick={() => {
                                deleteRefrescoBotella(element.id);
                              }}
                            >
                              <img
                                src={`https://lapiconera.herokuapp.com/${element.refresco}`}
                                alt=""
                                style={{ width: 80, height: 80 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  agregarBotellaComanda(pickBotella, listRefrescosBotella)
                }
                data-bs-dismiss="modal"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Fin Botellas */}

      {/* Modal Copas */}
      <div
        className="modal fade"
        id="copas"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {pickBotella === null ? (
                  <>Seleccionar Botella:</>
                ) : (
                  <>Seleccionar Refrescos:</>
                )}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {pickBotellaCopa === null && (
                  <>
                    {listBotellas.map((element) => (
                      <div
                        className=" card p-2 col-3 mb-2"
                        onClick={() => {
                          handleBotellaCopa(element);
                        }}
                      >
                        <img
                          src={`https://lapiconera.herokuapp.com/${element.imagen}`}
                          alt=""
                          style={{ width: 80, height: 80 }}
                        />
                        <p className="text-center">
                          <b>{element.nombre}</b>
                          <br></br>
                          {element.precio} €
                        </p>
                      </div>
                    ))}
                  </>
                )}
                {pickBotellaCopa != null && (
                  <>
                    <div className="col-12">
                      <div className="row">
                        {listRefrescos.map((element) => (
                          <div
                            className=" card p-2 col-3 mb-2"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              console.log('first')
                              agregarCopaComanda(pickBotellaCopa, element.imagen)
                            }}
                          >
                            <img
                              src={`https://lapiconera.herokuapp.com/${element.imagen}`}
                              alt=""
                              style={{ width: 80, height: 80 }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  agregarBotellaComanda(pickBotella, listRefrescosBotella)
                }
                data-bs-dismiss="modal"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Fin Copas */}
    </div>
  );
}

export default App;
