import React, { Component } from 'react';
import './style.scss';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import Select from '../../../../../components/Select';
import IssueService from '../../../../../services/issue.service';
import { getAppId, getDevices } from '../../../apps/components/helpers/variables';
import { getShowIssueForm, setShowIssueForm, setIssue, getIssue } from '../helpers/variables';
import TextArea from '../TextArea';
import MultiSelect from '../../../apps/components/MultiSelect';

export default class IssueForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      testedBy: '',
      severity: 'Low',
      preRequisites: [],
      steps: [],
      expectedResult: '',
      currentResult: '',
      reproducibilityRate: '1',
      technicalFeedback: '',
      additionalInformation: '',
      url: '',
      issue_category: '1',
      isSolved: false,
      categoryAux: 'Player',

      issueCategoriesList: this.getIssueCategories(),

      devices: [],
      devicesReady: false,
    };
  }

  componentDidMount() {
    const issue = getIssue();

    if (issue != '') {
      this.setState({
        name: issue.name,
        description: issue.description,
        testedBy: issue.testedBy,
        severity: issue.severity,
        preRequisites: issue.preRequisites,
        steps: issue.steps,
        expectedResult: issue.expectedResult,
        currentResult: issue.currentResult,
        reproducibilityRate: issue.reproducibilityRate,
        technicalFeedback: issue.technicalFeedback,
        additionalInformation: issue.additionalInformation,
        url: issue.url,
        isSolved: issue.isSolved,
        id: issue.id,
        issue_category: issue.issue_category,
        categoryAux: issue.category,
        devices: issue.devices,
        devicesReady: true,
      });
    }
  }

  getIssueCategories() {
    const categories = [];
    IssueService.getIssueCategories()
      .then((response) => {
        response.data.data.map((value) => categories.push(value.name));
        this.setState({ issueCategoriesList: categories });
      })
      .catch((error) => {
        console.error(error);
      });

    return categories;
  }

  onSubmit = (e) => {
    const {
      name,
      description,
      testedBy,
      severity,
      preRequisites,
      steps,
      expectedResult,
      currentResult,
      reproducibilityRate,
      technicalFeedback,
      additionalInformation,
      url,
      // eslint-disable-next-line camelcase
      issue_category,
      isSolved,
      id,
      devices,
    } = this.state;

    e.preventDefault();

    const issue = {
      name,
      description,
      testedBy,
      severity,
      preRequisites,
      steps,
      expectedResult,
      currentResult,
      reproducibilityRate,
      technicalFeedback,
      additionalInformation,
      url,
      issue_category,
      isSolved,
      id,
      devices,
    };

    // console.log('Enviado -> ', issue);

    // eslint-disable-next-line react/destructuring-assignment
    this.props.newIssue(issue);

    window.location.href = `/dashboardpc/management/apps/${getAppId()}`;
    setShowIssueForm();
  };

  close = () => {
    const modal = document.getElementById('issueForm');
    modal.style.display = 'none';

    setShowIssueForm();
    // eslint-disable-next-line react/destructuring-assignment
    this.props.setShow(getShowIssueForm());
    setIssue('');
  };

  handleInputChange = (value, field) => {
    this.setState({
      [field]: value,
    });

    if (field == 'preRequisites' || field == 'steps') {
      const valueItem = value.split(', ');
      this.setState({ [field]: valueItem });
    }

    // console.log(fieldState, ' => ', value);
  };

  onLiftState = (state) => {
    const { name, isChecked } = state;
    this.setState({ [name]: isChecked });

    // console.log(name, ' => ', isChecked);
  };

  onChangeInput = (value, field) => {
    this.setState({ [field]: value });

    if (field == 'categoryAux') {
      if (value == 'Player') this.setState({ issue_category: '1' });
      else if (value == 'Navigation') this.setState({ issue_category: '2' });
      else if (value == 'Requests-Responses') this.setState({ issue_category: '3' });
      else if (value == 'Back-Button') this.setState({ issue_category: '4' });
      else if (value == 'Resolution') this.setState({ issue_category: '5' });
      else this.setState({ issue_category: '6' });
    }
  };

  formatDevicesInput() {
    const devicesAux = getDevices();
    const devicesInput = [];

    devicesAux.map((device) => {
      devicesInput.push({ value: device.id, label: `${device.appCodeManager} - ${device.portalIds}` });
    });

    return devicesInput;
  }

  devicesOptions(list) {
    const options = [];
    const { devices } = this.state;

    list.map((item) => {
      devices.map((device) => {
        if (item.value == device.id) options.push(item);
      });
    });

    return options;
  }

  render() {
    const {
      name,
      description,
      testedBy,
      severity,
      preRequisites,
      steps,
      expectedResult,
      currentResult,
      reproducibilityRate,
      technicalFeedback,
      additionalInformation,
      url,
      categoryAux,
      isSolved,
      devices,
      issueCategoriesList,
      devicesReady,
    } = this.state;

    const optionsList = this.formatDevicesInput();

    return (
      <form className="issueForm" onSubmit={this.onSubmit} id="issueForm">
        <div className="content">
          <button type="button" className="btn-close" aria-label="Close" onClick={this.close} />
          <div className="secTitle">New Issue</div>
          <div className="inputs">
            <Input
              title="Name"
              value={name}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'name');
              }}
            />
            <TextArea
              title="Description"
              value={description}
              inputStyle="3"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'description');
              }}
            />
            <Input
              title="Tested By"
              value={testedBy}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'testedBy');
              }}
            />
            <Select
              label="Severity:"
              option={severity}
              optionsList={['Low', 'Mid', 'High', 'Blocked']}
              onChangeOption={(e) => {
                this.onChangeInput(e, 'severity');
              }}
            />
            <Input
              title="Prerequisites"
              value={preRequisites.join(', ')}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'preRequisites');
              }}
            />
            <TextArea
              title="Steps"
              value={steps.join(', ')}
              inputStyle="3"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'steps');
              }}
            />
            <Input
              title="Expected Result"
              value={expectedResult}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'expectedResult');
              }}
            />
            <Input
              title="Current Result"
              value={currentResult}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'currentResult');
              }}
            />
            <Select
              label="Reproducibility Rate:"
              option={reproducibilityRate}
              optionsList={['1', '2', '3', '4', '5']}
              onChangeOption={(e) => {
                this.onChangeInput(e, 'reproducibilityRate');
              }}
            />
            <TextArea
              title="Technical Feedback"
              value={technicalFeedback}
              inputStyle="3"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'technicalFeedback');
              }}
            />
            <Input
              title="Additional Information"
              value={additionalInformation}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'additionalInformation');
              }}
            />
            <Input
              title="URL"
              value={url}
              inputStyle="2"
              onInputTextChange={(value) => {
                this.handleInputChange(value, 'url');
              }}
            />
            <Select
              label="Issue Category:"
              option={categoryAux}
              optionsList={issueCategoriesList}
              onChangeOption={(e) => {
                this.onChangeInput(e, 'categoryAux');
              }}
            />
            {devicesReady && (
              <MultiSelect
                label="Devices:"
                option={this.devicesOptions(optionsList)}
                optionsList={optionsList}
                onChangeOption={(e) => {
                  const values = devices;
                  e.map((item) => {
                    values.push(item.value);
                  });
                  this.setState({ devices: values });
                }}
              />
            )}
            {!devicesReady && (
              <MultiSelect
                label="Devices:"
                option={devices}
                optionsList={optionsList}
                onChangeOption={(e) => {
                  const values = devices;
                  e.map((item) => {
                    values.push(item.value);
                  });
                  this.setState({ devices: values });
                }}
              />
            )}

            <div>
              <Checkbox name="isSolved" liftState={this.onLiftState} isChecked={isSolved} /> Is Solved
            </div>
          </div>
          <Button name={getIssue() == '' ? 'Add New Issue' : 'Edit Issue'} type="submit" className="submitButton">
            <input type="submit" />
          </Button>
        </div>
      </form>
    );
  }
}
