import { Box, Container, Heading } from "@chakra-ui/core";
import { useTranslation } from "@hooks/useTranslation";
import type { I18nMap } from "i18n";
import { locales } from "i18n";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { loadI18nBundle } from "util/utilities";

const LocalizedComponent = () => {
  const { t, locale } = useTranslation("greetings");

  return (
    <div>
      <p>Current locale: {locale}</p>
      <p>{t("hello")}</p>
      {locales.map((locale, i) => (
        <Link key={i} href="/" locale={locale}>
          <a>Choose {locale}</a>
        </Link>
      ))}
    </div>
  );
};

const Home = () => (
  <Fragment>
    <Head>
      <title>My Friends Book</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box as="main">
      <Container>
        <Heading>My Friends Book</Heading>
        <LocalizedComponent />
      </Container>
    </Box>
  </Fragment>
);

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const resources = await loadI18nBundle(locale as keyof I18nMap, [
    "greetings",
  ]);

  return {
    props: {
      i18n: {
        locale,
        resources,
      },
    },
  };
};

export default Home;
