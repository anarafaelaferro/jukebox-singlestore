import axios from 'axios';

export type AlbumProps = {
  calendar_date: string | Date;
  album_id: number;
  album_name: string;
  artist_name: string;
  album_link: string;
  recommender_name: string;
};

export const fetchAlbums = async () => {
  try {
    const response = await axios.get<Array<AlbumProps>>('/api/albums');
    return response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
};
