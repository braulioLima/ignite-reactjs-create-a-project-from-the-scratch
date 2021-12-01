import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet"
          />

          <link rel="icon" href="/favicon.png" type="image/png" />

          <meta
            name="description"
            content="Um blog muito foda sobre o melhor da tecnologia."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </>
    );
  }
}
