const rssPlugin = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });

  // Markdown
  const md = markdownIt({ html: true, linkify: true, typographer: true }).use(
    markdownItAnchor,
    { permalink: false }
  );
  eleventyConfig.setLibrary('md', md);

  // Filters
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter('year', (dateObj) => {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return d.getUTCFullYear();
  });

  eleventyConfig.addFilter('slug', (str) => {
    return String(str || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  });

  eleventyConfig.addFilter('limit', (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter('skip', (arr, n) => arr.slice(n));

  eleventyConfig.addFilter('absoluteUrl', (url, base) => {
    try {
      return new URL(url, base).toString();
    } catch (e) {
      return url;
    }
  });

  // Collections
  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('src/posts/**/*.md')
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection('categoryList', (collectionApi) => {
    const set = new Set();
    collectionApi.getFilteredByGlob('src/posts/**/*.md').forEach((p) => {
      if (p.data.category) set.add(p.data.category);
    });
    return [...set].sort();
  });

  eleventyConfig.addCollection('tagList', (collectionApi) => {
    const set = new Set();
    collectionApi.getFilteredByGlob('src/posts/**/*.md').forEach((p) => {
      (p.data.tags || []).forEach((t) => {
        if (t && t !== 'post') set.add(t);
      });
    });
    return [...set].sort();
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', '11ty.js'],
  };
};
