import React from 'react';
import ReactDOM from 'react-dom/client';
import Comanda from './pages/Comanda';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin'
import PanelAdmin from './pages/PanelAdmin'
import Tikadas from './pages/Tikadas'
import {BrowserRouter, Routes, Route,} from 'react-router-dom'
import { Provider } from "react-redux";
import {store} from './app/store'
import "bootstrap/dist/css/bootstrap.css";
import Welcome from './pages/Welcome';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Welcome />}/>
        <Route path='/comanda' element={<Comanda />}/>
        <Route path='/admin' element={<Admin />}/>
        <Route path='/paneladmin' element={<PanelAdmin />}/>
        <Route path='/tikadas/:id/:mes/:year' element={<Tikadas />}/>
        <Route path='*' element={<NotFound />}/>
    </Routes>
    </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
