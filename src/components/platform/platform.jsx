import React, { useEffect, useState } from 'react';
import "./platform.css"
import Button from '../button/button';
import Modal from '../modal/modal';
import Input from '../input/input';
import DateInput from '../input/dataInput'
import axios from 'axios';
import Select from '../select/select';

const Platform = ({data, billboards, handleDeleteBillboard, reloadBillboards, reload, handleReload}) => {
  // открытие модальных окон 
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteApplication, setDeleteApplication] = useState(false);
  const [isDeleteBillboard, setDeleteBillboard] = useState(false);
  const [isChangeApplication, setChangeApplication] = useState(false);
  const [isChangeBillboard, setChangeBillboard] = useState(false);
  const [isAddApplication, setAddApplication] = useState(false);
  const [applications, setApplications] = useState([])
  const togglePlatform = () => {
    setIsOpen(!isOpen);
  };

  // общие данные
  const [applicationId, setApplicationId] = useState("")
  const [billboardId, setBillboardId] = useState("")
  const [customer, setCustomer] = useState("")
  const [beginData, setBeginData] = useState("")
  const [endData, setEndData] = useState("")
  const [address, setAddress] = useState("")
  const [notification, setNotification] = useState("")

  const sortedApplications = Array.isArray(applications) ? [...applications].sort(
    (a, b) => new Date(a.begin_data) - new Date(b.begin_data)
  ) : [];

  useEffect(() => {
    getApplications()
  }, [reload]);

  useEffect(() => {
    setNotification("")
  }, [
    isDeleteApplication,
    isDeleteBillboard,
    isChangeApplication,
    isChangeBillboard,
    isAddApplication,
  ]);

  const getApplications = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/applications/${data.id}`);
        console.log('Успешно получены заказы:', response.data);
        setApplications(response.data)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
          setNotification(error.response.data.error);
        } else {
          setNotification('Ошибка сервера');
        };
    }
  };

  const handleDeleteApplication = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/applications/${data.id}/${applicationId}`)

      setDeleteApplication(false)
      setApplications(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
          setNotification(error.response.data.error);
        } else {
          setNotification('Ошибка сервера');
        };
    }
  };

  const handleChangeBillboard = async () => {
    if (address == "") {
      setNotification("Введены не все данные.")
    } else {
      try {
        const response = await axios.put(`http://localhost:5000/api/billboards/${data.id}`, {
          address: address
        });

        setAddress("")
        setChangeBillboard(false)

        reloadBillboards()
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setNotification(error.response.data.error);
        } else {
          setNotification('Ошибка сервера');
        }
      }
    }
  }

  const handleChangeApplication = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/applications/${applicationId}`, {
        name: customer,
        begin_data: beginData,
        end_data: endData,
        billboardId: billboardId
      });

      setAddress("")
      setChangeApplication(false)
      handleReload()
      getApplications()
      reloadBillboards()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
          setNotification(error.response.data.error);
        } else {
          setNotification('Ошибка сервера');
        }
    }
  }

  const createApplication = async () => {
    if (customer == "" || beginData == "" || endData == "") {
      setNotification("Введены не все данные.")
    } else {
      try {
          const response = await axios.post('http://localhost:5000/api/applications', {
            name: customer,
            begin_data: beginData,
            end_data: endData,
            billboardId: data.id,
          });

          console.log('Успешно создан заказ:', response.data);
          setAddApplication(false)
          setCustomer("")
          setBeginData("")
          setEndData("")
          getApplications()
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setNotification(error.response.data.error);
        } else {
          setNotification('Ошибка сервера');
        }
      }
    }
  }

  const table = () => {
    return(
    <table className='application-table'>
      <thead>
        <tr>
          <th>заказчик</th>
          <th>начало</th>
          <th>конец</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedApplications.map((application) => (
          <tr key={application.id}>
            <td>{application.name}</td>
            <td>{application.begin_data}</td>
            <td>{application.end_data}</td>
            <td>
              <Button onClick={() => (
                setChangeApplication(true),
                setApplicationId(application.id),
                setCustomer(application.name),
                setBeginData(application.begin_data),
                setEndData(application.end_data),
                setBillboardId(data.id)
              )} type={"success small"}>
                <i className="fa fa-edit" style={{color: "inherit"}}></i>
              </Button>
              <Button onClick={() => (
                setDeleteApplication(true),
                setApplicationId(application.id)
              )} type={"danger small"}>
                <i className="fa fa-remove" style={{color: "inherit"}}></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    )
  }

  return (
    <div className="platform">
      <div className={`platform-header ${isOpen ? 'open' : ''}`} onClick={togglePlatform}>
        <h3 className='platform-title'>
          {data.address}
          <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
        </h3>
        <div className="billboard-id">ID: {data.id.split('-')[0]}</div>
      </div>
      {isOpen && (
        <div className="platform-content">
          {
            sortedApplications.length === 0 ? (
              <div className='no-applications'>ЗАКАЗОВ НЕТ</div>
            ) : (
              table()
            )
          }
          <div className="platform-bottom">
            <div>
              <Button onClick={() => (setChangeBillboard(true))}>редактировать билборд</Button>
              <Button onClick={() => setAddApplication(true)} type={'success'}>+ заказ</Button>
            </div>
            <Button onClick={() => setDeleteBillboard(true)} type={"danger"}><i className="fa fa-trash" alt="Удалить" style={{color: "white"}}/></Button>
          </div>

          <Modal isOpen={isDeleteBillboard} onClose={() => setDeleteBillboard(false)} title={"Вы уверены, что хотите удалить билборд?"}>
            <div>Это приведёт к удалению его данных и данных всех его заказов.</div>
            <div className="modal-footer">
              <Button onClick={() => setDeleteBillboard(false)} type={'success'}>отмена</Button>
              <div className='notification'>{notification}</div>
              <Button onClick={() => (handleDeleteBillboard(data.id), setDeleteBillboard(false))} type={"danger"}>удалить</Button>
            </div>
          </Modal>

          <Modal isOpen={isDeleteApplication} onClose={() => setDeleteApplication(false)} title={"Вы уверены, что хотите удалить заказ?"}>
            <div>Это приведёт к удалению всех его данных без возможности восстановления.</div>
            <div className="modal-footer">
              <Button onClick={() => setDeleteApplication(false)} type={'success'}>отмена</Button>
              <div className='notification'>{notification}</div>
              <Button onClick={() => handleDeleteApplication()} type={"danger"}>удалить</Button>
            </div>
          </Modal>

          <Modal isOpen={isChangeApplication} onClose={() => (setChangeApplication(false), setCustomer(""), setBeginData(""), setEndData(""))} title={"Редактирование заказа"}>
            <div className="modal-body">
              <p className='modal-form-title-h'>Заказчик:</p> 
              <Input input={(value) => setCustomer(value)} placeholder={customer} modify={'form-long'}/>
            </div>
            <div className="modal-body">
              <p className='modal-form-title-h'>Билборд:</p>
              <Select options={billboards} onSelect={(value) => setBillboardId(value)} placeholder={data.address}/>
            </div>
            <div className="modal-body">  
              <p>Даты:</p>
              <div>
                <p className='modal-form-title'>начало</p>
                <DateInput input={(value) => setBeginData(value)} placeholder={beginData}/>
              </div>
              <div>
                <p className='modal-form-title'>конец</p>
                <DateInput input={(value) => setEndData(value)} placeholder={endData} min={beginData}/>
              </div>
            </div>
            <div className="modal-footer">
              <div className='notification'>{notification}</div>
              <Button onClick={() => handleChangeApplication()} type='success'>подтвердить</Button>
            </div>
          </Modal>

          <Modal isOpen={isChangeBillboard} onClose={() => (setChangeBillboard(false), setAddress(""))} title={"Редактирование билборда"}>
              <div className='modal-body m0'>
                <p className='modal-form-title-h'>Адрес:</p> <Input input={(value) => setAddress(value)} placeholder={data.address}  modify={'form-long'}/>
              </div>
            <div className="modal-footer">  
              <Button onClick={() => (handleChangeBillboard())} type='success'>подтвердить</Button>
            </div>
            <div className='notification'>{notification}</div>
          </Modal>

          <Modal isOpen={isAddApplication} onClose={() => (setAddApplication(false), setCustomer(""), setBeginData(""), setEndData(""))} title={"Создание заказа"}>
            <div className="modal-body">  
              <div className='modal-body m0'>
                <p className='modal-form-title-h'>Заказчик:</p> 
                <Input input={(value) => setCustomer(value)} modify={'form-long'} placeholder="ввод..."/>
              </div>
            </div>
            <div className="modal-body">  
              <p>Даты:</p>
              <div>
                <p className='modal-form-title'>начало</p>
                <DateInput input={(value) => setBeginData(value)}/>
              </div>
              <div>
                <p className='modal-form-title'>конец</p>
                <DateInput input={(value) => setEndData(value)} min={beginData}/>
              </div>
            </div>
            <div className="modal-footer">
              <Button onClick={() => (setAddApplication(false), setCustomer(""), setBeginData(""), setEndData(""))}>отмена</Button>
              <Button onClick={() => createApplication()} type='success'>подтвердить</Button>
            </div>
            <div className='notification'>{notification}</div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Platform;
