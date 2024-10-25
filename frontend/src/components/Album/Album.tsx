import React from 'react';
import { format } from 'date-fns';

import "./Album.scss";

// TODO: Merge with api/albums.ts
export type AlbumProps = {
  calendar_date: string | Date;
  album_id: number;
  album_name: string;
  artist_name: string;
  album_link: string;
  recommender_name: string;
  cover_image_url?: string;
};

export function Album(album: AlbumProps) {
  return (
    <a className="album" href={album.album_link} target="_blank" rel="noreferrer">
      <img src={album.cover_image_url} alt={album.album_name} />
      <span className="date">
        {format(new Date(album.calendar_date), "d")}
      </span>
      <div className="details">
          <p>
            <b>{album.album_name}</b><br/>
            <span className="artist">
              {album.artist_name}
            </span>
          </p>
          <span className="recommender">
            from {album.recommender_name}
          </span>
      </div>
    </a>
  );
}

export function AlbumEmptyState() {
  return (
    <div className="album-empty-state" />
  );
}
