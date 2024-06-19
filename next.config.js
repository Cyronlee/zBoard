/** @type {import('next').NextConfig} */
const { version } = require('./package.json');
const path = require('path')


const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CURRENT_APP_VERSION': JSON.stringify(version),
      })
    );
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
