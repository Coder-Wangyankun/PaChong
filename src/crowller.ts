import superagent from "superagent";
class Crowller {
  // private secret = "secretKey";
  // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private url = "https://ssr1.scrape.center/"; // 猫眼电影数据网
  private rawHtml = ""; // 爬到的html
  // 爬取html
  async getRawHtml() {
    const result = await superagent.get(this.url);
    this.rawHtml = result.text;
    console.log(this.rawHtml);
  }
  constructor() {
    this.getRawHtml();
  }
}
new Crowller();
