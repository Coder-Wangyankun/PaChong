// 此文件专门处理逻辑
import cheerio from "cheerio";
import fs from "fs";
import { Analyzer } from "./crowller";

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

export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer; // 作为单例模式的实例

  // 处理 html 格式数据
  private getCourseInfo(html: string) {
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
  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: JsonContent = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return JSON.stringify(fileContent);
  }
  // 分析器入口
  public analyze(html: string, filePath: string): string {
    const courseInfo = this.getCourseInfo(html);
    const result = this.generateJsonContent(courseInfo, filePath);
    return result;
  }
  private constructor() {} // 保护 constructor

  static getInstance() {
    if (!DellAnalyzer.instance) {
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return DellAnalyzer.instance;
  }
}
