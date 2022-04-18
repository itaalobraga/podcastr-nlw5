import styles from './styles.module.scss'

export function Player() {
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/images/Headphone.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>
            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir</strong>
            </div>
            <footer className={styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.emptySlider} />
                    <span>00:00</span>
                </div>
                <div className={styles.buttons}>
                    <button type="button">
                        <img src="/images/player-icons/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button">
                        <img src="/images/player-icons/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button" className={styles.playButton}>
                        <img src="/images/player-icons/play.svg" alt="Tocar" />
                    </button>
                    <button type="button">
                        <img src="/images/player-icons/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button">
                        <img src="/images/player-icons/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}