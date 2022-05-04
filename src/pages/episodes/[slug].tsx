import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { api } from "../../services/api";
import { convertDurationTimeToString } from "../../utils/convertDurationTimeToString";

import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";

import styles from "./styles.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";

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
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <button type="button">
                    <Link href={"/"} passHref>
                        <a>
                            <Image
                                src="/images/arrow-left.png"
                                alt="Voltar"
                                width={40}
                                height={40}
                            />
                        </a>
                    </Link>
                </button>
                <div>
                    <Image
                        src={episode.thumbnail}
                        alt="Thumbnail do Episódio"
                        layout="fill"
                        objectFit="cover"
                        style={{ borderRadius: "1rem" }}
                    />
                </div>
                <button type="button" onClick={() => play(episode)}>
                    <Image
                        src="/images/arrow-right.png"
                        alt="Tocar"
                        width={24}
                        height={24}
                    />
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
    const { data } = await api("episodes", {
        params: {
            _limit: 2,
            _sort: "published_at",
            _order: "desc",
        },
    });

    const paths = data.map((episode) => {
        return {
            params: {
                slug: episode.id,
            },
        };
    });

    return {
        paths,
        fallback: "blocking",
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
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {
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
