import { ChakraProvider } from "@chakra-ui/core";
import { I18nProvider } from "I18nProvider";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps: { i18n, ...rest } }: AppProps) => (
  <ChakraProvider>
    <I18nProvider {...i18n}>
      <Component {...rest} />
    </I18nProvider>
  </ChakraProvider>
);

export default App;
