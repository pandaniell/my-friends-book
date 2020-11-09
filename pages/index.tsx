import { Box, Container, Heading } from "@chakra-ui/core";
import { useTranslation } from "@hooks/useTranslation";
import { I18nContext } from "I18nProvider";
import { GetStaticProps } from "next";
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
      {["en", "nl"].map((locale, i) => (
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

export const getStaticProps: GetStaticProps<Record<
  "i18n",
  I18nContext
>> = async ({ locale = "en" }) => {
  const asLocale = locale as I18nContext["locale"];
  const resources = await loadI18nBundle(asLocale, ["greetings"]);
  const asResources = (resources as unknown) as I18nContext["resources"];

  return {
    props: {
      i18n: {
        locale: asLocale,
        resources: asResources,
      },
    },
  };
};

export default Home;
