// AI-generated · AI-managed · AI-maintained
"use client";

import { useState, useEffect } from "react";

interface TimeRemainingProps {
  endTime: string;
  expiredText?: string;
  className?: string;
}

export function TimeRemaining({
  endTime,
  expiredText = "\u5df2\u7ed3\u675f",
  className = "",
}: TimeRemainingProps) {
  const [mounted, setMounted] = useState(false);
  const [timeText, setTimeText] = useState("--");

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeText(expiredText);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeText(`${days}\u5929 ${hours}\u5c0f\u65f6`);
      } else if (hours > 0) {
        setTimeText(`${hours}\u5c0f\u65f6 ${minutes}\u5206\u949f`);
      } else {
        setTimeText(`${minutes}\u5206\u949f`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [endTime, expiredText]);

  if (!mounted) {
    return <span className={className}>--</span>;
  }

  return <span className={className}>{timeText}</span>;
}

interface DaysRemainingProps {
  endTime: string;
  className?: string;
}

export function DaysRemaining({ endTime, className = "" }: DaysRemainingProps) {
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setDays(0);
        setHours(0);
        return;
      }

      setDays(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.ceil((diff / (1000 * 60 * 60)) % 24));
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!mounted) {
    return { days: 0, hours: 0 };
  }

  return { days, hours };
}

interface FormattedDateTimeProps {
  dateTime: string;
  locale?: string;
  className?: string;
}

export function FormattedDateTime({
  dateTime,
  locale = "zh-CN",
  className = "",
}: FormattedDateTimeProps) {
  const [mounted, setMounted] = useState(false);
  const [formatted, setFormatted] = useState("--");

  useEffect(() => {
    setMounted(true);
    const date = new Date(dateTime);
    setFormatted(date.toLocaleString(locale));
  }, [dateTime, locale]);

  if (!mounted) {
    return <span className={className}>--</span>;
  }

  return <span className={className}>{formatted}</span>;
}

interface FormattedDateProps {
  dateTime: string;
  locale?: string;
  className?: string;
}

export function FormattedDate({
  dateTime,
  locale = "zh-CN",
  className = "",
}: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);
  const [formatted, setFormatted] = useState("--");

  useEffect(() => {
    setMounted(true);
    const date = new Date(dateTime);
    setFormatted(date.toLocaleDateString(locale));
  }, [dateTime, locale]);

  if (!mounted) {
    return <span className={className}>--</span>;
  }

  return <span className={className}>{formatted}</span>;
}

interface FormattedDateCustomProps {
  dateTime: string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  className?: string;
}

export function FormattedDateCustom({
  dateTime,
  locale = "zh-CN",
  options = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' },
  className = "",
}: FormattedDateCustomProps) {
  const [mounted, setMounted] = useState(false);
  const [formatted, setFormatted] = useState("--");

  useEffect(() => {
    setMounted(true);
    const date = new Date(dateTime);
    setFormatted(date.toLocaleString(locale, options));
  }, [dateTime, locale, options]);

  if (!mounted) {
    return <span className={className}>--</span>;
  }

  return <span className={className}>{formatted}</span>;
}

interface LockDaysRemainingProps {
  endTime: string;
  className?: string;
}

export function LockDaysRemaining({ endTime, className = "" }: LockDaysRemainingProps) {
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(0);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setDays(0);
        return;
      }

      setDays(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!mounted) {
    return <span className={className}>--</span>;
  }

  return <span className={className}>{days} days</span>;
}

interface LockDaysHoursRemainingProps {
  endTime: string;
  className?: string;
}

export function LockDaysHoursRemaining({ endTime, className = "" }: LockDaysHoursRemainingProps) {
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setDays(0);
        setHours(0);
        return;
      }

      setDays(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.ceil((diff / (1000 * 60 * 60)) % 24));
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!mounted) {
    return <span className={className}>--</span>;
  }

  return <span className={className}>{days} \u5929 {hours} \u5c0f\u65f6</span>;
}

interface LockProgressProps {
  endTime: string;
  totalDays?: number;
}

export function useLockProgressValue(endTime: string, totalDays: number = 14) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setProgress(100);
        return;
      }

      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const progressPct = Math.max(0, Math.min(100, ((totalDays - days) / totalDays) * 100));
      setProgress(progressPct);
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [endTime, totalDays]);

  return { progress, mounted };
}

export function useLockProgress(endTime: string, totalDays: number = 14) {
  const [mounted, setMounted] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setDaysRemaining(0);
        setHoursRemaining(0);
        setProgress(100);
        return;
      }

      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const hours = Math.ceil((diff / (1000 * 60 * 60)) % 24);
      const progressPct = Math.max(0, Math.min(100, ((totalDays - days) / totalDays) * 100));

      setDaysRemaining(days);
      setHoursRemaining(hours);
      setProgress(progressPct);
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [endTime, totalDays]);

  if (!mounted) {
    return { daysRemaining: 0, hoursRemaining: 0, progress: 0, mounted: false };
  }

  return { daysRemaining, hoursRemaining, progress, mounted: true };
}
