export default {
  mode: "universal",
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
      { name: "theme-color", content: "#ffffff" },
      { name: "msapplication-TileColor", content: "#ffffff" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
  },
  loading: { color: "#fff" },
  css: ["codemirror/lib/codemirror.css", "codemirror/theme/duotone-light.css"],
  plugins: [{ src: "~plugins/nuxt-codemirror-plugin.js", ssr: false }],
  buildModules: [],
  modules: ["@nuxtjs/axios"],
  axios: {
    proxy: true,
  },
  proxy: {
    "/api/game/maze": {
      target: "http://localhost:4000",
      pathRewrite: { "^/api/game/maze": "" },
    },
  },
};
