import React from 'react';
import "./header.css"
import logoImage from './billboard.svg'; // Укажите путь к вашему изображению

const Header = () => {
  return (
    <div className="header">
      <div className="title">
        <img className="logo" src={logoImage} alt="Логотип" />
        BBTORENT
      </div>
      <div className="avatar"/>
    </div>
  );
};

export default Header;
