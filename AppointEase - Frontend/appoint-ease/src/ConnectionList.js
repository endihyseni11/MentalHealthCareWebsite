import React from 'react';

const staticUsers = [
  { id: 1, name: 'User 1', bio: 'Bio për user 1' },
  { id: 2, name: 'User 2', bio: 'Bio për user 2' },
  { id: 3, name: 'User 3', bio: 'Bio për user 3' },
  // Shto përdorues shtesë sipas nevojës
];

const UserList = () => {
  return (
    <div className="container">
      <h2>Lista e Shokëve</h2>
      <div className="row">
        {staticUsers.map(user => (
          <div key={user.id} className="col-md-3 w-100">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
