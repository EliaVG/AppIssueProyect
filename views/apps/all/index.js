/* eslint-disable camelcase */
import React, { Component } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import Navbar from '../../../../components/Navbar';
import AppService from '../../../../services/app.service';
import SearchInput from '../../../../components/SearchInput';
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import Checkbox from '../../../../components/Checkbox';
import { setAppId, setAppInfo } from '../components/helpers/variables';

const AVAILABLE_PROPERTIES = ['alias', 'redmineTask', 'url', 'appManagerId', 'foxxumPic', 'categories', 'countries'];

export default class AllApps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apps: [],
      isAppsReady: false,
    };

    this.tableHeader = [
      { header: 'Name', headerKey: 'name' },
      { header: 'Redmine Task', headerKey: 'redmineTaskLink' },
      { header: 'URL', headerKey: 'url' },
      { header: 'App Manager Id', headerKey: 'appManagerIdLink' },
      { header: 'Foxxum Pic', headerKey: 'foxxumPic' },
      { header: 'Categories', headerKey: 'categories' },
      { header: 'Target Countries', headerKey: 'countries' },
      { header: 'Is Test App', headerKey: 'isTestAppCheckbox' },
      { header: 'Actions', headerKey: 'actions' },
    ];
  }

  componentDidMount() {
    this.getAllApps();
  }

  getAllApps = () => {
    AppService.getAllApps()
      .then((response) => {
        this.setState({
          apps: response.data.data,
          isAppsReady: true,
        });
        const { apps } = this.state;
        const appsAux = apps.map((app) => {
          const { app_categories, targetCountries } = app;
          const categoriesAux = [];
          const countriesAux = [];
          app_categories.map((category) => {
            categoriesAux.push(category.name);
          });
          targetCountries.map((country) => {
            countriesAux.push(country.ISO3166);
          });
          return {
            ...app,
            categories: categoriesAux.join(', '),
            url: app.appUrls[app.appUrls.length - 1].url,
            countries: countriesAux.join(', '),
          };
        });
        this.setState({ apps: appsAux });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getAppsActions(app) {
    const { id } = app;
    return <Link to={`/management/apps/${id}`}>Details</Link>;
  }

  get filteredTable() {
    const { apps, filteredApps } = this.state;

    // console.log(apps);

    if (!apps) {
      return [];
    }
    let appsToUse = filteredApps;
    if (!appsToUse || appsToUse.length < 0) {
      appsToUse = apps;
    }

    return appsToUse.map((app) => {
      // eslint-disable-next-line camelcase
      const { name, redmineTask, url, appManagerId, foxxumPic, categories, countries, isTestApp } = app;

      const isTestAppCheckbox = <Checkbox name="isTestApp" isChecked={isTestApp} disabled="disabled" />;
      const actions = this.getAppsActions(app);

      const redmineTaskLink = (
        <Link onClick={() => window.open(`https://projects.foxxum.com/redmine/issues/${redmineTask}`, '_blank')}>
          {redmineTask}
        </Link>
      );

      const appManagerIdLink = (
        <Link
          onClick={() =>
            window.open(
              `http://appmanagertest.cors.foxxum.com/backend/pages/appmanager/?action=edit&id=${appManagerId}`,
              '_blank'
            )
          }
        >
          {appManagerId}
        </Link>
      );

      return {
        name,
        redmineTaskLink,
        url,
        appManagerIdLink,
        foxxumPic,
        categories,
        countries,
        isTestAppCheckbox,
        actions,
      };
    });
  }

  appPropertyMatches = (app, property, inputText) => {
    if (!Object.prototype.hasOwnProperty.call(app, property)) {
      return false;
    }
    return `${app[property]}`.toLowerCase().includes(inputText.toLowerCase());
  };

  filterAppsBy = (inputText) => {
    const { apps } = this.state;

    return apps.filter((app) => {
      return !!AVAILABLE_PROPERTIES.find((property) => {
        return this.appPropertyMatches(app, property, inputText);
      });
    });
  };

  inputTextChange = (inputText) => {
    clearTimeout(this.filteringTO);
    this.filteringTO = setTimeout(() => {
      this.setState({ filteredApps: this.filterAppsBy(inputText) });
    }, 500);
  };

  parseContent = () => {
    return (
      <div className="searchApp">
        <Link to="/management/createApp">
          <Button
            name="New App"
            onClick={() => {
              setAppId('');
              setAppInfo('');
            }}
          />
        </Link>
        <SearchInput onInputTextChange={this.inputTextChange} />
        <div id="div-table">
          <Table headersTable={this.tableHeader} dataTable={this.filteredTable} />
        </div>
      </div>
    );
  };

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
