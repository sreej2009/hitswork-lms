import type { CourseDetail } from '../types';

/**
 * Long-form course page content, keyed by course id.
 * To give another course a full details page, add an entry here with the same id as in `courses.ts`.
 * Courses without an entry still get a details page built from their catalog data.
 */
export const courseDetails: Record<string, CourseDetail> = {
  'web-development': {
    subcategory: 'Web Development',
    tagline:
      'Learn modern web development from scratch and build real-world websites and applications using HTML, CSS, JavaScript, React, Node.js and more.',
    lastUpdated: '2026-09',
    language: 'English',
    totals: { sections: 42, lectures: 420 },
    learn: [
      'Build responsive websites from scratch',
      'Master HTML5 and modern CSS',
      'Build interactive applications with JavaScript',
      'Create React applications',
      'Build REST APIs with Node.js',
      'Work with MongoDB',
      'Deploy real-world applications',
      'Build a professional developer portfolio',
    ],
    requirements: [
      'Basic computer knowledge',
      'No previous programming experience required',
      'A laptop or desktop computer',
      'Willingness to learn',
    ],
    audience: [
      'Beginners starting web development',
      'Students building their first portfolio',
      'Developers wanting to learn React',
      'Professionals transitioning into software development',
    ],
    description: [
      'This is the only course you need to go from complete beginner to confident full-stack web developer. Across 52 hours of carefully structured video, you’ll start with the building blocks of the web — HTML and CSS — and progress step by step through JavaScript, the DOM, React, Node.js, Express and MongoDB.',
      'Every section is built around real projects. You’ll create a personal portfolio site, an interactive task manager, a weather dashboard that pulls live data from an API, a blog platform with user authentication and a full-stack e-commerce store that you deploy to the cloud. By the end you’ll have a body of work you can show to employers and clients.',
      'Along the way you’ll pick up the professional workflow developers use every day: version control with Git and GitHub, debugging in the browser, writing clean and reusable components, designing REST APIs and shipping to production. The course is updated for 2026, so you’re learning the tools and practices teams actually use today.',
    ],
    curriculum: [
      {
        title: 'Introduction to Web Development',
        lectureCount: 12,
        minutes: 85,
        lectures: [
          { title: 'Welcome to the Bootcamp', duration: '04:12', preview: true },
          { title: 'How the Web Works: Browsers, Servers & HTTP', duration: '11:48', preview: true },
          { title: 'Setting Up VS Code and Chrome DevTools', duration: '09:35' },
          { title: 'Your Learning Roadmap', duration: '06:20' },
        ],
      },
      {
        title: 'HTML & CSS Fundamentals',
        lectureCount: 28,
        minutes: 250,
        lectures: [
          { title: 'HTML Document Structure', duration: '12:05', preview: true },
          { title: 'Semantic HTML & Accessibility Basics', duration: '14:30' },
          { title: 'The CSS Box Model', duration: '16:42' },
          { title: 'Flexbox from First Principles', duration: '21:18' },
          { title: 'Responsive Layouts with CSS Grid', duration: '24:06' },
        ],
      },
      {
        title: 'JavaScript Fundamentals',
        lectureCount: 36,
        minutes: 380,
        lectures: [
          { title: 'Variables, Types & Operators', duration: '15:22', preview: true },
          { title: 'Functions & Scope', duration: '18:40' },
          { title: 'Working with Arrays and Objects', duration: '20:15' },
          { title: 'DOM Manipulation & Events', duration: '23:50' },
        ],
      },
      {
        title: 'Modern JavaScript',
        lectureCount: 32,
        minutes: 315,
        lectures: [
          { title: 'ES Modules & Build Tooling', duration: '13:10' },
          { title: 'Promises and Async/Await', duration: '19:45' },
          { title: 'Fetching Data from APIs', duration: '17:28' },
          { title: 'Project: Weather Dashboard', duration: '32:05' },
        ],
      },
      {
        title: 'React Development',
        lectureCount: 48,
        minutes: 510,
        lectures: [
          { title: 'Thinking in Components', duration: '14:55', preview: true },
          { title: 'State, Props & Hooks', duration: '22:40' },
          { title: 'Routing with React Router', duration: '18:12' },
          { title: 'Forms and Validation', duration: '16:34' },
          { title: 'Project: Task Manager App', duration: '41:20' },
        ],
      },
      {
        title: 'Backend with Node.js',
        lectureCount: 42,
        minutes: 400,
        lectures: [
          { title: 'Node.js Runtime Essentials', duration: '15:48' },
          { title: 'Building a REST API with Express', duration: '26:30' },
          { title: 'Authentication with JSON Web Tokens', duration: '24:12' },
          { title: 'Error Handling & Middleware', duration: '17:05' },
        ],
      },
      {
        title: 'MongoDB & Databases',
        lectureCount: 28,
        minutes: 260,
        lectures: [
          { title: 'Documents, Collections & Queries', duration: '16:20' },
          { title: 'Data Modelling with Mongoose', duration: '21:44' },
          { title: 'Indexes & Performance Basics', duration: '14:08' },
        ],
      },
      {
        title: 'Full Stack Projects',
        lectureCount: 35,
        minutes: 510,
        lectures: [
          { title: 'Project: Full-Stack Blog Platform', duration: '58:30' },
          { title: 'Project: E-commerce Store', duration: '1:12:45' },
          { title: 'Deploying to the Cloud', duration: '24:18' },
          { title: 'Building Your Developer Portfolio', duration: '19:40' },
        ],
      },
    ],
    reviews: [
      {
        name: 'Priya Sharma',
        rating: 5,
        date: '2026-09-12',
        text: 'The pacing is spot on. I had never written a line of code, and by the React section I was building things I actually wanted to use. The projects made everything click.',
      },
      {
        name: 'Rahul Verma',
        rating: 5,
        date: '2026-08-28',
        text: 'I had tried free tutorials before but always got stuck. This course explains the why behind every concept. The Node.js and MongoDB sections alone were worth the price.',
      },
      {
        name: 'Emily Carter',
        rating: 4,
        date: '2026-08-03',
        text: 'Very thorough and well structured. A few of the backend videos move quickly, but the downloadable code and the Q&A answers filled in the gaps.',
      },
      {
        name: 'Arjun Menon',
        rating: 5,
        date: '2026-07-19',
        text: 'Landed my first junior developer role four months after finishing. The e-commerce project from the final section came up in every interview.',
      },
      {
        name: 'Sofia Martins',
        rating: 5,
        date: '2026-06-30',
        text: 'Clear explanations, great exercises and genuinely useful projects. I appreciated that the course is kept up to date with current versions of React and Node.',
      },
      {
        name: 'Daniel Kim',
        rating: 4,
        date: '2026-06-02',
        text: 'Excellent value. I would have liked a little more on testing, but as a complete path from zero to deploying a full-stack app it is hard to beat.',
      },
    ],
  },

  business: {
    subcategory: 'Business Strategy',
    tagline:
      'Learn how successful companies make strategic decisions — from analysing markets and competitors to leading teams, managing finances and planning for growth.',
    lastUpdated: '2026-08',
    language: 'English',
    totals: { sections: 6, lectures: 158 },
    learn: [
      'Analyse markets, customers and competitors',
      'Apply proven strategy frameworks like SWOT and Porter’s Five Forces',
      'Read and interpret financial statements',
      'Build a clear, actionable business plan',
      'Lead and motivate high-performing teams',
      'Design pricing and go-to-market strategies',
      'Make better decisions with data',
      'Present strategy confidently to stakeholders',
    ],
    requirements: [
      'No prior business education required',
      'Curiosity about how companies compete and grow',
      'A spreadsheet tool such as Excel or Google Sheets',
    ],
    audience: [
      'New and aspiring managers',
      'Founders and small business owners',
      'Professionals preparing for an MBA',
      'Anyone moving into a strategy or leadership role',
    ],
    description: [
      'Strategy can feel abstract until you see how real companies use it. This masterclass turns the core ideas taught in business schools into practical tools you can use at work straight away — without the jargon.',
      'You’ll learn to size a market, map the competition, read a balance sheet and cash-flow statement, and turn your analysis into a focused strategic plan. Case studies from technology, retail and consumer brands show how each framework plays out in practice.',
      'The course finishes with a capstone project in which you build a complete strategic plan for a company of your choice, giving you a portfolio piece to discuss in interviews and performance reviews.',
    ],
    curriculum: [
      {
        title: 'Foundations of Business Strategy',
        lectureCount: 24,
        minutes: 270,
        lectures: [
          { title: 'What Strategy Really Means', duration: '09:40', preview: true },
          { title: 'Vision, Mission and Objectives', duration: '12:15' },
          { title: 'Creating Sustainable Competitive Advantage', duration: '16:30' },
        ],
      },
      {
        title: 'Competitive Analysis & Market Research',
        lectureCount: 30,
        minutes: 345,
        lectures: [
          { title: 'Sizing a Market: TAM, SAM and SOM', duration: '14:20', preview: true },
          { title: 'Porter’s Five Forces in Practice', duration: '18:05' },
          { title: 'Running a SWOT Analysis That Matters', duration: '13:48' },
        ],
      },
      {
        title: 'Financial Statements for Managers',
        lectureCount: 32,
        minutes: 375,
        lectures: [
          { title: 'Reading an Income Statement', duration: '15:32' },
          { title: 'Balance Sheets and Cash Flow', duration: '19:10' },
          { title: 'Key Ratios Every Manager Should Know', duration: '17:25' },
        ],
      },
      {
        title: 'Leading Teams & Organisational Design',
        lectureCount: 26,
        minutes: 320,
        lectures: [
          { title: 'Structuring Teams for Execution', duration: '14:02' },
          { title: 'Setting Goals with OKRs', duration: '16:44' },
          { title: 'Giving Feedback and Coaching', duration: '12:30' },
        ],
      },
      {
        title: 'Marketing, Sales & Growth',
        lectureCount: 28,
        minutes: 340,
        lectures: [
          { title: 'Positioning and Pricing Strategy', duration: '17:18' },
          { title: 'Designing a Go-to-Market Plan', duration: '19:36' },
          { title: 'Measuring Growth: Unit Economics', duration: '15:50' },
        ],
      },
      {
        title: 'Capstone: Build a Strategic Plan',
        lectureCount: 18,
        minutes: 330,
        lectures: [
          { title: 'Choosing Your Company', duration: '08:15' },
          { title: 'Writing the Strategic Plan', duration: '28:40' },
          { title: 'Presenting to Stakeholders', duration: '21:05' },
        ],
      },
    ],
    reviews: [
      {
        name: 'Karthik Iyer',
        rating: 5,
        date: '2026-09-04',
        text: 'Practical and easy to follow. I used the competitor mapping template in a planning meeting the same week, and my manager asked where I had learned it.',
      },
      {
        name: 'Hannah Lewis',
        rating: 5,
        date: '2026-08-16',
        text: 'The finance section finally made balance sheets make sense to me. Great mix of frameworks and real company examples.',
      },
      {
        name: 'Vikram Rao',
        rating: 4,
        date: '2026-07-22',
        text: 'Solid overview of strategy for new managers. Some case studies could be more recent, but the capstone project is excellent.',
      },
      {
        name: 'Aisha Bello',
        rating: 5,
        date: '2026-06-11',
        text: 'I took this before starting my MBA and it gave me a real head start. Clear, well paced and full of useful templates.',
      },
    ],
  },

  'ui-ux': {
    subcategory: 'User Experience Design',
    tagline:
      'Design intuitive, beautiful digital products. Learn the complete UX process — research, wireframing, visual design and prototyping — using Figma and Adobe XD.',
    lastUpdated: '2026-09',
    language: 'English',
    totals: { sections: 6, lectures: 176 },
    learn: [
      'Run user research and create personas',
      'Map user journeys and information architecture',
      'Wireframe web and mobile interfaces',
      'Apply colour, typography and layout principles',
      'Build interactive prototypes in Figma and Adobe XD',
      'Create and maintain a reusable design system',
      'Plan and run usability tests',
      'Hand off designs to developers with confidence',
    ],
    requirements: [
      'No design experience needed',
      'A free Figma account',
      'A computer that can run a modern web browser',
    ],
    audience: [
      'Beginners who want to become UI/UX designers',
      'Graphic designers moving into digital products',
      'Developers who want to design better interfaces',
      'Product managers who work closely with designers',
    ],
    description: [
      'Great products start with understanding people. This course takes you through the entire UX design process, from interviewing users and defining problems to shipping polished, developer-ready designs.',
      'You’ll design a mobile banking app and a responsive marketing website from scratch. Along the way you’ll build wireframes, craft a visual style, create a component library and turn static screens into clickable prototypes you can test with real users.',
      'By the end you’ll have two complete case studies for your portfolio and a repeatable process you can bring to any product team.',
    ],
    curriculum: [
      {
        title: 'Getting Started with UX',
        lectureCount: 18,
        minutes: 190,
        lectures: [
          { title: 'What UI and UX Designers Actually Do', duration: '10:24', preview: true },
          { title: 'Tour of Figma and Adobe XD', duration: '14:50', preview: true },
          { title: 'The Design Thinking Process', duration: '12:36' },
        ],
      },
      {
        title: 'User Research & Personas',
        lectureCount: 26,
        minutes: 380,
        lectures: [
          { title: 'Planning User Interviews', duration: '15:12' },
          { title: 'Synthesising Research with Affinity Maps', duration: '17:40' },
          { title: 'Creating Personas and Journey Maps', duration: '19:05' },
        ],
      },
      {
        title: 'Wireframing & Information Architecture',
        lectureCount: 30,
        minutes: 450,
        lectures: [
          { title: 'Sitemaps and User Flows', duration: '14:18' },
          { title: 'Low-Fidelity Wireframes', duration: '18:22' },
          { title: 'Designing for Mobile First', duration: '16:47' },
        ],
      },
      {
        title: 'Visual Design & Typography',
        lectureCount: 34,
        minutes: 520,
        lectures: [
          { title: 'Colour Theory for Interfaces', duration: '17:30', preview: true },
          { title: 'Type Scales and Hierarchy', duration: '15:55' },
          { title: 'Layout, Grids and Spacing', duration: '18:12' },
        ],
      },
      {
        title: 'Prototyping in Figma & Adobe XD',
        lectureCount: 40,
        minutes: 650,
        lectures: [
          { title: 'Components, Variants and Auto Layout', duration: '22:40' },
          { title: 'Interactive Prototypes and Micro-interactions', duration: '20:15' },
          { title: 'Building a Design System', duration: '26:08' },
        ],
      },
      {
        title: 'Usability Testing & Handoff',
        lectureCount: 28,
        minutes: 510,
        lectures: [
          { title: 'Running a Usability Test', duration: '16:34' },
          { title: 'Iterating on Feedback', duration: '14:20' },
          { title: 'Developer Handoff and Specs', duration: '15:48' },
        ],
      },
    ],
    reviews: [
      {
        name: 'Meera Nair',
        rating: 5,
        date: '2026-09-08',
        text: 'The best introduction to UX I have found. The banking app project gave me my first proper portfolio case study.',
      },
      {
        name: 'Lucas Fischer',
        rating: 5,
        date: '2026-08-21',
        text: 'Clear, calm teaching and brilliant Figma walkthroughs. The design system section changed how I organise every file.',
      },
      {
        name: 'Ananya Gupta',
        rating: 5,
        date: '2026-07-30',
        text: 'As a developer I always struggled with visual design. The typography and spacing lessons made an immediate difference to my work.',
      },
      {
        name: 'Tom Hughes',
        rating: 4,
        date: '2026-07-02',
        text: 'Really comprehensive. The Adobe XD parts feel less essential now that most teams use Figma, but everything else is excellent.',
      },
    ],
  },

  'data-science': {
    subcategory: 'Machine Learning',
    tagline:
      'Use Python to analyse data, build compelling visualisations and train machine learning models with NumPy, Pandas, Matplotlib, Scikit-Learn and TensorFlow.',
    lastUpdated: '2026-09',
    language: 'English',
    totals: { sections: 7, lectures: 194 },
    learn: [
      'Program confidently in Python for data work',
      'Clean, transform and analyse data with Pandas',
      'Create clear visualisations with Matplotlib and Seaborn',
      'Understand the statistics behind machine learning',
      'Build regression and classification models',
      'Evaluate and tune models with Scikit-Learn',
      'Train neural networks with TensorFlow',
      'Complete end-to-end data science projects',
    ],
    requirements: [
      'Basic maths at high-school level',
      'No prior programming experience required',
      'A computer that can run Python (Windows, macOS or Linux)',
    ],
    audience: [
      'Beginners who want to start a career in data science',
      'Analysts ready to move beyond spreadsheets',
      'Developers who want to learn machine learning',
      'Students preparing for data roles and interviews',
    ],
    description: [
      'Data science is one of the most in-demand skill sets in the world, and Python is its language. This course starts with Python fundamentals and builds up to training your own machine learning and deep learning models.',
      'You’ll work with real datasets throughout — housing prices, customer churn, movie ratings and more — learning how to clean messy data, explore it visually and choose the right model for the problem. Every concept is backed by hands-on Jupyter notebooks you can keep.',
      'The course closes with capstone projects that take you from a raw dataset to a trained, evaluated model and a written report, giving you work you can publish on GitHub and discuss in interviews.',
    ],
    curriculum: [
      {
        title: 'Python Crash Course',
        lectureCount: 22,
        minutes: 330,
        lectures: [
          { title: 'Installing Python and Jupyter', duration: '11:20', preview: true },
          { title: 'Data Types, Loops and Functions', duration: '21:45' },
          { title: 'Working with Files and Libraries', duration: '16:30' },
        ],
      },
      {
        title: 'NumPy & Pandas for Data Analysis',
        lectureCount: 34,
        minutes: 560,
        lectures: [
          { title: 'NumPy Arrays and Vectorisation', duration: '18:14', preview: true },
          { title: 'DataFrames: Selecting and Filtering', duration: '22:36' },
          { title: 'Cleaning Messy Real-World Data', duration: '24:10' },
        ],
      },
      {
        title: 'Data Visualisation with Matplotlib & Seaborn',
        lectureCount: 24,
        minutes: 400,
        lectures: [
          { title: 'Plotting Fundamentals', duration: '15:48' },
          { title: 'Statistical Charts with Seaborn', duration: '19:25' },
          { title: 'Telling Stories with Data', duration: '17:02' },
        ],
      },
      {
        title: 'Statistics & Probability Essentials',
        lectureCount: 26,
        minutes: 490,
        lectures: [
          { title: 'Distributions and Sampling', duration: '20:12' },
          { title: 'Hypothesis Testing', duration: '23:40' },
          { title: 'Correlation vs Causation', duration: '14:55' },
        ],
      },
      {
        title: 'Machine Learning with Scikit-Learn',
        lectureCount: 48,
        minutes: 990,
        lectures: [
          { title: 'Linear and Logistic Regression', duration: '26:30', preview: true },
          { title: 'Decision Trees and Random Forests', duration: '24:18' },
          { title: 'Model Evaluation and Cross-Validation', duration: '21:44' },
          { title: 'Clustering with K-Means', duration: '19:06' },
        ],
      },
      {
        title: 'Deep Learning & Neural Networks',
        lectureCount: 30,
        minutes: 650,
        lectures: [
          { title: 'How Neural Networks Learn', duration: '22:50' },
          { title: 'Building Models with TensorFlow and Keras', duration: '28:15' },
          { title: 'Image Classification with CNNs', duration: '31:40' },
        ],
      },
      {
        title: 'Capstone Projects',
        lectureCount: 10,
        minutes: 180,
        lectures: [
          { title: 'Project: Predicting House Prices', duration: '42:30' },
          { title: 'Project: Customer Churn Model', duration: '38:15' },
        ],
      },
    ],
    reviews: [
      {
        name: 'Siddharth Joshi',
        rating: 5,
        date: '2026-09-15',
        text: 'Went from knowing nothing about Python to building my own churn model. The notebooks are superb reference material.',
      },
      {
        name: 'Grace O’Connor',
        rating: 5,
        date: '2026-08-24',
        text: 'Excellent balance of theory and practice. The statistics section is the clearest explanation I have come across.',
      },
      {
        name: 'Neha Kulkarni',
        rating: 4,
        date: '2026-07-27',
        text: 'Long, but worth every hour. The deep learning section is a little fast for beginners, so plan to rewatch a few lectures.',
      },
      {
        name: 'Mateo Alvarez',
        rating: 5,
        date: '2026-06-18',
        text: 'I used the capstone projects in my portfolio and they helped me move from a reporting role into a junior data scientist position.',
      },
    ],
  },
};
