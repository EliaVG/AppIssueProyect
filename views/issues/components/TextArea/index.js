import React, { Component } from 'react';
import './style.scss';

// Componente auxiliar input de tipo textArea
const TextArea = (props) => {
    // Desestructuramos las variables recibidas por método POST
    const { onInputTextChange, title, value } = props;
  
    // Método para gestionar los valores introducidos por teclado
    const handleChange = (e) => {
        if (
            (typeof onInputTextChange === 'function' && e.target.value) ||
            (typeof onInputTextChange === 'function' && !e.target.value)
        ) {
            onInputTextChange(e.target.value);
        }
    };

    // Método que se ejecuta por defecto al ser llamada la clase
    return (
        <div className='textArea'>
            <label> {title} </label>
            <textarea type="text" value={value} onChange={handleChange} />
        </div>
    );
  };

// Exportamos la clase para poder usarla en otros componentes
export default TextArea;