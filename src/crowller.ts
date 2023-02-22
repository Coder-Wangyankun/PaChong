import fs from "fs";
import path from "path";
import DellAnalyzer from "./dellAnalyzer";
import superagent from "superagent";

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, "../data/course.json");

  // 爬取html
  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text; // 返回 html 文本
  }

  // 初始化爬虫
  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = analyzer.analyze(html, this.filePath); // html 传给分析器分析，返回 string 类型 json
    this.writeFile(fileContent);
  }

  // 将数据写入到文件中
  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  constructor(private url: string, private analyzer: any) {
    this.initSpiderProcess();
  }
}
const url = "http://www.dell-lee.com/typescript/demo.html?secret=secretKey";
const analyzer = new DellAnalyzer(); // 生成分析器
new Crowller(url, analyzer); // 传入 url 和分析器
