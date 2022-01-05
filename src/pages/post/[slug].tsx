import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDate } from '../../utils';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

type calculatePostReadingTimeParams = {
  heading: string;
  body: {
    text: string;
  }[];
}[];

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  const calculatePostReadingTime = (
    postContent: calculatePostReadingTimeParams,
  ): number => {
    const amountWordsInPost = postContent.reduce(
      (sumPostTime, postContentItem) => {
        const postBodyString = RichText.asText(postContentItem.body);
        const splitedHeading = postContentItem.heading.split(' ');

        const splitedBody = postBodyString.split(' ');

        const totalWords = splitedHeading.length + splitedBody.length;

        return sumPostTime + totalWords;
      },
      0,
    );

    const postTime = Math.ceil(amountWordsInPost / 200);

    return postTime;
  };

  const calculatePostReadingTimeToString = (readingTime: number): string => {
    return `${readingTime} min`;
  };

  const readingTime = (postData: Post): string => {
    const { data } = postData;

    const { content } = data;

    const postTime = calculatePostReadingTime(content);

    const postTimeFormated = calculatePostReadingTimeToString(postTime);

    return postTimeFormated;
  };

  if (isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <main className={styles['post-container']}>
      <section className={styles['post-banner']}>
        <Image src={post.data.banner.url} alt="post-banner" layout="fill" />
      </section>
      <article
        className={`${commonStyles['container-wraper']} ${commonStyles['content-container']} ${styles.post}`}
      >
        <h1>{post.data.title}</h1>
        <div className={styles['post-info']}>
          <span>
            <FiCalendar width={20} height={20} />

            <span>{formatDate(post.first_publication_date)}</span>
          </span>
          <span>
            <FiUser width={15} height={15} />
            <span>{post.data.author}</span>
          </span>
          <span>
            <FiClock width={17} height={17} />
            <time>{readingTime(post)}</time>
          </span>
        </div>

        {post.data.content.map(postContent => (
          <section key={postContent.heading} className={styles['post-content']}>
            <h2>{postContent.heading}</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(postContent.body),
              }}
            />
          </section>
        ))}
      </article>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'publication'),
    { lang: '*' },
  );

  const paths = posts.results.map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { params } = context;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'publication',
    String(params.slug),
    {},
  );

  return {
    props: {
      post: response,
    },
    revalidate: 30,
  };
};
