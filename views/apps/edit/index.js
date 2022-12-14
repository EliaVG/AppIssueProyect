// Imports requeridos
import React, { Component } from 'react';
import Navbar from '../../../../components/Navbar';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import AppService from '../../../../services/app.service';
import AppForm from '../components/AppForm';
import { setAppInfo, setAppId } from '../components/helpers/variables';
import AllIssues from '../../issues/all'

// Clase para editar apps ya creadas
export default class EditApp extends Component{
    // Constructor de clase
    constructor(props){
        super(props)

        // Inicializamos variables de estado con valor vacío
        this.state = {
            app: [],
            isAppReady: false,
        };
    }

    // Método para obtener la información de la app que queremos modificar
    getApp = () => {
        const id = this.props.match.params.id;
        setAppId(id);

        AppService.getApp(id)
            .then((response) => {
                const app = response.data.data[0];
                setAppInfo(app); 

                // Asignamos a nuestras variables de estados la información de la app recibida
                this.setState({
                    app: app,
                    name: app.name, 
                    alias: app.alias, 
                    redmineTask: app.redmineTask, 
                    credentials: app.credentials, 
                    foxxumPic: app.foxxumPic, 
                    techStandard: app.techStandard, 
                    players: app.players, 
                    adsIntegration: app.adsIntegration, 
                    handleBackButton: app.handleBackButton, 
                    deepLinkApi: app.deepLinkApi, 
                    ipFilter: app.ipFilter, 
                    userAgentFilter: app.userAgentFilter, 
                    cpType: app.cpType, 
                    designDocument: app.designDocument, 
                    additionalInformation: app.additionalInformation,
                    originalPlatform: app.originalPlatform, 
                    targetCountries: app.targetCountries, 
                    relevantPlatforms: app.relevantPlatforms, 
                    contractSigned: app.contractSigned,
                    cpApproval: app.cpApproval, 
                    appDescription: app.appDescription, 
                    CPPic: app.CPPic, 
                    devicesInfo: app.devicesInfo, 
                    app_categories: app.app_categories, 
                    languages: app.languages, 
                    geoBlocking: app.geoBlocking, 
                    appUrls: app.appUrls, 
                    drm: app.drm, 
                    streamingTech: app.streamingTech, 
                    isTestApp: app.isTestApp,

                    isAppReady: true
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Método que se llama por defecto al montar la app
    componentDidMount() {
        this.getApp();
    }

    // Método para renderizar el formulario para apps
    renderForm(){
        return <AppForm/>
    }

    // Método para renderizar el contenido por defecto de la app
    render(){
        return (
            <div id='editApp'>
                <Navbar title="editApp" isAdmin="yes" />
                {!this.state.isAppReady ? <SpinnerLoading /> : this.renderForm()}
                {!this.state.isAppReady ? '' : <AllIssues/>}
            </div>
        )
    }
}