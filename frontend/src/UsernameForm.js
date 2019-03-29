import React, { useState } from 'react';
import PropTypes from 'prop-types';

const UsernameForm = ({ onSubmit }) => {
  const [name, setName] = useState(null);

  return (
    <div>
      <input
        placeholder="Name"
        value={name}
        onChange={({ target }) => {
          setName(target.value);
        }}
      />
      <button
        onClick={() => {
          if (name) {
            onSubmit(name);
          }
        }}
      >
        Wyślij
      </button>
    </div>
  );
}

UsernameForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default UsernameForm;
