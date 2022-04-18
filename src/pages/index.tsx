import { GetStaticProps } from 'next';
import Link from 'next/link'

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns';
import { api } from '../services/api';
import { convertDurationTimeToString } from '../utils/convertDurationTimeToString';

import styles from './styles.module.scss';

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    url: string;
};

type HomeProps = {
    lastestEpisodes: Episode[];
    allEpisodes: Episode[];
};

export default function Home({ lastestEpisodes, allEpisodes }: HomeProps) {
    return (
        <div className={styles.homePage}>
            <section className={styles.lastestEpisodes}>
                <h2>Últimos lançamentos</h2>
                <ul>
                    {lastestEpisodes.map((episode) => (
                        <li key={episode.id}>
                            <img src={episode.thumbnail} alt={episode.title} />
                            <div className={styles.episodeDetails}>
                                <Link href={`/episodes/${episode.id}`}>
                                    <a>{episode.title}</a>
                                </Link>
                                <p>{episode.members}</p>
                                <span>{episode.publishedAt}</span>
                                <span>{episode.durationAsString}</span>
                            </div>

                            <button type="button">
                                <img src="/images/play_arrow.png" alt="Tocar" />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={styles.allEpisodes}>
                <h2>Todos os episódios</h2>
                <table>
                    <thead>
                        <tr>
                            <th>PODCAST</th>
                            <th>INTEGRANTES</th>
                            <th>DATA</th>
                            <th>DURAÇÃO</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allEpisodes.map((episode) => (
                            <tr key={episode.id}>
                                <td>
                                    <img src={episode.thumbnail} alt="" />
                                    <Link href={`/episodes/${episode.id}`}>
                                        <a>{episode.title}</a>
                                    </Link>
                                </td>
                                <td>{episode.members}</td>
                                <td style={{ width: '100px' }}>{episode.publishedAt}</td>
                                <td>{episode.durationAsString}</td>
                                <td>
                                    <button type="button">
                                        <img src="/images/play_arrow.png" alt="Tocar" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc',
        },
    });

    const episodes = data.map((episode) => {
        return {
            id: episode.id,
            title: episode.title,
            members: episode.members,
            thumbnail: episode.thumbnail,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
                locale: ptBR,
            }),
            duration: Number(episode.file.duration),
            durationAsString: convertDurationTimeToString(Number(episode.file.duration)),
            url: episode.file.url,
        };
    });

    return {
        props: {
            lastestEpisodes: episodes.slice(0, 2),
            allEpisodes: episodes.slice(2, episodes.length),
        },
        revalidate: 60 * 60 * 8,
    };
};
