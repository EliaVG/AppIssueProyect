import React, { Component } from 'react';
import SpinnerLoading from '../../../../../components/SpinnerLoading';
import SearchInput from '../../../../../components/SearchInput';
import './style.scss';
import { setShowDevicesTable, getDevices } from '../helpers/variables';
import Select from '../../../../../components/Select';
import { getAppId } from '../../../apps/components/helpers/variables';
import AppService from '../../../../../services/app.service';

const AVAILABLE_PROPERTIES = ['portals', 'name', 'ids', 'status'];

export default class DevicesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: getDevices(),
    };
  }

  get filteredTable() {
    const { devices, filteredDevices } = this.state;

    if (!devices) {
      return [];
    }
    let devicesToUse = filteredDevices;
    if (!devicesToUse || devicesToUse.length < 0) {
      devicesToUse = devices;
    }

    return devicesToUse.map((myDevice) => {
      const { portals, name, issueIds, status } = myDevice;

      let ids = '';
      if (issueIds.length > 0) {
        ids = issueIds.join(', ');
      }

      let portalsAux = '';
      if (portals.length > 0) {
        portalsAux = portals.join(', ');
      }

      return (
        <tr id="device">
          <td id="portals">{portalsAux}</td>
          <td>{name}</td>
          <td>{ids}</td>
          <Select
            id="select"
            label="Status:"
            option={status}
            optionsList={['Testing', 'Launched', 'Discarded']}
            onChangeOption={(e) => {
              const devicesList = devices;
              devicesList.map((device, index) => {
                if (device.id === myDevice.id) {
                  devicesList.splice(index, 1);
                  devicesList.push({
                    deviceId: myDevice.deviceId,
                    code: myDevice.code,
                    id: myDevice.id,
                    issueIds: myDevice.issueIds,
                    name: myDevice.name,
                    portals: myDevice.portals,
                    status: e,
                  });
                }
              });
              this.setState({ devices: devicesList });
              const devicesToSave = [];
              devices.map((deviceAux) => {
                const device = { id: deviceAux.id };
                devicesToSave.push({ deviceId: deviceAux.deviceId, device, statusAppDevice: deviceAux.status });
              });
              const app = {
                devicesInfo: devicesToSave,
              };
              AppService.updateApp(getAppId(), app)
                .then(() => {})
                .catch((error) => {
                  console.error(error);
                });
            }}
          />
        </tr>
      );
    });
  }

  devicePropertyMatches = (device, property, inputText) => {
    if (!Object.prototype.hasOwnProperty.call(device, property)) {
      return false;
    }
    return `${device[property]}`.toLowerCase().includes(inputText.toLowerCase());
  };

  filterDevicesBy = (inputText) => {
    const { devices } = this.state;

    return devices.filter((device) => {
      return !!AVAILABLE_PROPERTIES.find((property) => {
        return this.devicePropertyMatches(device, property, inputText);
      });
    });
  };

  inputTextChange = (inputText) => {
    clearTimeout(this.filteringTO);
    this.filteringTO = setTimeout(() => {
      this.setState({ filteredDevices: this.filterDevicesBy(inputText) });
    }, 500);
  };

  parseContent = () => {
    return (
      <div>
        <div className="container">
          <div id="header">
            <div>
              <SearchInput onInputTextChange={this.inputTextChange} />
            </div>
          </div>
          <table id="devicesTable">
            <tr id="headers">
              <th>Portal IDs</th>
              <th>Device</th>
              <th>Issues</th>
              <th>Status</th>
            </tr>
            {this.filteredTable}
          </table>
        </div>
      </div>
    );
  };

  render() {
    return <div id="allDevices">{!setShowDevicesTable ? <SpinnerLoading /> : this.parseContent()}</div>;
  }
}
