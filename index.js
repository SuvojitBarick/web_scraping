const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movie = "https://www.imdb.com/title/tt1375666/?ref_=hm_stp_pvs_piv_tt_3";
(
    async () => {
        let imdbData = []
        const response = await request({
            uri: movie,
            header: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en;q=0.9,or-IN;q=0.8,or;q=0.7,en-US;q=0.6,hi;q=0.5"
            },
            gzip: true
        });
        let $ = cheerio.load(response)
        let title = $('div[class="title_wrapper"] > h1').text().trim()
        let rating = $('div[class="ratingValue"] > strong > span').text()
        let summary = $('div[class="summary_text"] ').text().trim()
        imdbData.push({
            title: title,
            rating: rating,
            summary: summary
        });

        const j2cp = new json2csv();
        const csv = j2cp.parse(imdbData);

        fs.writeFileSync("./imdb.csv", csv, "utf-8");
    }
)();

