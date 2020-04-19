module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/colors.scss";
        `,
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/valorant-callouts/'
    : '/',
};
