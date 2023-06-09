import React, { useContext, useState, useEffect } from "react";
// import React, {useState} from "react";

import { TokenContext } from "./TokenContext";
import Navbar from "./Navbar";
import PointsControl from "./PointsControl";
import { useLocation } from "react-router-dom";
import "./TeamPoints.css";

const TeamPoints = (props) => {
  const [teams, setTeams] = useState([]); // State for team data
  const [selectedTID, setSelectedTeamId] = useState(1); // State for selected team ID
  const [authorized, setAuthorized] = useState(false); // State for authorization status
  const location = useLocation(); // Using location from React Router DOM to get token
  // const token = location.state?.token; // Extracting token from location state
  // const { token } = useContext(TokenContext); // Access the token value from the context

  // useEffect hook to fetch teams data on component mount
  useEffect(() => {
    GetNewPoints();
  }, []);
  
  console.log("Token: ", props.token)
  // Function to change points of a team
  const changePoints = async (action, value) => {
    const url =
      action === "add"
        ? "http://localhost:8000/add"
        : "http://localhost:8000/subtract";

    const data = {
      ID: selectedTID,
      Value: value,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify(data),
      });

      // Checking if request was successful
      if (response.ok) {
        console.log(
          `Data changed successfully for team with TID ${selectedTID}`
        );
      } else {
        console.log("Failed to change data. Status:", response.status);
      }
    } catch (error) {
      console.log("Request failed with error:", error);
    }
    // Fetching new team data to update UI
    GetNewPoints(props.token);
  };

  // Function to fetch new team data from API
  const GetNewPoints = async () => {
    const url = "http://localhost:8000/teams";

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      if (response.ok) {
        setAuthorized(true);
        const data = await response.json();
        if (Array.isArray(data.teams)) {
          setTeams(data.teams);
        } else {
          console.log("Response data is not an array:", data);
        }
      } else {
        console.log("Request failed with status:", response.status);
        if (response.status === 401) {
          setAuthorized(false);
        }
      }
    } catch (error) {
      console.log("Request failed with error:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="bg-light p-5 rounded">
          <div className="text-center">
            <p className="lead">Pievieno vai noņem punktus komandai</p>
            <div className="btn-group-lg center lg-1">
              {[-10, -5, -1, +1, +5, +10].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm btn-outline-secondary ms-5 ${
                    value > 0 ? "btn-outline-success" : "btn-outline-danger"
                  }`}
                  onClick={() =>
                    changePoints(
                      value > 0 ? "add" : "subtract",
                      Math.abs(value)
                    )
                  }
                >
                  {value > 0 ? "+" : "-"} {Math.abs(value)}
                </button>
              ))}
            </div>
          </div>
          {!authorized && <h2>Nepieciešams atkārtoti autorizēties!</h2>}

          {teams.map(({ ID, TID, Name, Value }) => (
            <PointsControl
              key={ID}
              ID={ID}
              TID={TID}
              count={Value}
              teamName={Name}
              changeUpdatedCheckedState={setSelectedTeamId}
              selectedState={selectedTID === ID ? "selected" : "unselected"}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeamPoints;