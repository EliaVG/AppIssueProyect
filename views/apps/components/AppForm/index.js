// Imports requeridos
import React, { Component } from "react";
import Navbar from '../../../../../components/Navbar';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import Select from '../../../../../components/Select';
import MultiSelect from '../../components/MultiSelect';
import Date from '../../components/Date';
import AppService from '../../../../../services/app.service';
import {brands} from '../../components/helpers/variables';
import { getAppInfo, getAppId } from '../../components/helpers/variables';
import './style.scss';

// Clase auxiliar para mostrar un formulario para una app nueva o ya creada
export default class AppForm extends Component{
    // Constructor de la clase
    constructor(props){
        super(props);

        // Inicializamos variables de estado
        this.state = {
            app: getAppInfo(),
            name: '',  
            urlObject: {
                url: '', 
                date: '',
                version: ''
            },
            appUrls: [],
            alias: '',    
            redmineTask: '',   
            credentials: false,
            foxxumPic: '',    
            techStandard: 'CEhtml', 
            players: [],                   
            adsIntegration: false,
            handleBackButton: '', 
            deepLinkApi: '',
            ipFilter: false, 
            userAgentFilter: false,
            cpType: '', 
            designDocument: '',
            additionalInformation: '',
            originalPlatform: '', 
            targetCountries: [], 
            relevantPlatforms: [],        
            contractSigned: false,
            cpApproval: false,
            app_categories: [], 
            languages: [],                 
            appDescription:{  
                short: '', 
                mid: '',
                long: '',
            },
            streamingTechAux: {
                name: 'HLS', 
                version: '',
            },
            streamingTech: [],
            CPPic: {
                name: '',
                email: '',
            },
            geoBlocking: {
                deniedCountries: [],
                allowedCountries: [],
            },
            drmObject: {                        
                drmType: 'PlayReady', 
                securityLevel: 'SL150',         
                contentWithDrm: '',
                playerUsed: 'HTML5',
            },
            drm: [],
            isTestApp: false,

            // Me declaro estas variables auxiliares para no hacer una llamada a 
            // función cada vez que seleccione un valor
            playersList: this.getAppPlayers(),
            countriesList: this.getAppCountries(),
            categoriesList: this.getAppCategories(),
            languagesList: this.getAppLanguages(),
            deleteMessage: false
        }
    }

    // Método para comprobar si es nueva app o para editar una ya creada
    isNewApp(){
        if (Object.keys(this.state.app).length === 0)
            return true
        else{
            return false
        }   
    }

    // Método auxiliar para formatear los datos que guardamos en el estado
    formatState(){
        let categories = [];
        this.state.app.app_categories.map(item => categories.push(item.id))
        this.setState({app_categories: categories})

        let languages = [];
        this.state.app.languages.map(item => languages.push(item.id))
        this.setState({languages: languages})

        let players = [];
        this.state.app.players.map(item => players.push(item.id))
        this.setState({players: players})

        let countries = [];
        this.state.app.targetCountries.map(item => countries.push(item.id))
        this.setState({targetCountries: countries})

        const {short, mid, long} = this.state.app.appDescription
        this.setState({appDescription: {...this.state.appDescription, short: short, mid: mid, long: long}});
    }

    // Método de ciclo de vida que se llama al montar la app
    componentDidMount(){
        console.log('App -> ', this.state.app)
        if(!this.isNewApp()){
            this.setState({
                name: this.state.app.name, 
                alias: this.state.app.alias, 
                redmineTask: this.state.app.redmineTask, 
                credentials: this.state.app.credentials, 
                foxxumPic: this.state.app.foxxumPic, 
                techStandard: this.state.app.techStandard, 
                players: this.state.app.players, 
                adsIntegration: this.state.app.adsIntegration, 
                handleBackButton: this.state.app.handleBackButton, 
                deepLinkApi: this.state.app.deepLinkApi, 
                ipFilter: this.state.app.ipFilter, 
                userAgentFilter: this.state.app.userAgentFilter, 
                cpType: this.state.app.cpType, 
                designDocument: this.state.app.designDocument, 
                additionalInformation: this.state.app.additionalInformation,
                originalPlatform: this.state.app.originalPlatform, 
                targetCountries: this.state.app.targetCountries, 
                relevantPlatforms: this.state.app.relevantPlatforms, 
                contractSigned: this.state.app.contractSigned,
                cpApproval: this.state.app.cpApproval, 
                CPPic: this.state.app.CPPic, 
                devicesInfo: this.state.app.devicesInfo, 
                app_categories: this.state.app.app_categories, 
                languages: this.state.app.languages, 
                geoBlocking: this.state.app.geoBlocking, 
                appUrls: this.state.app.appUrls, 
                drm: this.state.app.drm, 
                streamingTech: this.state.app.streamingTech, 
                isTestApp: this.state.app.isTestApp,
            })
            this.formatState();
        }
    }

