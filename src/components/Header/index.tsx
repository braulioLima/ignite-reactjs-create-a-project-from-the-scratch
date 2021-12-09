import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

interface HeaderProps {
  currentPage: string;
}

export default function Header({ currentPage }: HeaderProps): JSX.Element {
  const pageStyle = currentPage === '/' ? 'home' : 'post';

  return (
    <header
      className={`${commonStyles['container-wraper']} ${
        commonStyles['content-container']
      } ${styles[`${pageStyle}`]}`}
    >
      <Link href="/">
        <a>
          <Image
            src="/images/logo.png"
            alt="logo"
            width={238.62}
            height={25.63}
          />
        </a>
      </Link>
    </header>
  );
}
