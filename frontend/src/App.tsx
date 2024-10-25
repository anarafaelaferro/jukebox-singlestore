import React from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import { AlbumProps } from "./components/Album/Album";
import { Month } from "./components/Month/Month";
import { BaseLayout } from "./layouts/BaseLayout";

import { fetchAlbums } from './api/albums';

function App() {
  const [albums, setAlbums] = React.useState<Array<AlbumProps>>([]);

  React.useEffect(() => {
    const getAlbums = async () => {
      const response = await fetchAlbums();
      if(response) {
        setAlbums(response);
      }
    };

    getAlbums();
  }, []);

  const albumsPerMonth = albums.reduce((acc, album) => {
    const month = format(new Date(album.calendar_date), "M");

    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(album);

    return acc;
  }
  , {} as Record<string, AlbumProps[]>);

  return (
    <BaseLayout>
      {Array.from({length: 12}, (_, i) => i + 1).map((month) => {
        return <Month key={month} month={month} albums={albumsPerMonth[month]} />
      })}
    </BaseLayout>
  );
}

export default App;
