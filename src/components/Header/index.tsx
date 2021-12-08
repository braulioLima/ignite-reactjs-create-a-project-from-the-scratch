import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles['home-header']}>
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
