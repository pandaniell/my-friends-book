const requireTypeScript = require("./requireTypeScript");
const generateI18nTypes = requireTypeScript("./scripts/generateI18nTypes.ts");
const locales = requireTypeScript("./i18n.ts");

module.exports = {
  i18n: {
    locales,
    defaultLocale: "en",
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      generateI18nTypes();
    }

    return config;
  },
};
