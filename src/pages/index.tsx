import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatDate } from '../utils';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [isMorePostActive, setIsMorePostActive] = useState(false);
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page || '');

  useEffect(() => {
    if (isMorePostActive) {
      fetch(nextPage)
        .then(response => response.json())
        .then((data: PostPagination) => {
          const { next_page, results } = data;
          setNextPage(next_page);
          setPosts([...posts, ...results]);
        });
      setIsMorePostActive(false);
    }
  }, [isMorePostActive, posts, nextPage]);

  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>

      <main
        className={`${commonStyles['container-wraper']} ${styles.container}`}
      >
        <section className={`${commonStyles['content-container']} `}>
          <ul className={styles['post-list']}>
            {posts.map(post => (
              <li className={styles['post-item']} key={post.uid}>
                <Link href={`/post/${post.uid}`}>
                  <a className={styles.post}>
                    <strong>{post.data.title}</strong>
                    <p>{post.data.subtitle}</p>
                    <footer className={styles['post-footer']}>
                      <span>
                        <FiCalendar width={15} height={15} />
                        <time>{formatDate(post.first_publication_date)}</time>
                      </span>
                      <span>
                        <FiUser width={15} height={15} />
                        <p>{post.data.author}</p>
                      </span>
                    </footer>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          {nextPage && (
            <button type="button" onClick={() => setIsMorePostActive(true)}>
              Carregar mais posts
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      fetch: [
        'publication.title',
        'publication.author',
        'publication.subtitle',
      ],
      pageSize: 1,
    },
  );

  const posts = postsResponse.results.map<Post>(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
