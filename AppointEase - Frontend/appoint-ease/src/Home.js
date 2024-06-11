// Home.js

import React, { useEffect, useState } from 'react';

const Home = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch or load necessary data upon component mount
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  return (
    <div>
      <h2>Welcome Home!</h2>
      {userData && (
        <div>
          <p>User Role: {userData.userRole}</p>
          <p>User ID: {userData.userId}</p>
          {/* Display other user-related information */}
        </div>
      )}
    </div>
  );
};

export default Home;
