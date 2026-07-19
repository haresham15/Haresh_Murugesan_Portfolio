const fs = require('fs');
const https = require('https');

const repos = [
  'healios', 'AIMotorsportsHub', 'DataIO', 'Careline',
  'Syntinuum_podcast_website', 'Philocracy', 'Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
  'TutorMatch_WebApp', 'CarStomerCarAnalysis', 'MomWebsite', 'murugesan_rajaram_lab_website',
  'Haresh-s-Software-2-Projects', 'Software-Project-Java-Collection-', 'Haresh_Murugesan_Portfolio',
  'AnnaBirthdayWebsite'
];

async function fetchReadme(repo) {
  const branches = ['main', 'master'];
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/haresham15/${repo}/${branch}/README.md`;
    try {
      const text = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          if (res.statusCode !== 200) {
            resolve(null);
            return;
          }
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });
      if (text) return text;
    } catch (e) {
      console.error(e);
    }
  }
  return 'No README found.';
}

async function main() {
  const results = {};
  for (const repo of repos) {
    console.log('Fetching', repo);
    results[repo] = await fetchReadme(repo);
  }
  fs.writeFileSync('readmes.json', JSON.stringify(results, null, 2));
  console.log('Done.');
}
main();
