import { useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Wave from '@foobar404/wave';

import audios from './audios';
import Caset from './assets/img.jpg';
import CasetPlaceholder from './assets/img-placeholder.jpg';
import { ReactComponent as ChevronLeft } from './assets/chevron-left.svg';
import { ReactComponent as ChevronRight } from './assets/chevron-right.svg';
import { ReactComponent as Play } from './assets/play.svg';
import { ReactComponent as Pause } from './assets/pause.svg';

function App() {
    const songRef = useRef(null);

    const [isPaused, setIsPaused] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [barValue, setBarValue] = useState(0);

    const currentSong = audios[currentSongIndex];

    const wave = new Wave();

    useEffect(() => {
        wave.fromElement('audioElement', 'waveElement', {
            type: 'flower',
            colors: ['#000000', '#ffffff'],
        });
    }, [wave]);

    const playSong = () => {
        songRef.current.play();
        setIsPaused(true);
    };

    const pauseSong = () => {
        songRef.current.pause();
        setIsPaused(false);
    };

    const changeSong = (value) => {
        const nextSongIndex = currentSongIndex + value;

        if (nextSongIndex >= audios.length) setCurrentSongIndex(0);
        else if (nextSongIndex < 0) setCurrentSongIndex(audios.length - 1);
        else setCurrentSongIndex(nextSongIndex);

        setHasChanged(true);
        setIsPaused(true);
    };

    return (
        <div className='home'>
            <LazyLoadImage
                src={currentSong.img || Caset}
                placeholderSrc={currentSong.placeholder || CasetPlaceholder}
                effect='blur'
                width='100%'
                className={`home__img ${isPaused ? 'home__img-active' : ''}`}
            />
            <canvas id='waveElement' className='home__wave' />
            <h2 className='home__title'>{currentSong.title}</h2>
            <p className='home__artist'>{currentSong.artist}</p>
            <audio
                src={currentSong.src}
                id='audioElement'
                ref={songRef}
                autoPlay={hasChanged}
                onTimeUpdate={() => setBarValue(songRef.current.currentTime)}
                onEnded={() => changeSong(1)}
            />
            <input
                className='home__progress'
                type='range'
                name='progress'
                id='progress'
                min='0'
                max={songRef.current?.duration}
                value={barValue}
                onChange={(e) => (songRef.current.currentTime = e.target.value)}
            />

            <section className='home__controlls'>
                <ChevronLeft onClick={() => changeSong(-1)} />
                {!isPaused ? (
                    <Play onClick={playSong} />
                ) : (
                    <Pause onClick={pauseSong} />
                )}
                <ChevronRight onClick={() => changeSong(1)} />
            </section>
        </div>
    );
}

export default App;
