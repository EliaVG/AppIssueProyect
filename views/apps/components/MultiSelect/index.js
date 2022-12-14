// Imports requeridos
import React, { Component } from 'react';
import Select from 'react-select';
import './style.scss';

// Componente auxiliar para mostrar un desplegable en el que poder seleccionar varios valores a la vez
class MultiSelect extends Component{
    // Constructor de clase
    constructor(props) {
        super(props);
    }

    // Método para gestionar los cambios que sufra el input
    handleChange = (e) => {
        const { onChangeOption } = this.props;
        onChangeOption(e);
    };

    // Método que se ejecuta por defecto al llamar a la clase
    render(){
        // Destructuración de constantes recibidas por POST
        const { label, optionsList, option } = this.props;

        // Valor a devolver al renderizar la clase
        return (
            <div id="multiSelect-component">
                <label> {label} </label>
                <Select id='multiSelect'
                    closeMenuOnSelect={false}
                    isMulti = {true}
                    defaultValue = {option}
                    onChange={this.handleChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={optionsList}
                />
            </div>
            
        );
    }
}

// Export para poder usar la clase en otros componentes
export default MultiSelect;