    // Envío de formulario para crear nueva app
    onSubmit = (e) => {
        // Desestructuramos variables y objetos del estado
        const {
            name, alias, redmineTask, credentials, foxxumPic, techStandard, 
            players, adsIntegration, handleBackButton, deepLinkApi, ipFilter, userAgentFilter, 
            cpType, designDocument, additionalInformation, originalPlatform, targetCountries, 
            relevantPlatforms, contractSigned, cpApproval, appDescription,
            CPPic, devicesInfo, app_categories, languages, geoBlocking, appUrls, 
            drm, streamingTech, isTestApp
        } = this.state;
        
        e.preventDefault();

        // Declaramos el objeto App que vamos a guardar
        const app = {
            name, alias, redmineTask, credentials, foxxumPic, techStandard, 
            players, adsIntegration, handleBackButton, deepLinkApi, ipFilter, userAgentFilter, 
            cpType, designDocument, additionalInformation, originalPlatform, targetCountries, 
            relevantPlatforms, contractSigned, cpApproval, appDescription,
            CPPic, devicesInfo, app_categories, languages, geoBlocking, appUrls, 
            drm, streamingTech, isTestApp
        };

        console.log('Enviado -> ', app)

        if (this.isNewApp())
            AppService.addNewApp(app)
        else
            AppService.updateApp(getAppId(), app)

        window.location.href = `/dashboardpc/management/apps`;
    }

    // Actualizar valor de entradas de texto
    handleInputChange = (value, fieldState) => {
        this.setState({
            [fieldState]: value
        });

        //console.log(fieldState, ' => ', value);
    };

    // Actualizar valor de los Checkbox
    onLiftState = (state) => {
        const { name, isChecked } = state;
        this.setState({ [name]: isChecked });

        //console.log(name, ' => ', isChecked);
    };

    // Actualizar valor de un Select
    onChangeInput = (value, field) => {
        this.setState({ [field]: value });

        //console.log(field, ' => ', value)
    };

    // Actualizar valor de fecha introducida
    onChangeDate = () => {
        const {urlObject} = this.state
        var dateAux = document.getElementById('date').value;
        this.setState({urlObject: {...urlObject, date: dateAux}});

        //console.log('Date => ', dateAux)
    };

    // Actulizar valor de un MultiSelect
    onChangeMultiSelect(e, field){
        const values = [];

        e.map((item) => {
            values.push(item.value)
        })
        this.setState({ [field]: values })
        
        //console.log(field, ' => ', values);
    }

    // Método para actualizar valor del MultiSelect dentro de un array de objetos
    onChangeMultiSelectPlayerUsed(e){
        const {drmObject} = this.state;
        const values = [];

        e.map((item) => {
            values.push(item.value)
        })

        this.setState({drmObject: {...drmObject, playerUsed: values}});
        
        //console.log(field, ' => ', values);
    }

    // Añadir nuevo objeto streamingTech
    addStreamingTech(){
        let streamingTechListAux = this.state.streamingTech;
        streamingTechListAux.push(this.state.streamingTechAux);
        this.setState({streamingTech: streamingTechListAux});
    }

    // Añadir nuevo objeto url
    addUrl(){
        let urlListAux = this.state.appUrls;
        urlListAux.push(this.state.urlObject);
        this.setState({appUrls: urlListAux});
    }

    // Añadir nuevo objeto drm
    addDrm(){
        let drmListAux = this.state.drm;
        drmListAux.push(this.state.drmObject);
        this.setState({drm: drmListAux});
    }

