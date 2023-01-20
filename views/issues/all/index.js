import React, { Component } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import IssueService from '../../../../services/issue.service';
import { getAppId, getAppInfo } from '../../apps/components/helpers/variables';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import './style.scss';
import Button from '../../../../components/Button';
import SearchInput from '../../../../components/SearchInput';
import Table from '../../../../components/Table';
import Checkbox from '../../../../components/Checkbox';
import IssueForm from '../components/IssueForm';
import {
  getShowIssueForm,
  setShowIssueForm,
  setIssue,
  setShowDevicesTable,
  setDevices,
} from '../components/helpers/variables';
import IssuesReportPDF from '../components/IssuesReportPDF';
import DevicesTable from '../components/DevicesTable';

const AVAILABLE_PROPERTIES = ['issueId', 'name', 'category', 'severity', 'testedBy', 'isSolved', 'devicesNameShort'];

export default class AllIssues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issues: [],
      isIssuesReady: false,
      categories: [],
      app: getAppInfo(),
    };

    this.tableHeader = [
      { header: 'ID', headerKey: 'issueId' },
      { header: 'Name', headerKey: 'name' },
      { header: 'Category', headerKey: 'category' },
      { header: 'Issue Devices', headerKey: 'devicesNameShort' },
      { header: 'Severity', headerKey: 'severity' },
      { header: 'Tested By', headerKey: 'testedBy' },
      { header: 'Is Solved', headerKey: 'isSolvedCheckbox' },
      { header: 'Actions', headerKey: 'actions' },
    ];
  }

  componentDidMount() {
    this.getAllIssues();
    this.getCategory();
  }

  getCategory = () => {
    IssueService.getIssueCategoryAux(getAppId())
      .then((response) => {
        const issueAux = response.data.data.issues;
        const categories = [];
        const categoriesId = [];
        issueAux.map((issue) => {
          categories.push(issue.issue_category.name);
          categoriesId.push(issue.issue_category.id);
        });
        this.setState({ categories }, () => {
          this.setIssueCategories();
        });
        this.setState({ categoriesId }, () => {
          this.setIssueCategoriesId();
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getAllIssues = () => {
    const { app, issues } = this.state;

    this.setState({
      issues: app.issues,
      isIssuesReady: true,
    });

    const appDevices = app.devicesInfo;
    const issueDevices = [];
    // eslint-disable-next-line react/destructuring-assignment
    app.issues.map((issue, index) => {
      issue.devices.map((device) => {
        issueDevices.push({ device, issueId: index });
      });
    });

    const issueDevicesList = [];
    const appDevicesList = [];

    appDevices.map((appDevice) => {
      issueDevices.map((issueDevice) => {
        if (appDevice.device.id == issueDevice.device.id) {
          issueDevicesList.push({ device: appDevice.device.deviceNameShort, issueId: issueDevice.issueId });
        }
      });
      appDevicesList.push({
        id: appDevice.device.id,
        portals: appDevice.device.portalIds,
        code: appDevice.device.appCodeManager,
        name: appDevice.device.deviceNameShort,
        status: appDevice.statusAppDevice,
        deviceId: appDevice.device.fxmId,
      });
    });

    const devicesList = [];

    appDevicesList.map((device) => {
      const myDevice = {
        id: device.id,
        deviceId: device.deviceId,
        portals: device.portals,
        name: device.name,
        code: device.code,
        status: device.status,
        issueIds: [],
      };
      issueDevicesList.map((issueDevice) => {
        if (device.name === issueDevice.device) {
          myDevice.issueIds.push(issueDevice.issueId);
        }
      });
      devicesList.push(myDevice);
    });

    setShowDevicesTable();
    setDevices(devicesList);
  };

  getIssuesActions(issue) {
    return (
      <Button
        id="actionButton"
        name="Details"
        onClick={() => {
          setShowIssueForm();
          setIssue(issue);
          this.setState({ showIssueForm: getShowIssueForm() });
        }}
      />
    );
  }

  get filteredTable() {
    const { issues, filteredIssues } = this.state;

    if (!issues) {
      return [];
    }
    let issuesToUse = filteredIssues;
    if (!issuesToUse || issuesToUse.length < 0) {
      issuesToUse = issues;
    }

    return issuesToUse.map((issue) => {
      const { issueId, name, severity, category, testedBy, isSolved, devicesNameShort } = issue;

      const isSolvedCheckbox = <Checkbox name="isSolved" isChecked={isSolved} disabled="disabled" />;
      const actions = this.getIssuesActions(issue);

      return {
        issueId,
        name,
        category,
        devicesNameShort,
        severity,
        testedBy,
        isSolvedCheckbox,
        actions,
      };
    });
  }

  setShowState = (prop) => {
    this.setState({ showIssueForm: prop });
  };

  setIssueCategories() {
    const { issues } = this.state;
    const { categories } = this.state;
    const issuesAux = issues.map((issue, index) => {
      const { devices } = issue;
      const namesAux = [];
      devices.map((device) => namesAux.push(device.deviceNameShort));
      return {
        ...issue,
        category: categories[index],
        devicesNameShort: namesAux.join(', '),
        issueId: index,
      };
    });
    this.setState({ issues: issuesAux });
  }

  setIssueCategoriesId() {
    const { issues } = this.state;
    const { categoriesId } = this.state;
    const issuesAux = issues.map((issue, index) => {
      return {
        ...issue,
        issue_category: categoriesId[index],
      };
    });
    this.setState({ issues: issuesAux });
  }

  addIssue = (prop) => {
    const { issues } = this.state;
    const issuesAux = issues;

    if (prop.id == undefined) {
      issuesAux.push(prop);
      this.setState({ issues: issuesAux });

      IssueService.addNewIssue(getAppId(), issues);
    } else {
      const index = issuesAux.findIndex((issue) => issue.id == prop.id);
      issuesAux.splice(index, 1);

      issuesAux.push(prop);
      this.setState({ issues: issuesAux });

      IssueService.addNewIssue(getAppId(), issues);
    }
  };

  issuePropertyMatches = (issue, property, inputText) => {
    if (!Object.prototype.hasOwnProperty.call(issue, property)) {
      return false;
    }
    return `${issue[property]}`.toLowerCase().includes(inputText.toLowerCase());
  };

  filterIssuesBy = (inputText) => {
    const { issues } = this.state;

    return issues.filter((issue) => {
      return !!AVAILABLE_PROPERTIES.find((property) => {
        return this.issuePropertyMatches(issue, property, inputText);
      });
    });
  };

  inputTextChange = (inputText) => {
    clearTimeout(this.filteringTO);
    this.filteringTO = setTimeout(() => {
      this.setState({ filteredIssues: this.filterIssuesBy(inputText) });
    }, 500);
  };

  downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  parseContent = () => {
    const { app, issues, showIssueForm } = this.state;

    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear().toString().substring(2);

    const dateAux = { day, month, year };

    // Data for CSV file
    const headers = [
      { label: 'App Alias', key: 'appAlias' },
      { label: 'App Name', key: 'appName' },
      { label: 'URL', key: 'appUrl' },
      { label: 'ID', key: 'issueId' },
      { label: 'Issue Name', key: 'issueName' },
      { label: 'Category', key: 'category' },
      { label: 'Description', key: 'description' },
      { label: 'Tested By', key: 'testedBy' },
      { label: 'Severity', key: 'severity' },
      { label: 'Pre-requisities', key: 'preRequisites' },
      { label: 'Steps', key: 'steps' },
      { label: 'Expected Result', key: 'expectedResult' },
      { label: 'Current Result', key: 'currentResult' },
      { label: 'Technical Feedback', key: 'technicalFeedback' },
      { label: 'Additional Information', key: 'additionalInformation' },
      { label: 'URL', key: 'issueUrl' },
      { label: 'Devices', key: 'devices' },
      { label: 'Reproducibility Rate', key: 'reproducibilityRate' },
      { label: 'Is Solved', key: 'isSolved' },
    ];

    const issuesData = issues.map((issue, index) => {
      let data = '';

      const devicesNameShort = [];
      if (issue.devices.length != 0) {
        issue.devices.map((device) => devicesNameShort.push(device.deviceNameShort));
      }

      if (index == 0) {
        data = {
          issueId: issue.issueId,
          appAlias: app.alias,
          appName: app.name,
          appUrl: app.appUrls[0].url,
          issueName: issue.name,
          category: issue.category,
          description: issue.description,
          testedBy: issue.testedBy,
          severity: issue.severity,
          preRequisites: issue.preRequisites,
          steps: issue.steps,
          expectedResult: issue.expectedResult,
          currentResult: issue.currentResult,
          technicalFeedback: issue.technicalFeedback,
          additionalInformation: issue.additionalInformation,
          issueUrl: issue.url,
          devices: issue.devicesNameShort,
          reproducibilityRate: issue.reproducibilityRate,
          isSolved: issue.isSolved,
        };
      } else {
        data = {
          issueId: issue.issueId,
          issueName: issue.name,
          category: issue.category,
          description: issue.description,
          testedBy: issue.testedBy,
          severity: issue.severity,
          preRequisites: issue.preRequisites,
          steps: issue.steps,
          expectedResult: issue.expectedResult,
          currentResult: issue.currentResult,
          technicalFeedback: issue.technicalFeedback,
          additionalInformation: issue.additionalInformation,
          issueUrl: issue.url,
          devices: issue.devicesNameShort,
          reproducibilityRate: issue.reproducibilityRate,
          isSolved: issue.isSolved,
        };
      }

      return data;
    });

    const DocName = `Foxxum_${app.name}-IssuesReport_${year}${month}${day}`;

    return (
      <div>
        <div className="search">
          <div id="header">
            <div>
              <Button
                name="Add New Issue"
                onClick={() => {
                  setShowIssueForm();
                  this.setState({ showIssueForm: getShowIssueForm() });
                }}
              />
              <SearchInput onInputTextChange={this.inputTextChange} />
            </div>
            <div id="downloadButtons">
              <Button
                name="Download PDF"
                onClick={async () => {
                  const doc = <IssuesReportPDF app={app} issues={issues} date={dateAux} />;
                  const asPdf = pdf([]);
                  asPdf.updateContainer(doc);
                  const blob = await asPdf.toBlob();
                  saveAs(blob, DocName);
                }}
              />
              <Button
                name={
                  <CSVLink data={issuesData} headers={headers} filename={DocName} target="_blank">
                    Download CSV
                  </CSVLink>
                }
              />
              <Button
                name="Download JSON"
                onClick={async () => {
                  this.downloadFile({
                    data: JSON.stringify(app),
                    fileName: `${DocName}.json`,
                    fileType: 'text/json',
                  });
                }}
              />
            </div>
          </div>
          <div id="div-table">
            <Table headersTable={this.tableHeader} dataTable={this.filteredTable} />
          </div>
        </div>
        {showIssueForm ? <IssueForm newIssue={this.addIssue} setShow={this.setShowState} /> : null}
        <DevicesTable />
      </div>
    );
  };

  render() {
    const { isIssuesReady } = this.state;
    return <div id="allIssues">{!isIssuesReady ? <SpinnerLoading /> : this.parseContent()}</div>;
  }
}
