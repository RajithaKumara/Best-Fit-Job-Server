const mongoDbLocalURI = "mongodb://localhost:27017/testDB";
const redisDbLocalURI = "redis://localhost:6379";
const pingURL = "http://www.google.com";

const tempUser_id = "5adc3d2a2e1728b70a9c7207";
const tempUser_email = "tempUser@domain.com";
const tempUser_token = "5adc3d2a2e1728b70a9c7207";

const seeker1_id = "5acf6ac7ce5baa1d7c09841e";
const seeker1_email = "seeker1.email@domain.com";

const seeker2_id = "5ad02d429eff6c700c96dada";
const seeker2_email = "seeker2.email@domain.com";

const seeker3_id = "5ad7ad4a2e1728b70a99214a";
const seeker3_email = "seeker3.email@domain.com";
const seeker3_data = {
  firstName: "seeker3 firstName",
  lastName: "seeker3 lastName",
  dob: "seeker3 dob",
  gender: "seeker3 gender",
  country: "seeker3 country",
  currentPosition: "seeker3 currentPosition",
  summary: "seeker3 summary"
};
const seeker3_data_updated = {
  firstName: "seeker3 firstName updated",
  lastName: "seeker3 lastName updated",
  dob: "seeker3 dob updated",
  gender: "seeker3 gender updated",
  country: "seeker3 country updated",
  currentPosition: "seeker3 currentPosition updated",
  summary: "seeker3 summary updated"
};


const employer1_id = "5ad0a76a6cfb2722c0c4f7d7";
const employer1_email = "employer1.email@domain.com";
const employer1_ownerInfo = {
  firstName: "FirstName",
  lastName: "LastName",
  country: "Country",
  summary: "About Employer",
  contacts: [{ type: "mobile", detail: "1122334455" }]
};
const employer1_ownerInfoUpdated = {
  firstName: "FirstName Updated",
  lastName: "LastName Updated",
  country: "Country Updated",
  summary: "About Employer Updated",
  contacts: [{ type: "mobile Updated", detail: "1122334455" }]
};
const employer1_companyInfo = {
  companyName: "Company Name",
  companyUrl: "Company Url",
  date: "2018-04",
  companyEmail: "company@domain.com",
  aboutCompany: "About Company",
  jobType: "online",
  companySize: "Company Size",
  companyType: "Company Type",
  tags: ["tag1", "tag2"],
  companyBuilding: "Company Building",
  companyAddress: "Company Address",
  companyCountry: "Company Country",
  groups: [{ type: "mobile", detail: "1122334455" }]
};

const employer2_id = "5ad0ad2e51e31c2a14bcabff";
const employer2_email = "employer2.email@domain.com";
const employer2_ownerInfo = {
  firstName: "FirstName",
  lastName: "LastName",
  summary: "About Employer",
  contacts: [{ type: "mobile", detail: "1122334455" }]
};

const employer3_id = "5ad8b8d72e1728b70a99663b";
const employer3_email = "employer3.email@domain.com";

const job1 = {
  jobTitle: "jobTitle1",
  jobDescription: "jobDescription1",
  contacts: [{ type: "mobile", detail: "1122334455" }],
  tags: ["tag1", "tag2"],
  url: "url",
  online: true,
  salary: "salary",
  offers: 5,
  privacy: true,
  enable: false
};
const job1_updated = {
  jobTitle: "jobTitle1 Updated",
  jobDescription: "jobDescription1 Updated",
  contacts: [{ type: "mobile", detail: "1122334455" }],
  tags: ["tag1", "tag2", "tag3"],
  url: "url Updated",
  online: false,
  salary: "salary Updated",
  offers: 10,
  privacy: false,
  enable: true
};
const job2 = {
  jobTitle: "jobTitle2",
  contacts: [{ type: "mobile", detail: "1122334455" }],
  tags: ["tag1", "tag2"],
  url: "url",
  online: true,
  salary: "salary",
  offers: 5,
  privacy: true
};


const tagMap1 = {
  "tag1": "category1",
  "tag2": "category2",
  "tag3": "category3",
  "tag4": "category4",
  "tag5": "category5",
  "tag6": "category6"
}
const tagMap2 = {
  "tag1": "category1",
  "tag2": "category2 new",
  "tag3": "category3 new",
  "tag4": "category4",
  "tag5": "category5 new",
  "tag6": "category6",
  "tag7": "category7 new"
}

const jobTitle1 = "Graduate Application Developer";
const jobDescription1 = "You’ll be part of a bright engineering team that has " +
  "a culture of open communication, collaboration, and innovation. We are looking " +
  "for engineers who have a strong self-directed work ethic and make it happen mindset." +
  "Applicants are expected to be articulate, detail-oriented and highly analytical. " +
  "You will be working with teams across VMware. You will participate in all phases of " +
  "product development for the next gen test Tools solution, including: gathering " +
  "requirements/user stories, system architecture, the design/prototyping process, " +
  "authoring specifications, implementation, and testing for features developed." +
  "Applicants should exhibit experience in building distributed applications, APIs " +
  "and fault-tolerant solutions. Members of the team focus on highly scalable solutions " +
  "capable of managing thousands of systems. Experience in the use of virtualization as " +
  "a key technology to design and implement applications that solve real-world problems " +
  "is a plus.";

const seeker_profile1 = {
  general: {
    summary: jobDescription1
  },
  tags: ["tag4"]
};

const seeker_profile2 = {
  general: {
    summary: jobDescription1
  },
  tags: ["tag2"]
};

module.exports = {
  mongoDbLocalURI,
  redisDbLocalURI,
  pingURL,
  tempUser_id,
  tempUser_token,
  tempUser_email,
  seeker1_id,
  seeker1_email,
  seeker2_id,
  seeker2_email,
  seeker3_id,
  seeker3_email,
  seeker3_data,
  seeker3_data_updated,
  employer1_id,
  employer1_email,
  employer1_ownerInfo,
  employer1_ownerInfoUpdated,
  employer1_companyInfo,
  employer2_id,
  employer2_email,
  employer2_ownerInfo,
  employer3_id,
  employer3_email,
  job1,
  job1_updated,
  job2,
  tagMap1,
  tagMap2,
  jobTitle1,
  jobDescription1,
  seeker_profile1,
  seeker_profile2
}