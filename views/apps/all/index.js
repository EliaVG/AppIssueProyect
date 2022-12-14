// Imports requeridos
import React, { Component } from 'react';
import './style.scss';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import Navbar from '../../../../components/Navbar';
import AppService from '../../../../services/app.service';
import SearchInput from '../../../../components/SearchInput';
import { Link } from 'react-router-dom';
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import Checkbox from '../../../../components/Checkbox';
import {setAppId, setAppInfo} from '../components/helpers/variables'

// Campos a mostrar en la tabla de apps
const AVAILABLE_PROPERTIES = [
    'alias',
    'redmineTask',
    'foxxumPic',
    'app-categories',
    'targetCountries'
];

// Clase para mostrar una tabla de todas las apps
export default class AllApps extends Component{
    // Constructor de la clase
    constructor(props) {
        super(props);
    
        // Inicializamos variables de estado
        this.state = {
            apps: [],
            isAppsReady: false,
        };

        // Declaramos las cabeceras que mostrará nuestra tabla
        this.tableHeader = [
            { header: 'Alias', headerKey: 'alias' },
            { header: 'Redmine Task', headerKey: 'redmineTask' },
            { header: 'Foxxum Pic', headerKey: 'foxxumPic' },
            { header: 'Categories', headerKey: 'categories' },
            { header: 'Target Countries', headerKey: 'countries' },
            { header: 'Is Test App', headerKey: 'isTestAppCheckbox' },
            { header: 'Actions', headerKey: 'actions' }
        ];
    }

    // Método para traer todas las apps de la base de datos
    getAllApps = () => {
        AppService.getAllApps()
            .then((response) => {
                this.setState({
                    apps: response.data.data,
                    isAppsReady: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Método que se llama al iniciar la clase
    componentDidMount() {
        this.getAllApps();
    }

    // Método para encontrar sólo los campos requeridos por la tabla
    appPropertyMatches = (app, property, inputText) => {
        if (!Object.prototype.hasOwnProperty.call(app, property)) {
            return false;
        }
        return `${app[property]}`.toLowerCase().includes(inputText.toLowerCase());
    };

    // Método para filtrar los valores de la tabla por el valor introducido en input
    filterAppsBy = (inputText) => {
        const { apps } = this.state;

        return apps.filter((app) => {
            return !!AVAILABLE_PROPERTIES.find((property) => {
                return this.appPropertyMatches(app, property, inputText);
            });
        });
    };

    // Para llamar al método que filtra los campos de la tabla al cambiar el valor en input
    inputTextChange = (inputText) => {
        clearTimeout(this.filteringTO);
        this.filteringTO = setTimeout(() => {
            this.setState({ filteredApps: this.filterAppsBy(inputText) });
        }, 500);
    };

    // Método para especificar las acciones a llevar a cabo al pulsar el link de Details
    getAppsActions(app){
        const id = app.id;
        return (
            <Link to={`/management/apps/${id}`}>Details</Link>
        )
    }

    // Método para obtener los datos en la tabla filtrados
    get filteredTable() {
        const { apps, filteredApps } = this.state;

        console.log(apps)
    
        if (!apps) {
          return [];
        }
        let appsToUse = filteredApps;
        if (!appsToUse || appsToUse.length < 0) {
            appsToUse = apps;
        }
        
        return appsToUse.map((app) => {
            const { alias, redmineTask, foxxumPic, app_categories, targetCountries, isTestApp } = app;
            
            const categoriesArray = app_categories.map(category => category.name);
            const categories = categoriesArray.join(', ');

            const countriesArray = targetCountries.map(country => country.ISO3166);
            const countries = countriesArray.join(', ');

            var isTestAppCheckbox = <Checkbox name="isTestApp" isChecked={isTestApp} disabled='disabled' />
            const actions = this.getAppsActions(app);
            
            return {
                alias,
                redmineTask,
                foxxumPic,
                categories,   
                countries,     
                isTestAppCheckbox,
                actions,
            };
        });
    }

    // Método que renderiza el contenido de la página al traer todas las apps de la base de datos
    parseContent = () => {
        return (
            <div className="searchApp">
                <Link to="/management/createApp">
                    <Button name="New App" onClick={() => {setAppId(''); setAppInfo('')}}/>
                </Link>
                <SearchInput onInputTextChange={this.inputTextChange} />
                <div id="div-table">
                    <Table headersTable={this.tableHeader} dataTable={this.filteredTable} />
                </div>
            </div>
        );
    };

    // Método para renderizar el contenido por defecto de la página
    render() {
        const { isAppsReady } = this.state;
        return (
            <div id="allApps">
                <Navbar title="allApps" isAdmin="yes" />
                {!isAppsReady ? <SpinnerLoading /> : this.parseContent()}
            </div>
        );
    }
}