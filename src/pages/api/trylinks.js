import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const url = 'https://economictimes.indiatimes.com/news/economy/agriculture/tomato-to-squeeze-kitchen-budgets-more-as-prices-may-rise-further/articleshow/101622191.cms';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract the desired text using Cheerio selectors
    const title = $('h1').text();
    const description = $('meta[name="description"]').attr('content');
    const paragraphs = [];
    $('p').each((index, element) => {
      paragraphs.push($(element).text());
    });

    res.status(200).json({ title, description, paragraphs });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
