"use client";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO string dari API
}

export const calculateTimeLeft = (targetDate:string) => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return null;

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  

  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft>>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="text-red-600 font-bold">Waktu Habis</span>;
  }

  return (
    <span className="font-extrabold text-[var(--terracotta)] tracking-wider">
      {timeLeft.hours.toString().padStart(2, "0")}:
      {timeLeft.minutes.toString().padStart(2, "0")}:
      {timeLeft.seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default CountdownTimer;
