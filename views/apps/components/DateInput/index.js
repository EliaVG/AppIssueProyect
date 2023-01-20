import React, { Component } from 'react';

class DateInput extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (e) => {
    const { onChangeOption } = this.props;
    onChangeOption(e);
  };

  render() {
    const { defaultValue } = this.props;

    return <input type="date" id="date" onInput={this.handleChange} value={defaultValue} />;
  }
}

export default DateInput;
