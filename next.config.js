const requireTypeScript = require("./requireTypeScript");
const locales = requireTypeScript("./i18n.ts");

module.exports = {
  i18n: {
    locales,
    defaultLocale: "en",
  },
};
