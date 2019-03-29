import React, { useState } from 'react';
import PropTypes from 'prop-types';

const UsernameForm = ({ onSubmit }) => {
  const [name, setName] = useState(null);

  return (
    <form
      onSubmit={() => {
        onSubmit(name);
      }}
    >
      <input
        placeholder="Name"
        value={name}
        onChange={({ target }) => {
          setName(target.value);
        }}
        required
      />
      <button
      >
        Wyślij
      </button>
    </form>
  );
}

UsernameForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default UsernameForm;
