import React from 'react';
import { format } from 'date-fns';

import "./Album.scss";

export type AlbumProps = {
  calendar_date: string | Date;
  album_id: number;
  album_name: string;
  artist_name: string;
  album_link: string;
  recommender_name: string;
};

export function Album(album: AlbumProps) {
  return (
    <a className="album" href={album.album_link} target="_blank" rel="noreferrer">
      <p className="details">
        <span className="date">
          {format(new Date(album.calendar_date), "dd")}
        </span>
        {album.album_name}, {album.artist_name}
      </p>
      <span className="recommender">
        from {album.recommender_name}
      </span>
    </a>
  );
}

type AlbumEmptyStateProps = Pick<AlbumProps, "calendar_date">;

export function AlbumEmptyState({ calendar_date }: AlbumEmptyStateProps) {
  console.log("AlbumEmptyState", calendar_date);
  return (
    <div className="album">
      <p className="details">
        <span className="date">
          {format(new Date(calendar_date), "dd")}
        </span>
      </p>
    </div>
  );
}
