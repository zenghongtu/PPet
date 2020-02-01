const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(config) {
  // https://github.com/electron-userland/electron-webpack/issues/165#issuecomment-475615807
  config.plugins.forEach(plugin => {
    if (plugin.constructor.name === 'MiniCssExtractPlugin') {
      plugin.options.filename = '[id].styles.css';
      plugin.options.moduleFilename = name => {
        return '[id].styles.css';
      };
    }
    // 修复 HtmlWebpackPlugin 插件会注入所有 chunks 问题
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.chunks = ['renderer'];
    }
  });

  // 创建 第二个窗口 html
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: `!!html-loader?minimize=false&url=false!${path.resolve(
        'dist/.renderer-index-template.html'
      )}`,
      filename: `plugins.html`,
      chunks: ['renderer2'],
      title: `Plugins`
    })
  );

  config.entry.renderer2 = [
    'css-hot-loader/hotModuleReplacement',
    path.resolve('src/renderer2/index.tsx')
  ];

  config.resolve.alias.renderer2 = path.resolve('src/renderer2');

  return config;
};
