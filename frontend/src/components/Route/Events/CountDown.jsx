import React, { useEffect, useState } from "react";

const CountDown = ({ data }) => {
  const currentDate = new Date();
  const startDate = new Date(data.start_Date);
  const endDate = new Date(data.finish_Date);
  const roundStarted = currentDate > startDate;
  const roundEnded = currentDate > endDate;

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const difference = +new Date(data?.finish_Date) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }
    return (
      <span className="text-[25px] text-[#475ad2]">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {roundEnded ? (
        <span className="text-[red] text-[25px]"> Round Over!</span>
      ) : roundStarted ? (
        timerComponents
      ) : (
        <span className="text-[blue] text-[25px]">
          Round will begin {data.start_Date.slice(0, 10)}
        </span>
      )}
    </div>
  );
};

export default CountDown;
