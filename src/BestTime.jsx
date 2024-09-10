import React from "react";

export default function BestTime(props) {
  let totalBestTime = Number(localStorage.getItem("besttime")) || 0;
  let currentTimeSeconds = props.time[0];
  let currentTimeMinutes = props.time[1];
  let totalCurrentTimeSeconds = currentTimeSeconds + currentTimeMinutes * 60;
  let bestTimeMessage =
    totalBestTime != 0
      ? `${totalBestTime} seconds`
      : "Play to set a new best time";

  if (
    totalCurrentTimeSeconds >= 1 &&
    (totalCurrentTimeSeconds < totalBestTime || totalBestTime == 0)
  ) {
    localStorage.setItem("besttime", totalCurrentTimeSeconds);
  }

  return <div>Best Time: {bestTimeMessage}</div>;
}
