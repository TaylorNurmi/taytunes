const clientId = "71bc965420084e3f9da0d10b04cb8138";
const redirectUri = "http://TayTunes.surge.sh";
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-email",
    "user-read-private",
];

let playPause = 0;
let accessToken = "";

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
            const accessUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token`;
            window.location = accessUrl;
        }
    },


    play(trackUri) {
        console.log('Track URI:', trackUri);
        const accessToken = Spotify.getAccessToken();
        if (playPause === 0) {
            return fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [trackUri] }),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (response.status === 204) {
                    console.log(`Playing track ${trackUri}`);
                    playPause = 1;
                } 
                else {
                    alert("Please login to Spotify in a separate window or tab. You must have Spotify Premium and have your device active to use the play feature!")
                    console.log('Error: unable to play track.');
                }
            })
            .catch((error) => console.log(error.message));
        }
        else {
            fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            playPause = 0;
        }
    },



    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            }));
        });
    },

    async getUserID() {
        const accessToken = this.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        const response = await fetch('https://api.spotify.com/v1/me', { headers });
        const jsonResponse = await response.json();

        return jsonResponse.id;
    },

    async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        const response = await fetch("https://api.spotify.com/v1/me", { headers: headers });
        const jsonResponse = await response.json();
        userId = jsonResponse.id;

        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ name: name }),
        });
        const playlistJson = await playlistResponse.json();
        const playlistId = playlistJson.id;

        const addTracksResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ uris: trackUris }),
        });
        const addTracksJson = await addTracksResponse.json();
        const snapshotId = addTracksJson.snapshot_id;

        return snapshotId;
    },
};

export default Spotify;
