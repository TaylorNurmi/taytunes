import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import React, { useState } from 'react';
import { Spotify } from '../../util/Spotify';

function App() {
    const [searchResults, setSearchResults] = useState([]);
    const [playlistName, setPlaylistName] = useState('My Playlist');
    const [playlistTracks, setPlaylistTracks] = useState([]);

    const addTrack = (track) => {
      if (!playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
        setPlaylistTracks([...playlistTracks, track]);
      }
    }

    const removeTrack = (track) => {
      let newPlaylistTracks = playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
      setPlaylistTracks(newPlaylistTracks);
    }

    const updatePlaylistName = (name) => {
      setPlaylistName(name);
    }

    const savePlaylist = () => {
      const trackURIs = playlistTracks.map(track => track.uri);
      Spotify.savePlaylist(playlistName, trackURIs).then(() => {
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
      });
    }

    const search = (term) => {
      Spotify.search(term).then((searchResults) => {
        setSearchResults(searchResults);
      });
    }

    return (
      <div>
        <h1>Ta<span className="highlight">yyy</span>Tunes</h1>
        <div className="App">
          <SearchBar onSearch={search} />
          <div className="App-playlist">
            <SearchResults searchResults={searchResults} onAdd={addTrack}/>
            <Playlist 
              playlistName={playlistName} 
              playlistTracks={playlistTracks} 
              onRemove={removeTrack}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist}
            />
          </div>
        </div>
      </div>
    );
}

export default App;
