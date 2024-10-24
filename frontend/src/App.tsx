import React from 'react';
import axios from 'axios';

import { Album, AlbumProps } from "./components/Album/Album";

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

  return (
    <div>
      {albums.map(album => (
        <Album key={album.album_id} {...album}/>
      ))}
    </div>
  );
}

export default App;
