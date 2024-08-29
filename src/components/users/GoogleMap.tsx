import React, { useState } from "react";

const LocationInput = () => {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
        },
        () => {
          setError("Please enable location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const fetchAddress = (latitude: number, longitude: number) => {
    const apiKey = "AIzaSyBjPBFCF0bm7Xxmxn0Df483ag4x5rl11Xk";
    const url = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
         console.log(data,'data')
        if (data.status === "OK") {
          const address = data.results[0].formatted_address;
          console.log(address,'address at locaiton')
          setLocation(address);
          setError("");
        } else {
          setError("Unable to retrieve your location address.");
        }
      })
      .catch(() => {
        setError("Failed to fetch the location address.");
      });
  };

  return (
    <div>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Your current location"
      />
      <button type="button" onClick={getLocation}>
        Use Current Location
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LocationInput;
