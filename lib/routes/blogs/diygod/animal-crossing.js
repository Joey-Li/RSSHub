const got = require('@/utils/got');
const cheerio = require('cheerio');
const date = require('@/utils/date');

module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://diygod.me/animal-crossing',
    });

    const data = response.data;

    const $ = cheerio.load(data);
    const list = $('h3');

    ctx.state.data = {
        title: 'DIYgod 的动森日记',
        link: 'https://diygod.me/animal-crossing',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    let description = '';
                    item.nextUntil('h3').each((index, item) => {
                        description += $(item).html();
                    });
                    return {
                        title: item.text(),
                        description,
                        link: `https://diygod.me/animal-crossing/#${item.attr('id')}`,
                        pubDate: date(item.text().split(' ')[1]),
                    };
                })
                .get(),
    };
};
