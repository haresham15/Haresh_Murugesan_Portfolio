const SitemapGenerator = require('sitemap-generator');

const generator = SitemapGenerator('https://www.hareshmurugesan.com', {
  stripQuerystring: false,
  filepath: './public/sitemap.xml'
});

generator.on('done', () => {
  console.log(' Sitemap successfully created!');
});

generator.start();
