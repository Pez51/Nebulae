import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

const LoginModal = ({ show, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await axios.post(`http://localhost:3001${endpoint}`, formData);
      alert(isLogin ? 'Inicio de sesión exitoso' : 'Registro exitoso');
      onClose();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Usuario:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px', color: '#e0e0e0' }}>
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span 
            style={{ 
              color: '#e43f5a', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontWeight: 'bold'
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;