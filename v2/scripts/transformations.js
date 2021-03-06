db.getCollection("glassdoor").aggregate(
  [
    {
      $group: {
        _id: {
          jobTitle: "$jobTitle",
          country: "$country",
          location: "$location",
          empName: "$empName",
          empSize: "$empSize",
          industry: "$industry",
          benefitRating: "$benefitRating",
          numberOfRatings: "$numberOfRating",
        },
        jobListingCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: {
          jobTitle: "$_id.jobTitle",
          country: "$_id.country",
          location: "$_id.location",
          empName: "$_id.empName",
          empSize: "$_id.empSize",
          industry: "$_id.industry",
          benefitRating: "$_id.benefitRating",
          numberOfRatings: "$_id.numberOfRating",
        },
        jobListingCount: 1,
      },
    },
    { $out: { db: "sbp-v2", coll: "jobs" } },
  ],
  { allowDiskUse: true }
);

db.getCollection("glassdoor").aggregate(
  [
    { $unwind: "$salaries" },
    {
      $group: {
        _id: { jobTitle: "$salaries.jobTitle", country: "$country" },
        avgPayPercentile10: { $avg: "$salaries.payPercentile10" },
        avgPayPercentile90: { $avg: "$salaries.payPercentile90" },
        maxPayPercentile10: { $max: "$salaries.payPercentile10" },
        maxPayPercentile90: { $max: "$salaries.payPercentile90" },
        minPayPercentile10: { $min: "$salaries.payPercentile10" },
        minPayPercentile90: { $min: "$salaries.payPercentile90" },
        jobListingCount: { $sum: 1 },
        jobDetails: {
          $push: {
            location: "$location",
            empName: "$empName",
            empSize: "$empSize",
            industry: "$industry",
            benefitRating: "$benefitRating",
            numberOfRatings: "$numberOfRating",
          },
        },
      },
    },
    {
      $project: {
        _id: { jobTitle: "$_id.jobTitle", country: "$_id.country" },
        avgPayPercentile10: 1,
        avgPayPercentile90: 1,
        maxPayPercentile10: 1,
        maxPayPercentile90: 1,
        minPayPercentile10: 1,
        minPayPercentile90: 1,
        jobListingCount: 1,
        jobDetails: 1,
      },
    },
    { $out: { db: "sbp-v2", coll: "salaries" } },
  ],
  { allowDiskUse: true }
);

db.getCollection("glassdoor").aggregate(
  [
    {
      $unwind: "$benefits",
    },
    {
      $group: {
        _id: {
          jobTitle: "$jobTitle",
          comments: "$benefits.comment",
          location: "$location",
          benefitRating: "$benefitRating",
        },
        number: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: {
          jobTitle: "$_id.jobTitle",
          comments: "$_id.comments",
          location: "$_id.location",
          benefitRating: "$_id.benefitRating",
        },
        number: "$number",
      },
    },
    { $out: { db: "sbp-v2", coll: "benefits" } },
  ],
  { allowDiskUse: true }
);

db.getCollection("glassdoor").aggregate(
  [
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$empName",
        avgOverallRating: { $avg: "$reviews.overallRating" },
        avgCompBenefitsRating: { $avg: "$reviews.compBenefitsRating" },
        avgCultureValuesRating: { $avg: "$reviews.cultureValuesRating" },
        avgSeniorManagmentRating: { $avg: "$reviews.seniorManagmentRating" },
        avgWorkLifeBalanceRating: { $avg: "$reviews.workLifeBalanceRating" },
        reviewsCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        avgOverallRating: 1,
        avgCompBenefitsRating: 1,
        avgCultureValuesRating: 1,
        avgSeniorManagmentRating: 1,
        avgWorkLifeBalanceRating: 1,
        reviewsCount: 1,
      },
    },
    { $out: { db: "sbp-v2", coll: "reviews" } },
  ],
  { allowDiskUse: true }
);

db.getCollection("glassdoor").aggregate(
  [
    {
      $unwind: "$salaries",
    },
    {
      $group: {
        _id: {
          industry: "$industry",
          jobTitle: "$jobTitle",
        },
        average_salary: { $avg: "$salaries.payPercentile90" },
      },
    },
    {
      $project: {
        _id: {
          industry: "$_id.industry",
          jobTitle: "$_id.jobTitle",
        },
        average_salary: { $round: ["$average_salary", 2] },
      },
    },
    { $out: { db: "sbp-v2", coll: "salary_per_job" } },
  ],
  { allowDiskUse: true }
);
