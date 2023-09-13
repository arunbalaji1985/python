import './App.css';
import './styles.css';
import SidebarContainer from './components/SidebarContainer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MailTemplateContainer from "./components/MailTemplateContainer";
import AppContext from './AppContext';
import React, {useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [cnt, setCnt] = useState(0)
  const [currentId, setCurrentId] = useState("")
  const onRefresh = () => {
    setCnt(cnt => cnt + 1)
  }

  return (
    <AppContext.Provider value={{currentId, setCurrentId}} >
      <BrowserRouter>
        <div className="container">
        <Routes>
          <Route path="/" element={<SidebarContainer className="left" cnt={cnt} onRefresh={onRefresh} />}>
            <Route path="/detail/new" element={<MailTemplateContainer isNew={true} onRefresh={onRefresh }/>} />
            <Route path="/detail/:id" element={<MailTemplateContainer onRefresh={onRefresh }/>} />
          </Route>
        </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={true}
                closeOnClick
      />
    </AppContext.Provider>
  );
}

export default App;
