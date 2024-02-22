import React, { useEffect, useState } from "react";

const CountDown = ({ data }) => {
  const currentDate = new Date();
  const startDate = new Date(data.start_Date);
  const endDate = new Date(data.finish_Date);
  const roundStarted = currentDate > startDate;
  const roundEnded = currentDate > endDate;

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [timeBefore, setTimeBefore] = useState(calculateTimeBefore());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
      setTimeBefore(calculateTimeBefore());
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
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

  function calculateTimeBefore() {
    const difference = +new Date(data?.start_Date) - +new Date();
    let timeBefore = {};
    if (difference > 0) {
      timeBefore = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeBefore;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }
    return (
      <span className="text-[25px] text-[#88d441]">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  const beforeTimer = Object.keys(timeBefore).map((interval) => {
    if (!timeBefore[interval]) {
      return null;
    }
    return (
      <span className="text-[25px] text-[#4441d4]">
        {timeBefore[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {roundEnded ? (
        <span className="text-[red] text-[25px]"> Round Over!</span>
      ) : roundStarted ? (
        <span className="text-[25px] text-[#88d441]">
          Round Active: {timerComponents}
        </span>
      ) : (
        <span className="text-[25px] text-[#4441d4]">
          Round Starting: {beforeTimer}
        </span>
      )}
    </div>
  );
};

export default CountDown;
