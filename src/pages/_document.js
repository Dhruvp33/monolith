import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load global CSS */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        {/* Add other stylesheets */}
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Load scripts at the end */}
        <script src="/assets/js/jquery.min.js"></script>
        <script src="/assets/js/bootstrap.bundle.min.js"></script>
        <script src="/assets/js/wow.min.js"></script>
        {/* Add other scripts */}
      </body>
    </Html>
  );
}