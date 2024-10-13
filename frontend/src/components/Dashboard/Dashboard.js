import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching protected data", error);
      }
    };
    fetchProtectedData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;
