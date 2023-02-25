import React from 'react';
import { Track } from '../Track/Track.js'
import './TrackList.css'

export const TrackList = (props) => {
    return (
        <div className="TrackList">
            {props.tracks.map(track => 
            <Track 
            key={track.id} 
            track={track} 
            onAdd={props.onAdd} 
            trackId={track.id}
            onRemove={props.onRemove} 
            isRemoval={props.isRemoval} 
            />)}
        </div>
    );
    }