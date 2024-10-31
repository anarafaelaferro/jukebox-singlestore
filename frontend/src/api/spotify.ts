import axios, { AxiosResponse } from "axios";
import { fetchAlbums } from "./albums";

// Spotify API credentials
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

// Function to get Spotify API token
async function getAccessToken(): Promise<string | undefined> {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const authString = btoa(`${client_id}:${client_secret}`);

    try {
        const response: AxiosResponse<{ access_token: string }> =
            await axios.post(tokenUrl, "grant_type=client_credentials", {
                headers: {
                    Authorization: `Basic ${authString}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
        return response.data.access_token;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error getting access token:", error.response?.data);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}

// Function to get album cover URLs
export async function getAlbumCoverUrls() {
    const token = await getAccessToken();
    if (!token) return;

    const allAlbums = await fetchAlbums();
    const albumIds = allAlbums?.map((album) => album.album_id).slice(100, 200); // Get the first 5 album IDs
    // const albumIds= ["4aawyAB9vmqN3uQ7FjRGTy"];

    if (!albumIds?.length) {
        return;
    }

    const albumUrl = "https://api.spotify.com/v1/albums";
    const albumPromises = albumIds.map((id) =>
        axios.get(`${albumUrl}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    );

    try {
        const responses = await Promise.all(albumPromises);
        const coverUrls = responses.map((res) => ({
            id: res.data.id,
            coverUrl: res.data.images[0].url, // Selects the first (largest) cover image
        }));
        console.log("Album Cover URLs:", coverUrls);
        return coverUrls;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching album data:", error.response?.data);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}
