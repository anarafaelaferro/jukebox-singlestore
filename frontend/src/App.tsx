import React from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import { AlbumProps } from "./components/Album/Album";
import { Month } from "./components/Month/Month";

function App() {
  const [albums, setAlbums] = React.useState<Array<AlbumProps>>([]);

  React.useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get<Array<AlbumProps>>('/api/albums');
        setAlbums(response.data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  const albumsPerMonth = albums.reduce((acc, album) => {
    console.log("albums per month");
    const month = format(new Date(album.calendar_date), "M");
    console.log(month, album.album_name);

    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(album);

    return acc;
  }
  , {} as Record<string, AlbumProps[]>);

  return (
    <div>
      {Array.from({length: 12}, (_, i) => i + 1).map((month) => {
          return <Month key={month} month={month.toString()} albums={albumsPerMonth[month]} />
      })}
    </div>
  );
}

export default App;
