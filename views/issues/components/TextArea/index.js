import React from 'react';
import './style.scss';

const TextArea = (props) => {
  const { onInputTextChange, title, value } = props;

  const handleChange = (e) => {
    if (
      (typeof onInputTextChange === 'function' && e.target.value) ||
      (typeof onInputTextChange === 'function' && !e.target.value)
    ) {
      onInputTextChange(e.target.value);
    }
  };

  return (
    <div className="textArea">
      <label> {title} </label>
      <textarea type="text" value={value} onChange={handleChange} />
    </div>
  );
};

export default TextArea;
