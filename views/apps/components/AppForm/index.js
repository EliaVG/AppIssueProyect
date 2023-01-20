/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import Navbar from '../../../../../components/Navbar';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import Select from '../../../../../components/Select';
import MultiSelect from '../MultiSelect';
import DateInput from '../DateInput';
import DevicesUserAgentPDF from '../DevicesUserAgentPDF';
import AppService from '../../../../../services/app.service';
import { brands, getAppInfo, getAppId, setDevices } from '../helpers/variables';
import './style.scss';

export default class AppForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      app: getAppInfo(),
      name: '',
      urlObject: {
        url: '',
        date: '',
        version: '',
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
      appDescription: {
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
      devicesInfo: [],
      isTestApp: false,
      appManagerId: '',

      playersList: this.getAppPlayers(),
      countriesList: this.getAppCountries(),
      categoriesList: this.getAppCategories(),
      languagesList: this.getAppLanguages(),
      deleteMessage: false,

      devices: this.getDevicesInfo(),
      allDevices: this.getDevicesInfo(),
      devicesReady: false,
      showDevices: true,
      successMessage: false,
    };
  }

  componentDidMount() {
    // console.log('App -> ', this.state.app);
    if (!this.isNewApp()) {
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
        appManagerId: this.state.app.appManagerId,
      });
      this.formatState();
      document.getElementById('inputFields').setAttribute('style', 'pointer-events: none');
    }
  }

  // Envío de formulario para crear nueva app
  onSubmit = (e) => {
    // Desestructuramos variables y objetos del estado
    const {
      name,
      alias,
      redmineTask,
      credentials,
      foxxumPic,
      techStandard,
      players,
      adsIntegration,
      handleBackButton,
      deepLinkApi,
      ipFilter,
      userAgentFilter,
      cpType,
      designDocument,
      additionalInformation,
      originalPlatform,
      targetCountries,
      relevantPlatforms,
      contractSigned,
      cpApproval,
      appDescription,
      CPPic,
      devicesInfo,
      app_categories,
      languages,
      geoBlocking,
      appUrls,
      drm,
      streamingTech,
      isTestApp,
      appManagerId,
    } = this.state;

    e.preventDefault();

    // Declaramos el objeto App que vamos a guardar
    const app = {
      name,
      alias,
      redmineTask,
      credentials,
      foxxumPic,
      techStandard,
      players,
      adsIntegration,
      handleBackButton,
      deepLinkApi,
      ipFilter,
      userAgentFilter,
      cpType,
      designDocument,
      additionalInformation,
      originalPlatform,
      targetCountries,
      relevantPlatforms,
      contractSigned,
      cpApproval,
      appDescription,
      CPPic,
      devicesInfo,
      app_categories,
      languages,
      geoBlocking,
      appUrls,
      drm,
      streamingTech,
      isTestApp,
      appManagerId,
    };

    // console.error('Enviado -> ', app);

    if (this.isNewApp())
      AppService.addNewApp(app)
        .then(() => {
          window.location.href = `/dashboardpc/management/apps`;
        })
        .catch((error) => {
          console.error(error);
        });
    else
      AppService.updateApp(getAppId(), app)
        .then(() => {
          this.setState({ successMessage: true });
          setTimeout(() => this.setState({ successMessage: false }), 1000);
        })
        .catch((error) => {
          console.error(error);
        });
  };

  // Actualizar valor de entradas de texto
  handleInputChange = (value, fieldState) => {
    this.setState({
      [fieldState]: value,
    });

    // console.log(fieldState, ' => ', value);
  };

  // Actualizar valor de los Checkbox
  onLiftState = (state) => {
    const { name, isChecked } = state;
    this.setState({ [name]: isChecked });

    // console.log(name, ' => ', isChecked);
  };

  // Actualizar valor de un Select
  onChangeInput = (value, field) => {
    this.setState({ [field]: value });

    // console.log(field, ' => ', value)
  };

  // Actualizar valor de fecha introducida
  onChangeDate = () => {
    const { urlObject } = this.state;
    const dateAux = document.getElementById('date').value;
    this.setState({ urlObject: { ...urlObject, date: dateAux } });

    // console.log('Date => ', dateAux)
  };

  // Actulizar valor de un MultiSelect
  onChangeMultiSelect(e, field) {
    const values = [];

    e.map((item) => {
      values.push(item.value);
    });
    this.setState({ [field]: values });

    // console.log(field, ' => ', values);
  }

  // Método para actualizar valor del MultiSelect dentro de un array de objetos
  onChangeMultiSelectPlayerUsed(e) {
    const { drmObject } = this.state;
    const values = [];

    e.map((item) => {
      values.push(item.value);
    });

    this.setState({ drmObject: { ...drmObject, playerUsed: values } });

    // console.log(field, ' => ', values);
  }

  getDevicesInfo() {
    const devicesCompleteInfo = [];
    const devicesAux = [];
    const allDevices = [];

    AppService.getDevices()
      .then((response) => {
        response.data.data.map((device) => devicesAux.push(device));
        this.setState({ devicesAux });
        devicesAux.map((deviceAux) => {
          this.state.devicesInfo.map((device) => {
            if (deviceAux.fxmId == device.deviceId) devicesCompleteInfo.push(deviceAux);
          });
        });
        this.setState({ devices: devicesCompleteInfo });
        setDevices(this.state.devices);

        devicesAux.map((device) => {
          allDevices.push({
            value: device.id,
            label: `${device.portalIds} - ${device.specs.brand} - ${device.specs.chipset}`,
          });
        });

        this.setState({ allDevices });
        this.setState({ devicesList: this.devicesOptions() });
        this.setState({ devicesReady: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getAppCategories() {
    const categories = [];
    AppService.getCategories()
      .then((response) => {
        response.data.data.map((value) => categories.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });

    return categories;
  }

  // Obtener los países de la base de datos
  getAppCountries() {
    const countries = [];
    AppService.getCountries1()
      .then((response) => {
        response.data.data.map((value) => countries.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });
    AppService.getCountries2()
      .then((response) => {
        response.data.data.map((value) => countries.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });
    AppService.getCountries3()
      .then((response) => {
        response.data.data.map((value) => countries.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });

    return countries;
  }

  // Obtener los idiomas disponibles en la base de datos
  getAppLanguages() {
    const languages = [];
    AppService.getLanguages1()
      .then((response) => {
        response.data.data.map((value) => languages.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });
    AppService.getLanguages2()
      .then((response) => {
        response.data.data.map((value) => languages.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });

    return languages;
  }

  // Obtener los players de la base de datos
  getAppPlayers() {
    const players = [];
    AppService.getPlayers()
      .then((response) => {
        response.data.data.map((value) => players.push({ value: value.id, label: value.name }));
      })
      .catch((error) => {
        console.error(error);
      });

    return players;
  }

  getDevices(countries) {
    const devices = [];
    let filteredDevices = [];
    const devicesInfo = [];

    AppService.getDevices()
      .then((response) => {
        response.data.data.map((device) =>
          devices.push({
            deviceId: device.fxmId,
            id: device.id,
            countries: device.countries,
            portals: device.portalIds,
            appCodeManager: device.appCodeManager,
          })
        );

        countries.map((country) => {
          devices.map((device) => {
            device.countries.map((deviceCountry) => {
              if (deviceCountry.id == country.value) {
                filteredDevices.push(device);
              }
            });
          });
        });

        const devicesAux = new Set(filteredDevices);
        filteredDevices = [...devicesAux];

        filteredDevices.map((myDevice) => {
          const device = { id: myDevice.id };
          devicesInfo.push({ deviceId: myDevice.deviceId, device });
        });

        const devicesList = [];

        this.state.allDevices.map((deviceAux) => {
          filteredDevices.map((dev) => {
            if (deviceAux.value == dev.id) {
              devicesList.push(deviceAux);
            }
          });
        });

        setDevices(filteredDevices);
        this.setState({ devicesInfo, devicesList });
        this.setState({ devicesReady: false });
        this.setState({ devicesReady: true });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteApp = (id) => {
    AppService.deleteApp(id);
    window.location.href = '/dashboardpc/management/apps';
  };

  addMessage(id, action) {
    const message = document.createElement('p');
    message.id = 'message';
    action == 'add' ? (message.innerHTML = 'Element added') : (message.innerHTML = 'Element edited');
    document.getElementById(id).appendChild(message);
    setTimeout(() => {
      document.getElementById(id).removeChild(message);
    }, 2000);
  }

  showDeleteMessage() {
    const { deleteMessage } = this.state;
    this.setState({ deleteMessage: !deleteMessage });
    return deleteMessage;
  }

  multiSelectOption(array) {
    const options = [];
    array.map((value) => options.push({ value: value.id, label: value.name }));
    return options;
  }

  multiSelectOptionNoRelational(array) {
    const options = [];
    array.map((item) => options.push({ value: item, label: item }));
    return options;
  }

  changeSecurityLevelItem(index) {
    const { drm } = this.state;
    const item = drm[index];

    // console.log(item)

    if (item.drmType == 'PlayReady') {
      drm[index].securityLevel = 'SL150';
      this.setState(drm);
    } else if (item.drmType == 'WideVine') {
      drm[index].securityLevel = 'L1';
      this.setState(drm);
    } else {
      drm[index].securityLevel = '';
      this.setState(drm);
    }
  }

  drmSecurityLevelItem(index) {
    let securityLevel = [];
    const { drm } = this.state;
    const item = drm[index];
    const type = item.drmType;

    if (type == 'PlayReady') securityLevel = ['SL150', 'SL2000', 'SL3000'];
    else if (type == 'WideVine') {
      securityLevel = ['L1', 'L2', 'L3'];
    }

    return securityLevel;
  }

  changeSecurityLevel() {
    const { drmObject } = this.state;

    if (this.state.drmObject.drmType == 'PlayReady')
      this.setState({ drmObject: { ...drmObject, securityLevel: 'SL150' } });
    else if (this.state.drmObject.drmType == 'WideVine')
      this.setState({ drmObject: { ...drmObject, securityLevel: 'L1' } });
    else this.setState({ drmObject: { ...drmObject, securityLevel: '' } });
  }

  drmSecurityLevel() {
    let securityLevel = [];

    if (this.state.drmObject.drmType == 'PlayReady') securityLevel = ['SL150', 'SL2000', 'SL3000'];
    else if (this.state.drmObject.drmType == 'WideVine') securityLevel = ['L1', 'L2', 'L3'];

    return securityLevel;
  }

  addDrm() {
    const drmListAux = this.state.drm;
    drmListAux.push(this.state.drmObject);
    this.setState({ drm: drmListAux });
  }

  addUrl() {
    const urlListAux = this.state.appUrls;
    urlListAux.push(this.state.urlObject);
    this.setState({ appUrls: urlListAux });
  }

  addStreamingTech() {
    const streamingTechListAux = this.state.streamingTech;
    streamingTechListAux.push(this.state.streamingTechAux);
    this.setState({ streamingTech: streamingTechListAux });
  }

  isNewApp() {
    if (Object.keys(this.state.app).length === 0) return true;

    return false;
  }

  // Método auxiliar para formatear los datos que guardamos en el estado
  formatState() {
    const categories = [];
    this.state.app.app_categories.map((item) => categories.push(item.id));
    this.setState({ app_categories: categories });

    const languages = [];
    this.state.app.languages.map((item) => languages.push(item.id));
    this.setState({ languages });

    const players = [];
    this.state.app.players.map((item) => players.push(item.id));
    this.setState({ players });

    const countries = [];
    this.state.app.targetCountries.map((item) => countries.push(item.id));
    this.setState({ targetCountries: countries });

    const { short, mid, long } = this.state.app.appDescription;
    this.setState({ appDescription: { ...this.state.appDescription, short, mid, long } });
  }

  // Método para vaciar los campos input al añadir un valor
  // eslint-disable-next-line class-methods-use-this
  clearFields(item) {
    const inputs = [...document.getElementById(item).getElementsByTagName('input')];
    // eslint-disable-next-line no-return-assign, no-param-reassign
    inputs.forEach((elem) => (elem.value = ''));
  }

  // Eliminar un elemento seleccionado por su índice del estado drm
  removeDrm(index) {
    const { drm } = this.state;
    const newDrm = drm;
    newDrm.splice(index, 1);
    this.setState({ drm: newDrm });
  }

  // Eliminar un elemento seleccionado por su índice del estado url
  removeUrl(index) {
    const { appUrls } = this.state;
    const newUrl = appUrls;
    newUrl.splice(index, 1);
    this.setState({ appUrls: newUrl });
  }

  // Eliminar un elemento seleccionado por su índice del estado streamingTech
  removeStreamingTech(index) {
    const { streamingTech } = this.state;
    const newStreamingTech = streamingTech;
    newStreamingTech.splice(index, 1);
    this.setState({ streamingTech: newStreamingTech });
  }

  // Método para pintar un Input por cada elemento del array recibido como parámetro
  renderInputs = (arrayInputs) => {
    let name = '';

    return arrayInputs.map((inputName) => {
      switch (inputName) {
        case 'alias':
          name = 'Alias';
          break;
        case 'name':
          name = 'Name';
          break;
        case 'redmineTask':
          name = 'Redmine Task';
          break;
        case 'appManagerId':
          name = 'App Manager Id *';
          break;
        case 'foxxumPic':
          name = 'Foxxum PIC';
          break;
        case 'handleBackButton':
          name = 'Handle Back Button';
          break;
        case 'deepLinkApi':
          name = 'Deep Link API';
          break;
        case 'cpType':
          name = 'CP Type';
          break;
        case 'designDocument':
          name = 'Design Document';
          break;
        case 'originalPlatform':
          name = 'Original Platform';
          break;
        default:
          name = 'Additional Information';
      }

      const renderValue = this.isNewApp() ? '' : this.state.app[inputName];
      return (
        <Input
          title={name}
          valueInput={renderValue}
          inputStyle="2"
          onInputTextChange={(value) => {
            this.handleInputChange(value, inputName);
          }}
        />
      );
    });
  };

  devicesOptions() {
    const options = [];

    this.state.allDevices.map((device) => {
      this.state.devices.map((item) => {
        if (device.value == item.id) options.push(device);
      });
    });

    return options;
  }

  // Método para pintar un MultiSelect por cada elemento del array recibido como parámetro
  renderMultiSelects = (arrayMultiSelects) => {
    let name = '';

    return arrayMultiSelects.map((select) => {
      switch (select.field) {
        case 'players':
          name = 'Players:';
          break;
        case 'targetCountries':
          name = 'Target Countries:';
          break;
        case 'app_categories':
          name = 'App Categories:';
          break;
        default:
          name = 'Languages:';
      }

      const { optionList, field } = select;
      return (
        <MultiSelect
          label={name}
          option={
            this.isNewApp() || this.state.app[field] == undefined
              ? field
              : this.multiSelectOption(this.state.app[field])
          }
          optionsList={this.state[optionList]}
          onChangeOption={(e) => {
            this.onChangeMultiSelect(e, field);
            // eslint-disable-next-line no-unused-expressions
            field == 'targetCountries' ? this.getDevices(e) : null;
          }}
        />
      );
    });
  };

  formEditable() {
    document.getElementById('inputFields').setAttribute('style', 'pointer-events: true');
    const popUp = document.createElement('div');
    popUp.className = 'successPopUp';

    const container = document.createElement('div');
    container.className = 'container';

    const message = document.createElement('p');

    message.innerHTML = 'Now you can edit';

    popUp.appendChild(container).appendChild(message);

    document.getElementById('inputFields').appendChild(popUp);
    setTimeout(() => document.getElementById('inputFields').removeChild(popUp), 1000);

    this.setState({ formEditable: true });
  }

  // Método que ejecutamos al renderizar la app
  render() {
    // Declaramos variables que vamos a usar
    const {
      urlObject,
      credentials,
      techStandard,
      adsIntegration,
      ipFilter,
      userAgentFilter,
      relevantPlatforms,
      contractSigned,
      cpApproval,
      appDescription,
      streamingTechAux,
      CPPic,
      drmObject,
      geoBlocking,
      isTestApp,
      devicesList,
      allDevices,
      devicesAux,
    } = this.state;

    const arrayInputs = [
      'alias',
      'name',
      'redmineTask',
      'appManagerId',
      'foxxumPic',
      'handleBackButton',
      'deepLinkApi',
      'cpType',
      'designDocument',
      'originalPlatform',
      'additionalInformation',
    ];

    const arrayMultiSelects = [
      { optionList: 'playersList', field: 'players' },
      { optionList: 'countriesList', field: 'targetCountries' },
      { optionList: 'categoriesList', field: 'app_categories' },
      { optionList: 'languagesList', field: 'languages' },
    ];

    // Formulario para apps
    return (
      <div id="managment-createApp">
        <Navbar title="NEW APP" isAdmin="yes" />
        <div className="secTitle">{this.isNewApp() ? 'New App' : 'Edit App'}</div>
        <form onSubmit={this.onSubmit} id="appForm">
          <div id="inputFields">
            <div id="appProperties">
              <div id="input">
                {this.renderInputs(arrayInputs)}

                <div id="CPPic">
                  <h6>CPPic</h6>
                  <div>
                    <Input
                      title="Name"
                      valueInput={this.isNewApp() ? CPPic.name : this.state.app.CPPic.name}
                      inputStyle="2"
                      onInputTextChange={(value) => {
                        this.setState({ CPPic: { ...this.state.CPPic, name: value } });
                      }}
                    />
                    <Input
                      title="Email"
                      valueInput={this.isNewApp() ? CPPic.email : this.state.app.CPPic.email}
                      inputStyle="2"
                      onInputTextChange={(value) => {
                        this.setState({ CPPic: { ...this.state.CPPic, email: value } });
                      }}
                    />
                  </div>
                </div>
                <div id="appDescription">
                  <h6>App Description</h6>
                  <div>
                    <Input
                      title="Short Description"
                      valueInput={this.isNewApp() ? appDescription.short : this.state.app.appDescription.short}
                      inputStyle="2"
                      onInputTextChange={(value) => {
                        this.setState({ appDescription: { ...this.state.appDescription, short: value } });
                      }}
                    />
                    <Input
                      title="Medium Description"
                      valueInput={this.isNewApp() ? appDescription.mid : this.state.app.appDescription.mid}
                      inputStyle="2"
                      onInputTextChange={(value) => {
                        this.setState({ appDescription: { ...this.state.appDescription, mid: value } });
                      }}
                    />
                    <Input
                      title="Long Description"
                      valueInput={this.isNewApp() ? appDescription.long : this.state.app.appDescription.long}
                      inputStyle="2"
                      onInputTextChange={(value) => {
                        this.setState({ appDescription: { ...this.state.appDescription, long: value } });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div id="select">
                <Select
                  label="Tech Standard:"
                  option={techStandard}
                  optionsList={['CEhtml', 'hbbTV', 'html5']}
                  onChangeOption={(e) => {
                    this.onChangeInput(e, 'techStandard');
                  }}
                />

                {this.renderMultiSelects(arrayMultiSelects)}

                <MultiSelect
                  label="Relevant Platforms:"
                  option={
                    this.isNewApp() || this.state.app.relevantPlatforms == undefined
                      ? relevantPlatforms
                      : this.multiSelectOptionNoRelational(this.state.app.relevantPlatforms)
                  }
                  optionsList={brands}
                  onChangeOption={(e) => {
                    this.onChangeMultiSelect(e, 'relevantPlatforms');
                  }}
                />
                <div id="geoBlocking">
                  <h6>GeoBlocking</h6>
                  <div>
                    <MultiSelect
                      label="Allowed Countries:"
                      option={
                        this.isNewApp() || this.state.app.geoBlocking.allowedCountries == undefined
                          ? geoBlocking.allowedCountries
                          : this.multiSelectOptionNoRelational(this.state.app.geoBlocking.allowedCountries)
                      }
                      optionsList={this.state.countriesList}
                      onChangeOption={(value) => {
                        this.setState({
                          geoBlocking: { ...this.state.geoBlocking, allowedCountries: value.map((item) => item.value) },
                        });
                      }}
                    />
                    <MultiSelect
                      label="Blocked Countries:"
                      option={
                        this.isNewApp() || this.state.app.geoBlocking.deniedCountries == undefined
                          ? geoBlocking.deniedCountries
                          : this.multiSelectOptionNoRelational(this.state.app.geoBlocking.deniedCountries)
                      }
                      optionsList={this.state.countriesList}
                      onChangeOption={(value) => {
                        this.setState({
                          geoBlocking: { ...this.state.geoBlocking, deniedCountries: value.map((item) => item.value) },
                        });
                      }}
                    />
                  </div>
                </div>

                {this.state.devicesReady && (
                  <div className="devices">
                    <MultiSelect
                      id="selectDevices"
                      label="Devices:"
                      option={devicesList}
                      optionsList={allDevices}
                      onChangeOption={(e) => {
                        const listAux = [];
                        devicesAux.forEach((dev) => {
                          e.forEach((item) => {
                            if (dev.id === item.value) {
                              const device = { id: dev.id };
                              listAux.push({ deviceId: dev.fxmId, device, statusAppDevice: 'Testing' });
                            }
                          });
                        });
                        setDevices(listAux);
                        this.setState({ devicesInfo: listAux });
                        this.setState({ showDevices: false });
                      }}
                    />
                    <Button
                      name="Download User Agent"
                      className="userAgentButton"
                      onClick={async (e) => {
                        e.preventDefault();
                        const myDate = new Date();
                        const day = myDate.getDate() < 10 ? `0${myDate.getDate()}` : myDate.getDate();
                        const month = myDate.getMonth() + 1 < 10 ? `0${myDate.getMonth() + 1}` : myDate.getMonth() + 1;
                        const year = myDate.getFullYear().toString().substring(2);
                        const dateAux = { day, month, year };
                        const DocName = `Foxxum_${this.state.app.name}-UserAgents_${dateAux}`;
                        const doc = (
                          <DevicesUserAgentPDF
                            devices={this.state.devices}
                            date={dateAux}
                            appName={this.state.app.name}
                          />
                        );
                        const asPdf = pdf([]);
                        asPdf.updateContainer(doc);
                        const blob = await asPdf.toBlob();
                        saveAs(blob, DocName);
                      }}
                    />
                  </div>
                )}
              </div>
              <div id="streamingTechDiv">
                <div className="miniForm" id="streamingTech">
                  <h6>Streaming Tech</h6>
                  <Select
                    label="Name:"
                    option={streamingTechAux.name}
                    optionsList={['HLS', 'DASH', 'MSS']}
                    onChangeOption={(e) => {
                      this.setState({ streamingTechAux: { ...streamingTechAux, name: e } });
                    }}
                  />
                  <Input
                    title="Version"
                    valueInput={streamingTechAux.version}
                    inputStyle="2"
                    onInputTextChange={(value) => {
                      this.setState({ streamingTechAux: { ...streamingTechAux, version: value } });
                    }}
                  />
                  <Button
                    name="Add Streaming Tech"
                    onClick={(e) => {
                      e.preventDefault();
                      this.addStreamingTech();
                      this.addMessage('streamingTech', 'add');
                      this.clearFields('streamingTech');
                    }}
                  />
                </div>
                {this.state.streamingTech.length != 0
                  ? this.state.streamingTech.map((item, index) => (
                      <div className="miniForm" id={`streamingTech${index}`} key={`streamingTech${index}`}>
                        <h6>Streaming Tech</h6>
                        <Select
                          label="Name:"
                          option={item.name}
                          optionsList={['HLS', 'DASH', 'MSS']}
                          onChangeOption={(e) => {
                            const { streamingTech } = this.state;
                            streamingTech[index].name = e;
                            this.setState({ streamingTech });
                          }}
                        />
                        <Input
                          title="Version"
                          value={item.version}
                          inputStyle="2"
                          onInputTextChange={(value) => {
                            const { streamingTech } = this.state;
                            streamingTech[index].version = value;
                            this.setState({ streamingTech });
                          }}
                        />
                        <Button
                          name="Remove Streaming Tech"
                          onClick={(e) => {
                            e.preventDefault();
                            this.removeStreamingTech(index);
                          }}
                        />
                      </div>
                    ))
                  : null}
              </div>
              <div id="urlDiv">
                <div className="miniForm" id="url">
                  <h6>URL *</h6>
                  <Input
                    title="URL"
                    valueInput={urlObject.url}
                    inputStyle="2"
                    onInputTextChange={(value) => {
                      this.setState({ urlObject: { ...urlObject, url: value } });
                    }}
                  />
                  <DateInput
                    id="date"
                    onChangeOption={(e) => {
                      this.onChangeDate(e);
                    }}
                  />
                  <Input
                    title="Version"
                    valueInput={urlObject.version}
                    inputStyle="2"
                    onInputTextChange={(value) => {
                      this.setState({ urlObject: { ...urlObject, version: value } });
                    }}
                  />
                  <Button
                    name="Add URL"
                    onClick={(e) => {
                      e.preventDefault();
                      this.addUrl();
                      this.addMessage('url', 'add');
                      this.clearFields('url');
                    }}
                  />
                </div>
                {this.state.appUrls.length != 0
                  ? this.state.appUrls.map((item, index) => (
                      <div className="miniForm" id={`url${index}`} key={`url${index}`}>
                        <h6>URL</h6>
                        <Input
                          title="URL"
                          value={item.url}
                          inputStyle="2"
                          onInputTextChange={(value) => {
                            const { appUrls } = this.state;
                            appUrls[index].url = value;
                            this.setState({ appUrls });
                          }}
                        />
                        <DateInput
                          id="date"
                          defaultValue={item.date}
                          onChangeOption={(e) => {
                            const { appUrls } = this.state;
                            appUrls[index].date = e.target.value;
                            this.setState({ appUrls });
                          }}
                        />
                        <Input
                          title="Version"
                          value={item.version}
                          inputStyle="2"
                          onInputTextChange={(value) => {
                            const { appUrls } = this.state;
                            appUrls[index].version = value;
                            this.setState({ appUrls });
                          }}
                        />
                        <Button
                          name="Remove URL"
                          onClick={(e) => {
                            e.preventDefault();
                            this.removeUrl(index);
                          }}
                        />
                      </div>
                    ))
                  : null}
              </div>
              <div id="drmDiv">
                <div className="miniForm" id="drm">
                  <h6>DRM</h6>
                  <Select
                    label="Type:"
                    option={drmObject.drmType}
                    optionsList={['PlayReady', 'WideVine', 'FairPlay']}
                    onChangeOption={(e) => {
                      this.setState(
                        { drmObject: { ...drmObject, drmType: e, securityLevel: this.drmSecurityLevel()[0] } },
                        () => {
                          this.changeSecurityLevel();
                        }
                      );
                    }}
                  />
                  <Select
                    label="Player Used:"
                    option={drmObject.playerUsed}
                    optionsList={['HTML5', 'Shaka', 'DASHjs', 'HLS.js', 'Videojs', 'CE-HTML']}
                    onChangeOption={(e) => {
                      this.setState({ drmObject: { ...drmObject, playerUsed: e } });
                    }}
                  />
                  <Select
                    label="Security Level:"
                    option={drmObject.securityLevel}
                    optionsList={this.drmSecurityLevel()}
                    onChangeOption={(e) => {
                      this.setState({ drmObject: { ...drmObject, securityLevel: e } });
                    }}
                  />
                  <Input
                    title="Content With DRM"
                    value={drmObject.contentWithDrm}
                    inputStyle="2"
                    onInputTextChange={(value) => {
                      this.setState({ drmObject: { ...drmObject, contentWithDrm: value } });
                    }}
                  />
                  <Button
                    name="Add DRM"
                    onClick={(e) => {
                      e.preventDefault();
                      this.addDrm();
                      this.addMessage('drm', 'add');
                      this.clearFields('drm');
                    }}
                  />
                </div>
                {this.state.drm.length != 0
                  ? this.state.drm.map((item, index) => (
                      <div className="miniForm" id={`drm${index}`} key={`drm${index}`}>
                        <h6>DRM</h6>
                        <Select
                          label="Type:"
                          option={item.drmType}
                          optionsList={['PlayReady', 'WideVine', 'FairPlay']}
                          onChangeOption={(value) => {
                            const { drm } = this.state;
                            drm[index].drmType = value;
                            this.setState({ drm }, () => {
                              this.changeSecurityLevelItem(index);
                            });
                          }}
                        />
                        <Select
                          label="Player Used:"
                          option={item.playerUsed}
                          optionsList={['HTML5', 'Shaka', 'DASHjs', 'HLS.js', 'Videojs', 'CE-HTML']}
                          onChangeOption={(value) => {
                            const { drm } = this.state;
                            drm[index].playerUsed = value;
                            this.setState({ drm });
                          }}
                        />
                        <Select
                          label="Security Level:"
                          option={item.securityLevel}
                          optionsList={this.drmSecurityLevelItem(index)}
                          onChangeOption={(value) => {
                            const { drm } = this.state;
                            drm[index].securityLevel = value;
                            this.setState({ drm });
                          }}
                        />
                        <Input
                          title="Content With DRM"
                          value={item.contentWithDrm}
                          inputStyle="2"
                          onInputTextChange={(value) => {
                            const { drm } = this.state;
                            drm[index].contentWithDrm = value;
                            this.setState({ drm });
                          }}
                        />
                        <Button
                          name="Remove DRM"
                          onClick={(e) => {
                            e.preventDefault();
                            this.removeDrm(index);
                          }}
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>
            <div id="checkbox">
              <div>
                <Checkbox
                  name="credentials"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? credentials : this.state.credentials}
                />{' '}
                Credentials
              </div>
              <div>
                <Checkbox
                  name="adsIntegration"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? adsIntegration : this.state.adsIntegration}
                />{' '}
                Ads Integration
              </div>
              <div>
                <Checkbox
                  name="ipFilter"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? ipFilter : this.state.ipFilter}
                />{' '}
                IP Filter
              </div>
              <div>
                <Checkbox
                  name="userAgentFilter"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? userAgentFilter : this.state.userAgentFilter}
                />{' '}
                User Agent Filter
              </div>
              <div>
                <Checkbox
                  name="contractSigned"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? contractSigned : this.state.contractSigned}
                />{' '}
                Contract Signed
              </div>
              <div>
                <Checkbox
                  name="cpApproval"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? cpApproval : this.state.cpApproval}
                />{' '}
                CP Approval
              </div>
              <div>
                <Checkbox
                  name="isTestApp"
                  liftState={this.onLiftState}
                  isChecked={this.isNewApp() ? isTestApp : this.state.isTestApp}
                />{' '}
                Is Test App
              </div>
            </div>
          </div>
          <div id="buttons">
            {!this.isNewApp() && !this.state.formEditable && (
              <Button
                name="Edit App"
                className="editButton"
                onClick={(e) => {
                  e.preventDefault();
                  this.formEditable();
                }}
              />
            )}
            {(this.state.formEditable || this.isNewApp()) && (
              <Button name={this.isNewApp() ? 'Create New App' : 'Save App'} type="submit" className="submitButton">
                <input type="submit" />
              </Button>
            )}
            {!this.isNewApp() ? (
              <Button
                onClick={(e) => {
                  this.showDeleteMessage();
                  e.preventDefault();
                }}
                name={<img src="https://img.icons8.com/material-rounded/24/FFFFFF/trash.png" />}
                className="mainDeleteButton"
              />
            ) : null}
            {this.state.deleteMessage ? (
              <div className="deletePopUp">
                <div className="container">
                  <h5>Do you want to delete this app?</h5>
                  <div className="deleteButtons">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ deleteMessage: !this.state.deleteMessage });
                      }}
                      name="Cancel"
                    />
                    <Button
                      onClick={(e) => {
                        this.deleteApp(this.state.app.id);
                        e.preventDefault();
                      }}
                      name={<img src="https://img.icons8.com/material-rounded/24/FFFFFF/trash.png" />}
                      className="deleteButton"
                    />
                  </div>
                </div>
              </div>
            ) : null}
            {this.state.successMessage ? (
              <div className="successPopUp">
                <div className="container">
                  <p>App Saved Successfully!</p>
                </div>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    );
  }
}
