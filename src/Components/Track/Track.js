import React, { useState, useEffect } from 'react';
import './Track.css';
import Spotify from '../../util/Spotify';

export const Track = (props) => {

    const playTrack = (trackId) => {
        console.log('Track ID:', trackId, props.track);
        const trackUri = `spotify:track:${trackId}`;
        Spotify.play(trackUri)
        .then(() => console.log(`Playing track ${trackUri}`))
        .catch((error) => console.log(error.message));
    }

  const addTrack = () => {
    props.onAdd(props.track);
  };

  const removeTrack = () => {
    props.onRemove(props.track);
  };

  let renderAction;
  if (props.isRemoval) {
    renderAction = <button className="Track-action" onClick={removeTrack}>-</button>;
  } else {
    renderAction = <button className="Track-action" onClick={addTrack}>+</button>;
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{props.track.name}</h3>
        <p>{props.track.artist} | {props.track.album}</p>
      </div>
      <button className="Track-play" onClick={() => playTrack(props.track.id)}>Play on Spotify</button>
      {renderAction}
    </div>
  );
};
