import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { v4 as uuidv4 } from "uuid";
import React, {useEffect, useState} from 'react'
import {isCajaOpen, addComanda, API} from './api'

function App() {
  const [caja, setCaja] = useState({});
  const [tokens, setTokens] = useState([]);


  const loadCaja = async () => {
    const data = await isCajaOpen();
    setCaja(data[0]);
  };

  useEffect(() => {
    loadCaja();
  
    return () => {
    }
  }, [])
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
          mode:"no-cors",
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
      atendidoPor: "Xabi",
      pagada: false,
      idCaja: caja._id,
    };
    addComanda(newComanda);
    enviarNotificacion("633e36b936ae8b741ffeade3", 1)
  };
  return (
    <div className="App">
      <header className="App-header">
        <button className="btn btn-primary" onClick={() => handlePedir()}>
          Pedir Botella
        </button>
      </header>
    </div>
  );
}

export default App;
