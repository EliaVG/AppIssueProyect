/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Navbar from '../../../../components/Navbar';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import AppService from '../../../../services/app.service';
import AppForm from '../components/AppForm';
import { setAppInfo, setAppId } from '../components/helpers/variables';
import AllIssues from '../../issues/all';

export default class EditApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      app: [],
      isAppReady: false,
    };
  }

  componentDidMount() {
    this.getApp();
  }

  getApp = () => {
    // eslint-disable-next-line react/destructuring-assignment
    const { id } = this.props.match.params;
    setAppId(id);

    AppService.getApp(id)
      .then((response) => {
        const app = response.data.data[0];
        setAppInfo(app);

        this.setState({
          app,
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

          isAppReady: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Método para renderizar el formulario para apps
  renderForm() {
    return <AppForm />;
  }

  // Método para renderizar el contenido por defecto de la app
  render() {
    const { isAppReady } = this.state;
    return (
      <div id="editApp">
        <Navbar title="editApp" isAdmin="yes" />
        {!isAppReady ? <SpinnerLoading /> : this.renderForm()}
        {!isAppReady ? '' : <AllIssues />}
      </div>
    );
  }
}
