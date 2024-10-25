import React from 'react';
import { format, getDaysInMonth, isSameDay } from 'date-fns';
import { Album, AlbumEmptyState, AlbumProps } from "../Album/Album";

import "./Month.scss";

type MonthProps = {
  month: string | number;
  albums?: AlbumProps[];
};

export function Month({ month: _month, albums = []}: MonthProps) {
  // padStart ensures that the month is always two digits
  const month = _month.toString().padStart(2, '0');

  const sampleDate = new Date(`2024-${month}-01`);
  const daysInMonth = getDaysInMonth(sampleDate);
  const monthName = format(sampleDate, "MMMM");

  // for each day of the month, render an Album, if it exists
  return (
    <div className="month">
      <h2>{monthName}</h2>
      <div className="month-grid">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          console.log("Month", month, day);
          const date = new Date(`2024-${month}-${day}`);
          const album = albums.find((album) => isSameDay(new Date(album?.calendar_date), date));

          return album ? <Album key={day} {...album} /> : <AlbumEmptyState key={day} calendar_date={date} />;
        })}
      </div>
    </div>
  );
}
