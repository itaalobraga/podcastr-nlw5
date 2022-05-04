import { useEffect, useRef } from "react";
import { usePlayer } from "../../contexts/PlayerContext";

import styles from "./styles.module.scss";
import "rc-slider/assets/index.css";

import Slider from "rc-slider";

export function Player() {
    const {
        episodeList,
        isPlaying,
        currentEpisodeIndex,
        tooglePlay,
        setPlayingState,
        playPrevious,
        playNext,
        hasPrevious,
        hasNext,
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/images/Headphone.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <img src={episode.thumbnail} alt="" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={episode ? "" : styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    {episode ? (
                        <Slider
                            trackStyle={{ backgroundColor: "#04d361" }}
                            railStyle={{ backgroundColor: "#9f75ff" }}
                            handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                        />
                    ) : (
                        <div className={styles.emptySlider} />
                    )}
                    <span>00:00</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        autoPlay
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/images/player-icons/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasPrevious}
                        onClick={playPrevious}
                    >
                        <img
                            src="/images/player-icons/play-previous.svg"
                            alt="Tocar anterior"
                        />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={tooglePlay}
                    >
                        <img
                            src={
                                isPlaying
                                    ? "/images/player-icons/pause.svg"
                                    : "/images/player-icons/play.svg"
                            }
                            alt="Tocar"
                        />
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasNext}
                        onClick={playNext}
                    >
                        <img
                            src="/images/player-icons/play-next.svg"
                            alt="Tocar próxima"
                        />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/images/player-icons/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
