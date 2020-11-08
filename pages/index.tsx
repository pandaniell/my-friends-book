import { Box, Container, Heading } from "@chakra-ui/core";
import Head from "next/head";
import { Fragment } from "react";

const Home = () => (
  <Fragment>
    <Head>
      <title>My Friends Book</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box as="main">
      <Container>
        <Heading>My Friends Book</Heading>
      </Container>
    </Box>
  </Fragment>
);

export default Home;