    // Para actualizar los valores del Select en función del DRM seleccionado
    drmSecurityLevel(){
        let securityLevel = [];

        if (this.state.drmObject.drmType == 'PlayReady')
            securityLevel = ['SL150', 'SL2000', 'SL3000'];
        else if (this.state.drmObject.drmType == 'WideVine')
            securityLevel = ['L1', 'L2', 'L3'];

        return securityLevel;
    }

    // Actualizar valor por defecto de securityLevel al cambiar drmType
    changeSecurityLevel(){
        const {drmObject} = this.state

        if (this.state.drmObject.drmType == 'PlayReady')
            this.setState({drmObject: {...drmObject, securityLevel: 'SL150'}})
        else if (this.state.drmObject.drmType == 'WideVine')
            this.setState({drmObject: {...drmObject, securityLevel: 'L1'}})
        else
            this.setState({drmObject: {...drmObject, securityLevel: ''}})
    }

    // Para actualizar los valores del Select en función del DRM seleccionado cuando hay varios drm
    drmSecurityLevelItem(index){
        let securityLevel = [];
        const {drm} = this.state
        const item = drm[index]
        const type = item.drmType

        if (type == 'PlayReady')
            securityLevel = ['SL150', 'SL2000', 'SL3000'];
        else if (type == 'WideVine'){
            securityLevel = ['L1', 'L2', 'L3'];
        }

        return securityLevel;
    }

    // Actualizar valor por defecto de securityLevel al cambiar drmType cuando hay varios DRM
    changeSecurityLevelItem(index){
        const {drm} = this.state
        const item = drm[index]

        console.log(item)

        if (item.drmType == 'PlayReady'){
            drm[index].securityLevel = 'SL150'
            this.setState(drm)
        }
        else if (item.drmType == 'WideVine'){
            drm[index].securityLevel = 'L1'
            this.setState(drm)
        }
        else{
            drm[index].securityLevel = ''
            this.setState(drm)
        }
    }

    // Método para seleccionar los valores de los MultiSelect que recibimos de una app que se va a actualizar
    multiSelectOption(array){
        let options = []
        array.map(value => options.push({value: value.id, label: value.name}))
        return options
    }

    // Método para seleccionar los valores de los MultiSelect que recibimos de una app 
    // que no son relacionales dentro de la API
    multiSelectOptionNoRelational(array){
        let options = []
        array.map(item => options.push({value: item, label: item}))
        return options
    }

