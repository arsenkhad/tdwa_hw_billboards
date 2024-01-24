import { useEffect, useState } from 'react';
import './App.css';

import Button from './components/button/button';
import Header from './components/header/header';
import Platform from './components/platform/platform';
import Modal from './components/modal/modal';
import Input from './components/input/input';
import axios from 'axios';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAddres, setNewAddres] = useState("")
  const [data, setData] = useState([])
  const [notification, setNotification] = useState("")
  const [reloadApplications, setReloadApplications] = useState(true)

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/billboards');
      console.log('Успешно получены билборды:', response.data);
      setData(response.data)
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  useEffect(() => {
    getData()
  }, []);

  const handleCreateBillboard = async () => {
    if (newAddres == "") {
      setNotification("Введите адрес.")
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/billboards', {
          address: newAddres
        });

        setData(response.data);
        setNotification("")
        setNewAddres("")
        setModalOpen(false);
      } catch (error) {
        console.error('Ошибка:' + error);
        setNotification('Ошибка:' + error)
      }
    }
  };

  const handleDeleteBillboard = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/billboards/${id}`)

      setData(response.data);
    } catch (error) {
      console.error('Ошибка:' + error);
    }
  };

  const modalClose = () => {
    setModalOpen(false)
    setNotification("")
    setNewAddres("")
  }

  return (
    <div className="App">
      <Header />
      <div className='billboards'>
        {data.map((billboard) =>
          <Platform
            data={billboard}
            billboards={data}
            handleDeleteBillboard={(id) => handleDeleteBillboard(id)}
            reloadBillboards={() => getData()}
            reload={reloadApplications}
            handleReload={() => setReloadApplications(!reloadApplications)}
          />
        )}
        <div className='billboard-button'>
          <Button onClick={() => setModalOpen(true)} type={'add'}><b> добавить билборд</b></Button>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => modalClose(false)} title={"Создание билборда"}>
        <div className="modal-body">
          <p className='modal-form-title-h'>Адрес:</p>
            <Input input={(value) => setNewAddres(value)} placeholder="ввод..." modify={'form-long'} />
        </div>
        <div className="modal-footer">
          <Button onClick={() => modalClose()}>отмена</Button>
          <div className='notification'>{notification}</div>
          <Button onClick={() => handleCreateBillboard()} type='success'>подтвердить</Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
