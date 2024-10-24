import React from 'react';
import axios from 'axios';

// Set the default base URL for all Axios requests
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [albums, setAlbums] = React.useState([]);

  React.useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('/api/albums');
        setAlbums(response.data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div>
      <h1>Album List</h1>
      <ul>
        {albums.map(album => (
          <li key={album.album_id}>{album.album_name}, {album.artist_name}</li>  // Adjust according to your data structure
        ))}
      </ul>
    </div>
  );
}

export default App;
