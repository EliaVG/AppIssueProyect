import React, { Component } from 'react';

// Componente auxiliar input de tipo date
class Date extends Component{
    // Constructor
    constructor(props) {
        super(props);
    }

    // Método para gestionar los cambios al seleccionar una nueva fecha
    handleChange = (e) => {
        const { onChangeOption } = this.props;
        onChangeOption(e);
    };
    
    // Método que se ejecuta por defecto al ser llamada la clase
    render(){
        // Destructuración de constantes recibidas por POST
        const { defaultValue } = this.props;

        return (
            <input type='date' id='date' onInput={this.handleChange} value={defaultValue} />
        );
    }
}

// Exportamos la clase para poder usarla en otros componentes
export default Date;