import superagent from "superagent";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

// json 文件的数据结构
interface JsonContent {
  [propName: number]: Course[];
}

class Crowller {
  // private secret = "secretKey";
  // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=secretKey`;
  // private url = "https://ssr1.scrape.center/"; // 猫眼电影数据网
  private filePath = path.resolve(__dirname, "../data/course.json");

  // 初始化爬虫
  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo);
    this.writeFile(JSON.stringify(fileContent));
  }

  // 爬取html
  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text; // 返回 html 文本
  }

  // 处理 html 格式数据
  getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item"); // 页面上每一个课程区块都是一个 class 是 .course-item 的 div
    const courseInfos: Course[] = [];
    courseItems.map((item, element) => {
      const descs = $(element).find(".course-desc"); // jquery find() 方法用于查找所有后代元素
      const title = descs.eq(0).text(); // eq() 方法返回匹配元素集上相应索引的元素；text() 方法返回所选元素的文本内容
      const count = parseInt(descs.eq(1).text().split("：")[1], 10);
      courseInfos.push({
        title,
        count,
      });
    });
    const result = {
      time: new Date().getTime(),
      data: courseInfos,
    };
    return result;
  }

  // 数据进一步处理成写入 json 文件中格式
  generateJsonContent(courseInfo: CourseResult) {
    const filePath = this.filePath;
    let fileContent: JsonContent = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  // 将数据写入到文件中
  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  constructor() {
    this.initSpiderProcess();
  }
}
new Crowller();
