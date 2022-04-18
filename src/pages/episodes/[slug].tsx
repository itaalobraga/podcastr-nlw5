import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { api } from '../../services/api';
import { convertDurationTimeToString } from '../../utils/convertDurationTimeToString';

import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';

import styles from './styles.module.scss';

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    publishedAt: string;
    duration: number;
    description: string;
    durationAsString: string;
    url: string;
};

type EpisodeProps = {
    episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href={'/'}>
                    <button type="button">
                        <img src="/images/arrow-left.png" alt="Voltar" />
                    </button>
                </Link>
                <img src={episode.thumbnail} alt="" />
                <button type="button">
                    <img src="/images/arrow-right.png" alt="Tocar episódio" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params;

    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        thumbnail: data.thumbnail,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
            locale: ptBR,
        }),
        duration: Number(data.file.duration),
        description: data.description,
        durationAsString: convertDurationTimeToString(Number(data.file.duration)),
        url: data.file.url,
    };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // 24 horas
    };
};
