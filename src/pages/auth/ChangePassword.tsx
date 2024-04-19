import React, { useState, useContext } from 'react';
import { AccountContext } from './Account';

export default () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { getSession } = useContext(AccountContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    getSession!().then(({ user }) => {
      user.changePassword(password, newPassword, (err: Error, result: any) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
        }
      });
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Current password</label>
        <input value={password} onChange={event => setPassword(event.target.value)} />

        <label>New password</label>
        <input value={newPassword} onChange={event => setNewPassword(event.target.value)} />

        <button type="submit">Change password</button>
      </form>
    </div>
  );
};
