const Parser = require('rss-parser');
const {sendMessageToSlack} = require('./sendSlack')

let feedsManger = [
    {
        messageTitle: "🎊🎊🎊 Google Maps Job 🎊🎊🎊",
        feedURL: "https://www.upwork.com/ab/feed/jobs/rss?paging=0-10&q=google%20map%20scraping&sort=recency&api_params=1&securityToken=d352297f5385ab18948cd13bb573e103c36abce0ecc7e94872530ff1e7f8be5d394871e2b8936063ea1d75f5936871c2191b15f01c82a7991fdc7e30e9203dcf&userUid=1526663207644131328&orgUid=1526663207644131329",
        lastArticleTitle: ""
    },
    {
        messageTitle: "🎋🎋 Puppeteer Job 🎋🎋🎋",
        feedURL: "https://www.upwork.com/ab/feed/jobs/rss?paging=0-10&q=puppeteer&sort=recency&api_params=1&securityToken=d352297f5385ab18948cd13bb573e103c36abce0ecc7e94872530ff1e7f8be5d394871e2b8936063ea1d75f5936871c2191b15f01c82a7991fdc7e30e9203dcf&userUid=1526663207644131328&orgUid=1526663207644131329",
        lastArticleTitle: ""
    }
]

async function fetchRSSFeed(url) {
    const parser = new Parser();
    const feed = await parser.parseURL(url);
    
    return feed;
}

async function checkForNewArticles(singleFeed) {
    try {
        const feed = await fetchRSSFeed(singleFeed.feedURL);
        const latestArticle = feed.items[0];
        if (latestArticle.title !== singleFeed.lastArticleTitle) {
            let message = `${singleFeed.messageTitle}\n\n
*Title:* ${latestArticle.title.trim()}\n\n
*Link:* ${latestArticle.link.trim()}\n\n
*Description:*  ${extractPlainText(latestArticle.content.trim())}\n\n\n
*Date:* ${latestArticle.pubDate.trim()}\n\n
            `
            await sendMessageToSlack(message);
            singleFeed.lastArticleTitle = latestArticle.title;
        } else {
            console.log('No new articles found');
        }
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
    }
}

const INTERVAL = 5 * 60 * 1000;


function checkAllRSS() {
    feedsManger.forEach(el => checkForNewArticles(el))
}

checkAllRSS();



setInterval(() => checkAllRSS(), INTERVAL);


// function extractPlainText(htmlString) {
//     // Remove HTML tags
//     const plainText = htmlString.replace(/<[^>]+>/g, '');
  
//     // Replace <br> tags with newline characters
//     const textWithNewlines = plainText.replace(/<br\s*\/?>/gi, '\n');
//     const textWithHeadings = textWithNewlines.replace(/<b>/g, '*').replace(/<\/b>/g, '*');
  
//     return textWithHeadings;
//   }

  function extractPlainText(jobPosting) {
    const formattedText = jobPosting
        .replace(/<br \/>/g, '\n')
        .replace(/<b>(.*?)<\/b>/g, '*$1*')
        .replace(/<a href="(.*?)">(.*?)<\/a>/g, '$2 ($1)');
    
    return formattedText;
}