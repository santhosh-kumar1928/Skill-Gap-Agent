import { analyzeSkillGap } from '../server/skillGapEngine.js';

const sampleProfile = {
  education: {
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    cgpa: 8.4
  },
  technical_skills: {
    programming_languages: ["Java", "SQL", "JavaScript", "C++", "Python"],
    frameworks: ["React", "Express.js", "Spring Boot"],
    libraries: ["HTML/CSS"],
    databases: ["MySQL", "PostgreSQL"],
    tools: ["Git", "VS Code", "Postman", "Docker"],
    cloud: ["AWS"],
    others: ["Data Structures", "OOPs", "REST APIs"]
  },
  projects: [
    {
      title: "Student Placement Portal",
      tech_stack: ["Java", "React", "MySQL", "Spring Boot"]
    },
    {
      title: "E-Commerce REST Microservice",
      tech_stack: ["Express.js", "Node.js", "Docker", "PostgreSQL"]
    }
  ],
  certifications: ["Java SE Programmer", "AWS Certified Cloud Practitioner"]
};

const companiesToTest = ["Zoho", "Google", "Amazon", "Microsoft", "TCS", "Flipkart"];

console.log("==========================================================================");
console.log("         SKILL GAP AGENT - TARGET COMPANIES ANALYSIS OUTPUTS              ");
console.log("==========================================================================");

companiesToTest.forEach(comp => {
  const result = analyzeSkillGap({
    profile: sampleProfile,
    target_company: comp
  });
  console.log(`\n>>> TARGET COMPANY: ${comp.toUpperCase()} <<<`);
  console.log(JSON.stringify(result, null, 2));
});