    // Obtener las categorias disponibles de la base de datos
    getAppCategories(){
        let categories = [];
        AppService.getCategories()
            .then((response) => {
                response.data.data.map(value => categories.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });

        return categories
    }

    // Obtener los países de la base de datos
    getAppCountries(){
        let countries = [];
        AppService.getCountries1()
            .then((response) => {
                response.data.data.map(value => countries.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });
        AppService.getCountries2()
            .then((response) => {
                response.data.data.map(value => countries.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });
        AppService.getCountries3()
            .then((response) => {
                response.data.data.map(value => countries.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });

        return countries
    }

    // Obtener los idiomas disponibles en la base de datos
    getAppLanguages(){
        let languages = [];
        AppService.getLanguages1()
            .then((response) => {
                response.data.data.map(value => languages.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });
        AppService.getLanguages2()
            .then((response) => {
                response.data.data.map(value => languages.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });

        return languages
    }

    // Obtener los players de la base de datos
    getAppPlayers(){
        let players = [];
        AppService.getPlayers()
            .then((response) => {
                response.data.data.map(value => players.push({value: value.id, label: value.name}))
            })
            .catch((error) => {
                console.log(error);
            });

        return players
    }

    // Mostrar mensaje de elemento añadido durante 2 segundos
    addMessage(id, action){
        const message = document.createElement('p');
        message.id = 'message';
        (action == 'add')?(message.innerHTML = 'Element added'):(message.innerHTML = 'Element edited')
        document.getElementById(id).appendChild(message);
        setTimeout(() => { document.getElementById(id).removeChild(message); }, 2000);
    }

    // Mostrar mensaje pop-up de confirmación para eliminar una app
    showDeleteMessage(){
        const {deleteMessage} = this.state
        this.setState({deleteMessage: !deleteMessage})
        return deleteMessage
    }

    // Método para eliminar una app al pulsar en Delete
    deleteApp = (id) => {
        AppService.deleteApp(id);
        window.location.href = '/dashboardpc/management/apps'
    }

    // Método para vaciar los campos input al añadir un valor
    clearFields(item){
        const inputs = [...document.getElementById(item).getElementsByTagName('input')]
        inputs.forEach(item => item.value = '')
    }

    // Eliminar un elemento seleccionado por su índice del estado drm
    removeDrm(index){
        const {drm} = this.state
        const newDrm = drm
        newDrm.splice(index, 1)
        this.setState({drm: newDrm})
    }

    // Eliminar un elemento seleccionado por su índice del estado url
    removeUrl(index){
        const {appUrls} = this.state
        const newUrl = appUrls
        newUrl.splice(index, 1)
        this.setState({appUrls: newUrl})
    }

    // Eliminar un elemento seleccionado por su índice del estado streamingTech
    removeStreamingTech(index){
        const {streamingTech} = this.state
        const newStreamingTech = streamingTech
        newStreamingTech.splice(index, 1)
        this.setState({streamingTech: newStreamingTech})
    }

    // Método para pintar un Input por cada elemento del array recibido como parámetro
    renderInputs = (arrayInputs) => {
        return arrayInputs.map((inputName) => {
            const renderValue = this.isNewApp() ? "" : this.state.app[inputName] 
            return <Input 
                title = {inputName}
                valueInput = {renderValue}
                inputStyle = '2'
                onInputTextChange={(value) => {
                    this.handleInputChange(value, inputName);
                }} />
        })
    }

    // Método para pintar un MultiSelect por cada elemento del array recibido como parámetro
    renderMultiSelects = (arrayMultiSelects) => {
        return arrayMultiSelects.map((select) => {
            const {optionList, field} = select;
            return <MultiSelect 
                label={field}
                option = {(this.isNewApp() || this.state.app[field] == undefined) ? field : this.multiSelectOption(this.state.app[field])}
                optionsList = {this.state[optionList]} 
                onChangeOption={(e) => {
                    this.onChangeMultiSelect(e, field);
                }}
            />
        })
    }

    // Método que ejecutamos al renderizar la app
    render(){
        // Declaramos variables que vamos a usar
        const { 
            name, urlObject, alias, redmineTask, credentials, foxxumPic, techStandard, 
            players, adsIntegration, handleBackButton, deepLinkApi, ipFilter, userAgentFilter, 
            cpType, designDocument, additionalInformation, originalPlatform, targetCountries, 
            relevantPlatforms, contractSigned, cpApproval, appDescription, streamingTechAux, 
            CPPic, drmObject,  app_categories, languages, geoBlocking, isTestApp
        } = this.state;

        const arrayInputs = ["name","alias", "redmineTask", "foxxumPic","handleBackButton", 
            "deepLinkApi", "cpType", "designDocument", "additionalInformation", "originalPlatform"]

        const arrayMultiSelects = [{optionList: 'playersList', field:'players'}, 
            {optionList: 'countriesList', field:'targetCountries'}, 
            {optionList: 'categoriesList', field:'app_categories'}, 
            {optionList: 'languagesList', field:'languages'}]

        // Formulario para apps
        return(
            <div id='managment-createApp'>
                <Navbar title="NEW APP" isAdmin="yes" />
                <div className="secTitle">{this.isNewApp() ? 'New App' : 'Edit App'}</div>
                <form onSubmit={this.onSubmit} id='appForm'>
                    <div id='appProperties'>
                        <div id='input'>

                            {this.renderInputs(arrayInputs)}

                            <div id='CPPic'>
                                <h6>CPPic</h6>
                                <div>
                                    <Input
                                        title = 'Name'
                                        valueInput = {this.isNewApp() ? CPPic.name : this.state.app.CPPic.name}
                                        inputStyle = '2'
                                        onInputTextChange={(value) => {
                                            this.setState({CPPic: {...this.state.CPPic, name: value}});
                                        }}
                                    />
                                    <Input
                                        title = 'Email'
                                        valueInput = {this.isNewApp() ? CPPic.email : this.state.app.CPPic.email}
                                        inputStyle = '2'
                                        onInputTextChange={(value) => {
                                            this.setState({CPPic: {...this.state.CPPic, email: value}});
                                        }}
                                    />
                                </div>
                            </div>
                            <div id='appDescription'>
                                <h6>App Description</h6>
                                <div>
                                    <Input
                                        title = 'Short Description'
                                        valueInput = {this.isNewApp() ? appDescription.short : this.state.app.appDescription.short}
                                        inputStyle = '2'
                                        onInputTextChange={(value) => {
                                            this.setState({appDescription: {...this.state.appDescription, short: value}});
                                        }}
                                    />
                                    <Input
                                        title = 'Medium Description'
                                        valueInput = {this.isNewApp() ? appDescription.mid : this.state.app.appDescription.mid}
                                        inputStyle = '2'
                                        onInputTextChange={(value) => {
                                            this.setState({appDescription: {...this.state.appDescription, mid: value}});
                                        }}
                                    />
                                    <Input
                                        title = 'Long Description'
                                        valueInput = {this.isNewApp() ? appDescription.long : this.state.app.appDescription.long}
                                        inputStyle = '2'
                                        onInputTextChange={(value) => {
                                            this.setState({appDescription: {...this.state.appDescription, long: value}});
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id='select'>
                            <Select
                                label="TechStandard:"
                                option={this.isNewApp() ? techStandard : this.state.app.techStandard}
                                optionsList={['CEhtml', 'hbbTV', 'html5']}  
                                onChangeOption={(e) => {
                                    this.onChangeInput(e, 'techStandard');
                                }}
                            />

                            {this.renderMultiSelects(arrayMultiSelects)}

                            <MultiSelect 
                                label="Relevant Platforms:"
                                option = {(this.isNewApp() || this.state.app.relevantPlatforms == undefined) ? relevantPlatforms : this.multiSelectOptionNoRelational(this.state.app.relevantPlatforms)}
                                optionsList = {brands} 
                                onChangeOption={(e) => {
                                    this.onChangeMultiSelect(e, 'relevantPlatforms');
                                }}
                            />
                            <div id='geoBlocking'>
                                <h6>GeoBlocking</h6>
                                <div>
                                    <MultiSelect 
                                        label="Allowed Countries:"
                                        option = {this.isNewApp() || this.state.app.geoBlocking.allowedCountries == undefined ? geoBlocking.allowedCountries : this.multiSelectOptionNoRelational(this.state.app.geoBlocking.allowedCountries)}
                                        optionsList = {this.state.countriesList} 
                                        onChangeOption={(value) => {
                                            this.setState({geoBlocking: {...this.state.geoBlocking, allowedCountries: value.map(item => item.value)}});
                                        }}
                                    /> 
                                    <MultiSelect 
                                        label="Denied Countries:"
                                        option = {this.isNewApp() || this.state.app.geoBlocking.deniedCountries == undefined ? geoBlocking.deniedCountries : this.multiSelectOptionNoRelational(this.state.app.geoBlocking.deniedCountries)}
                                        optionsList = {this.state.countriesList} 
                                        onChangeOption={(value) => {
                                            this.setState({geoBlocking: {...this.state.geoBlocking, deniedCountries: value.map(item => item.value)}});
                                        }}
                                    /> 
                                </div>
                            </div>
                        </div>
                        <div id='streamingTechDiv'>
                            <div className='miniForm' id='streamingTech'>
                                <h6>Streaming Tech</h6>
                                <Select
                                    label="Name:"
                                    option={streamingTechAux.name}
                                    optionsList={['HLS', 'DASH', 'MSS']}  
                                    onChangeOption={(e) => {
                                        this.setState({streamingTechAux: {...streamingTechAux, name: e}});
                                    }}
                                />
                                <Input
                                    title = 'Version'
                                    valueInput = {streamingTechAux.version}
                                    inputStyle = '2'
                                    onInputTextChange={(value) => {
                                        this.setState({streamingTechAux: {...streamingTechAux, version: value}});
                                    }}
                                />
                                <Button name="Add Streaming Tech" onClick={ (e)=>{e.preventDefault();this.addStreamingTech();this.addMessage('streamingTech', 'add');this.clearFields('streamingTech')}}></Button>
                            </div>
                            {(this.state.streamingTech.length != 0) ?
                                (this.state.streamingTech.map((item, index) => 
                                    <div className='miniForm' id={`streamingTech${index}`} key={`streamingTech${index}`}>
                                        <h6>Streaming Tech</h6>
                                        <Select
                                            label="Name:"
                                            option={item.name}
                                            optionsList={['HLS', 'DASH', 'MSS']}  
                                            onChangeOption={(e) => {
                                                const {streamingTech} = this.state
                                                streamingTech[index].name = e
                                                this.setState({streamingTech});
                                            }}
                                        />
                                        <Input
                                            title = 'Version'
                                            value = {item.version}
                                            inputStyle = '2'
                                            onInputTextChange={(value) => {
                                                const {streamingTech} = this.state
                                                streamingTech[index].version = value
                                                this.setState({streamingTech});
                                            }}
                                        />
                                        <Button name="Remove Streaming Tech" onClick={ (e)=>{e.preventDefault();this.removeStreamingTech(index)} }></Button>
                                    </div>
                                ))
                            : null}
                        </div>
                        <div id='urlDiv'>
                            <div className='miniForm' id='url'>
                                <h6>URL</h6>
                                <Input
                                    title = 'URL'
                                    valueInput = {urlObject.url}
                                    inputStyle = '2'
                                    onInputTextChange={(value) => {
                                        this.setState({urlObject: {...urlObject, url: value}});
                                    }}
                                />
                                <Date id='date' onChangeOption={(e) => { this.onChangeDate(e); }} />
                                <Input
                                    title = 'Version'
                                    valueInput = {urlObject.version}
                                    inputStyle = '2'
                                    onInputTextChange={(value) => {
                                        this.setState({urlObject: {...urlObject, version: value}});
                                    }}
                                />
                                <Button name="Add URL" onClick={ (e)=>{e.preventDefault();this.addUrl();this.addMessage('url', 'add');this.clearFields('url')}}></Button>
                            </div>
                            {(this.state.appUrls.length != 0) ?
                                (this.state.appUrls.map((item, index) => 
                                    <div className='miniForm' id={'url'+index} key={'url'+index}>
                                        <h6>URL</h6>
                                        <Input
                                            title = 'URL'
                                            value= {item.url}
                                            inputStyle = '2'
                                            onInputTextChange={(value) => {
                                                const {appUrls} = this.state
                                                appUrls[index].url = value
                                                this.setState({appUrls});
                                            }}
                                        />
                                        <Date id='date' defaultValue={item.date} onChangeOption={(e) => { 
                                                const {appUrls} = this.state
                                                appUrls[index].date = e.target.value
                                                this.setState({appUrls});
                                            }} />
                                        <Input
                                            title = 'Version'
                                            value = {item.version}
                                            inputStyle = '2'
                                            onInputTextChange={(value) => {
                                                const {appUrls} = this.state
                                                appUrls[index].version = value
                                                this.setState({appUrls});
                                            }}
                                        />
                                        <Button name="Remove URL" onClick={ (e)=>{e.preventDefault();this.removeUrl(index)} }></Button>
                                    </div>
                                ))
                            : null}
                        </div>
                        <div id='drmDiv'>
                            <div className='miniForm' id='drm'>
                                <h6>DRM</h6>
                                <Select
                                    label="Type:"
                                    option={drmObject.drmType}
                                    optionsList={['PlayReady', 'WideVine', 'FairPlay']}  
                                    onChangeOption={(e) => {
                                        this.setState({drmObject: {...drmObject, drmType: e,securityLevel:this.drmSecurityLevel()[0]}}, 
                                        () => {this.changeSecurityLevel()});
                                    }}
                                />
                                <Select
                                    label="Player Used:"
                                    option={drmObject.playerUsed}
                                    optionsList={['HTML5', 'Shaka', 'DASHjs', 'HLS.js', 'Videojs', 'CE-HTML']}  
                                    onChangeOption={(e) => {
                                        this.setState({drmObject: {...drmObject, playerUsed: e}});
                                    }}
                                />
                                <Select
                                    label="Security Level:"
                                    option={drmObject.securityLevel}
                                    optionsList={this.drmSecurityLevel()}  
                                    onChangeOption={(e) => {
                                        this.setState({drmObject: {...drmObject, securityLevel: e}});
                                    }}
                                />
                                <Input
                                    title = 'Content With DRM'
                                    value = {drmObject.contentWithDrm}
                                    inputStyle = '2'
                                    onInputTextChange={(value) => {
                                        this.setState({drmObject: {...drmObject, contentWithDrm: value}});
                                    }}
                                />
                                <Button name="Add DRM" onClick={ (e)=>{e.preventDefault();this.addDrm();this.addMessage('drm', 'add');this.clearFields('drm')}}></Button>
                            </div>
                            {(this.state.drm.length != 0) ? 
                                (this.state.drm.map((item, index) => 
                                    <div className='miniForm' id={'drm'+index} key={'drm'+index} >
                                        <h6>DRM</h6>
                                        <Select
                                            label="Type:"
                                            option={item.drmType}
                                            optionsList={['PlayReady', 'WideVine', 'FairPlay']}  
                                            onChangeOption={(value) => {
                                                const {drm} = this.state
                                                drm[index].drmType = value
                                                this.setState({drm}, () => {this.changeSecurityLevelItem(index)});
                                            }}
                                        />
                                        <Select
                                            label="Player Used:"
                                            option={item.playerUsed}
                                            optionsList={['HTML5', 'Shaka', 'DASHjs', 'HLS.js', 'Videojs', 'CE-HTML']}  
                                            onChangeOption={(value) => {
                                                const {drm} = this.state
                                                drm[index].playerUsed = value
                                                this.setState({drm});
                                            }}
                                        />
                                        <Select
                                            label="Security Level:"
                                            option={item.securityLevel}
                                            optionsList={this.drmSecurityLevelItem(index)}  
                                            onChangeOption={(value) => {
                                                const {drm} = this.state
                                                drm[index].securityLevel = value
                                                this.setState({drm});
                                            }}
                                        />
                                        <Input
                                            title = 'Content With DRM'
                                            value = {item.contentWithDrm}
                                            inputStyle = '2'
                                            onInputTextChange={(value) => {
                                                const {drm} = this.state
                                                drm[index].contentWithDrm = value
                                                this.setState({drm});
                                            }}
                                        />
                                        <Button name="Remove DRM" onClick={ (e)=>{e.preventDefault();this.removeDrm(index)} }></Button>
                                </div>))
                            : null}
                        </div>
                    </div>
                    <div id='checkbox'>
                        <div><Checkbox name="credentials" liftState={this.onLiftState} isChecked={this.isNewApp() ? credentials : this.state.app.credentials} /> Credentials</div>
                        <div><Checkbox name="adsIntegration" liftState={this.onLiftState} isChecked={this.isNewApp() ? adsIntegration : this.state.app.adsIntegration} /> Ads Integration</div>
                        <div><Checkbox name="ipFilter" liftState={this.onLiftState} isChecked={this.isNewApp() ? ipFilter : this.state.app.ipFilter} /> IP Filter</div>
                        <div><Checkbox name="userAgentFilter" liftState={this.onLiftState} isChecked={this.isNewApp() ? userAgentFilter : this.state.app.userAgentFilter} /> User Agent Filter</div>
                        <div><Checkbox name="contractSigned" liftState={this.onLiftState} isChecked={this.isNewApp() ? contractSigned : this.state.app.contractSigned} /> Contract Signed</div>
                        <div><Checkbox name="cpApproval" liftState={this.onLiftState} isChecked={this.isNewApp() ? cpApproval : this.state.app.cpApproval} /> CP Approval</div>
                        <div><Checkbox name="isTestApp" liftState={this.onLiftState} isChecked={this.isNewApp() ? isTestApp : this.state.app.isTestApp} /> Is Test App</div>
                    </div>
                    <div id='buttons'>
                        <Button name={this.isNewApp() ? "Create New App" : 'Edit App'} type="submit" className='submitButton'>
                            <input type="submit" />
                        </Button>
                        {(!this.isNewApp()) ? (<Button onClick={(e) => {this.showDeleteMessage();e.preventDefault()}} name='Delete App'></Button>) : null}
                        {(this.state.deleteMessage) ? 
                            (<div className='deletePopUp'>
                                <div className="container">
                                    <h5>Do you want to delete this app?</h5>
                                    <div className='deleteButtons'>
                                        <Button onClick={(e) => {this.deleteApp(this.state.app.id);e.preventDefault()}} name='Delete'></Button>
                                        <Button onClick={
                                            (e) => {e.preventDefault();
                                                    this.setState({deleteMessage: !this.state.deleteMessage})}
                                        } name='Cancel' className='cancelButton'></Button>
                                    </div>
                                </div>
                            </div>)
                        : null }
                    </div>
                </form>
            </div>
        )
    }
}