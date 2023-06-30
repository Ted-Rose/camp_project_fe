import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import "./Trading.css";
import Navbar from "./Navbar";
import Nfc from "./Nfc";

const Trading = () => {
  const [player, setPlayer] = useState(null);
  const [playerData, setPlayerData] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [nfcSerialNumber, setNfcSerialNumber] = useState("asdfg456"); // State for NFC cards serial number
  const location = useLocation(); // Using location from React Router DOM to get token

  useEffect(() => {
    getNewPoints();
  }, []);

  // Function to change points for a player
  const changePoints = async (action, Value) => {
    console.log("Current serial is: ");
    console.log(nfcSerialNumber);
    const url =
      action === "add"
        ? "http://localhost:8000/add-to-players"
        : "http://localhost:8000/subtract-from-players";
    // const playerId = player[0].id;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ nfcSerialNumber, Value }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibWFuYWdlciJ9.4SY1fWD_LqSikG8NJjAWIvMQYasbZmAtU9OBZRhI5H0`,
        },
      });
      if (response.ok) {
        console.log("Points changed successfully");
        await getNewPoints();
      } else {
        console.log("Failed to change points. Status:", response.status);
      }
    } catch (error) {
      console.log("Request failed with error:", error);
    }
  };

  // Fetch newest player points
  const getNewPoints = async () => {
    // const url =
    //   "https://my-json-server.typicode.com/Ted-Rose/fake_api_No1/player";
    const url = "http://localhost:8000/players";

    // const data = {
    //   Nfc: nfcSerialNumber,
    //   Value: 10
    // };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibWFuYWdlciJ9.4SY1fWD_LqSikG8NJjAWIvMQYasbZmAtU9OBZRhI5H0`,
          // Authorization: `Bearer ${token}`,
        },
      });

      // Checking if request was successful
      if (response.ok) {
        console.log(
          `Successfully fetched player with nfcSerialNumberSerializer ${nfcSerialNumberSerialNumber}`
        );
        setAuthorized(true);
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data.players)) {
          console.log("I am array!");
          setPlayerData(data.players);
          console.log(data.players);
          const updatedPlayer = getPlayerDataBynfcSerialNumberSerializer(
            nfcSerialNumberSerialNumber,
            data.players
          );
          console.log(updatedPlayer);
          setPlayer(updatedPlayer);
        } else {
          console.log("Response data is not an array:", data);
        }
      } else {
        console.log("Failed to get player. Status:", response.status);
      }
    } catch (error) {
      console.log("Request failed with error:", error);
    }
  };

  const getPlayerDataBynfcSerialNumberSerializer = (
    nfcSerializer,
    rawPlayerData
  ) => {
    console.log("nfcSerializer:", nfcSerializer);
    if (Array.isArray(playerData)) {
      console.log("playerData: ", playerData);
      const player = rawPlayerData.find(
        (player) => player.NFCSerializer === nfcSerializer
      );
      console.log("player:", player);
      return player ? { name: player.Name, points: player.PlayerPoints } : null;
    }
    return null;
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="bg-light p-5 rounded">
          <div className="text-center">
            <Nfc
              changeSerializer={setNfcSerialNumber}
              // changeMessage={setMessage}
            />
            <h2>{player?.name}</h2>
            <h3>{player?.points} punkti</h3>
            <h3>Serial: {Nfc}</h3>

            <div className="btn-group-lg center">
              {[-10, -5, -1, 1, 5, 10].map((Value) => (
                <button
                  key={Value}
                  type="button"
                  className={`btn ${
                    Value > 0 ? "btn-outline-success" : "btn-outline-danger"
                  }`}
                  onClick={() =>
                    changePoints(
                      Value > 0 ? "add" : "subtract",
                      Math.abs(Value)
                    )
                  }
                >
                  {Value > 0 ? "+" : "-"} {Math.abs(Value)}
                </button>
              ))}
            </div>
          </div>
          {!authorized && <h2>Nepieciešams atkārtoti autorizēties!</h2>}
        </div>
      </main>
    </div>
  );
};

export default Trading;
