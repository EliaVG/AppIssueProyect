import React, { Component } from 'react';
import Select from 'react-select';
import './style.scss';

class MultiSelect extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (e) => {
    const { onChangeOption } = this.props;
    onChangeOption(e);
  };

  render() {
    const { label, optionsList, option } = this.props;

    return (
      <div id="multiSelect-component">
        <label> {label} </label>
        <Select
          id="multiSelect"
          closeMenuOnSelect={false}
          isMulti
          defaultValue={option}
          onChange={this.handleChange}
          className="basic-multi-select"
          classNamePrefix="select"
          options={optionsList}
        />
      </div>
    );
  }
}

export default MultiSelect;
