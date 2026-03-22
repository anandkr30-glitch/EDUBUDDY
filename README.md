# 🎓 EduBuddy - A personalised and gamified adaptive learning Dashboard

> Transform your learning journey with intelligent AI coaching, personalized quizzes, and adaptive learning paths.

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-FF6B6B?style=for-the-badge)](https://groq.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![YouTube API](https://img.shields.io/badge/YouTube%20API-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://developers.google.com/youtube)

---

## 📸 Features

### 🤖 **AI-Powered Learning**
- **Intelligent AI Coach** - Get personalized study tips and learning strategies powered by Groq's LLM
- **Smart Quiz Generation** - Auto-generate quizzes based on your subject with multiple difficulty levels
- **AI Analysis** - Detailed performance analysis and weak area identification after every quiz
- **Theory & Concepts** - Deep explanations for any topic with real-world examples

### 📚 **Comprehensive Learning Tools**
- **Interactive Quizzes** - Multiple choice questions with instant feedback and explanations
- **Performance Tracking** - Track scores, XP, and progress over time
- **YouTube Integration** - Curated educational videos for each topic
- **PDF Upload & Analysis** - Upload study materials and get AI-powered insights
- **Progress Dashboard** - Real-time statistics and analytics

### 👥 **User Management**
- **Secure Authentication** - Firebase Auth with email/password & Google Sign-in
- **User Profiles** - 4-tab customizable learning preferences and goals
- **Achievement Badges** - Earn rewards for milestones and progress
- **Learning Preferences** - Set difficulty level, learning style, and targets

### 🎨 **User Experience**
- **Beautiful UI** - Modern, responsive design with glassmorphism effects
- **Dark & Light Mode** - Toggle between themes for comfortable studying
- **Smooth Animations** - Engaging transitions and interactions
- **Mobile Responsive** - Perfect on desktop, tablet, and mobile devices

---

## 🚀 Live Demo

**Visit:** https://edubuddy-99cb5.web.app/

---

## 🛠️ Technologies Used

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **AI** | Groq API (llama-3.3-70b-versatile) |
| **APIs** | YouTube Data API v3 |
| **Hosting** | Firebase Hosting |
| **PDF Processing** | PDF.js Library |

---

## 📋 Getting Started

### Prerequisites

- Modern web browser
- Firebase project
- Groq API Key
- YouTube API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anandkr30-glitch/EDUBUDDY/edubuddy.git
   cd edubuddy
   ```

2. **Setup Firebase**
   - Go to Firebase Console
   - Create a new project
   - Enable Authentication (Email/Password, Google)
   - Create Firestore Database
   - Copy config and update `js/firebase.js`

3. **Get API Keys**
   - **Groq Key:** https://console.groq.com/keys
   - **YouTube Key:** https://console.cloud.google.com/

4. **Create .env file** (for local development)
   ```
   GROQ_API_KEY=your_groq_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

5. **Deploy to Firebase**
   ```bash
   firebase login
   firebase deploy --force
   ```

6. **Access your app**
   ```
   https://edubuddy-99cb5.web.app/
   ```

---

## 📁 Project Structure

```
edubuddy/
├── index.html              # Main landing page
├── auth.html               # Authentication page (Login/Signup)
├── dashboard.html          # Main dashboard
├── quiz.html               # Quiz interface
├── quiz_review.html        # Quiz review & AI analysis
├── profile.html            # User profile page
│
├── css/
│   └── style.css           # All styling (light/dark mode)
│
├── js/
│   ├── firebase.js         # Firebase configuration
│   ├── auth.js             # Authentication logic
│   ├── router.js           # Page routing
│   ├── dashboard.js        # Dashboard functionality
│   ├── quiz.js             # Quiz generation & logic
│   ├── review.js           # Quiz review & AI analysis
│   ├── ai.js               # AI coach & Groq integration
│   ├── profile.js          # User profile management
│   └── youtube.js          # YouTube video integration
│
├── assets/
│   └── hero.png            # Hero image
│
├── firebase.json           # Firebase configuration
├── .gitignore              # Git ignore rules
├── .env                    # Environment variables (local only)
└── README.md               # This file
```

---

## 🎯 Key Features Explained

### Quiz Generation
The AI generates personalized quiz questions based on:
- Topic selected by user
- Difficulty level (Easy, Medium, Hard)
- Number of questions (3, 5, 10, 15)
- Student's class and subject

Each question includes:
- Clear problem statement
- 4 multiple choice options
- Correct answer
- Detailed explanation

### Theory Generation
Get comprehensive explanations that include:
- Simple definition of the concept
- Key important ideas
- Real-world examples and analogies
- How it's used in practice
- Easy ways to remember

### Performance Tracking
Track your progress with:
- Quizzes completed count
- Current level (based on XP earned)
- Total XP accumulated
- Average score percentage
- Achievement badges

### User Profile (4 Tabs)
1. **Basic Info** - Personal details, contact information
2. **Academic Details** - School, class, board, subjects
3. **Learning Preferences** - Goals, learning style, difficulty level
4. **Goals & Progress** - Targets, achievements, personal notes

---

## 🔐 Security

### Implemented
- ✅ Firebase Authentication for user security
- ✅ Firestore Security Rules for data protection
- ✅ API key domain restrictions
- ✅ Environment variables for sensitive data
- ✅ `.gitignore` prevents accidental uploads

### API Protection
- **YouTube API** - Restricted to specific domain, YouTube Data API only
- **Groq API** - Kept in environment variables
- **Firebase Config** - Public by design (Firebase security rules protect data)

---

## 📊 How It Works

### User Flow
1. **Sign Up/Login** - Create account or login with Google
2. **Set Profile** - Fill learning preferences and goals
3. **Choose Topic** - Select what you want to learn
4. **Generate Quiz** - AI creates personalized questions
5. **Take Quiz** - Answer questions and get instant feedback
6. **Review Results** - See performance analysis and AI recommendations
7. **Learn More** - Watch YouTube videos, read theory, ask AI coach
8. **Track Progress** - Monitor your XP, level, and achievements

### AI Integration
- **Theory Generation** - Uses Groq's llama-3.3-70b-versatile model
- **Quiz Creation** - Generates questions with verified answers
- **Performance Analysis** - Identifies weak areas and suggests improvement
- **Personalization** - Adjusts based on student's level and preferences

---

## 🚀 Features Breakdown

### Quiz System
- **Dynamic Generation** - AI creates unique questions every time
- **Multiple Difficulty Levels** - Easy, Medium, Hard
- **Verified Answers** - AI ensures all answers are 100% correct
- **Detailed Explanations** - Learn why each answer is correct
- **Real-world Scenarios** - Questions based on practical applications

### Learning Customization
- **Difficulty Selection** - Choose your learning level
- **Subject Selection** - Study any topic
- **Learning Style** - Visual, Auditory, Reading/Writing, Kinesthetic
- **Target Setting** - Set score and level goals
- **Progress Monitoring** - Track improvement over time

### Video Integration
- **YouTube Search** - Find relevant educational videos
- **Instant Loading** - Videos load independently
- **Multiple Options** - Get 3 recommended videos per topic
- **HD Quality** - Full resolution video playback

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

MIT License allows you to:
- ✅ Use commercially
- ✅ Modify code
- ✅ Distribute
- ✅ Use privately

---

## 🐛 Bug Reports & Features

Found a bug? Have an idea?

1. Go to: `https://github.com/anandkr30-glitch/edubuddy/issues`
2. Click: **`New Issue`**
3. Describe: What's happening or what you want
4. Submit!

---

## 💬 Support

- **Email:** anandkr302005@example.com
- **GitHub:** anandkr30-glitch(https://github.com/anandkr30-glitch)
- **Website:** https://edubuddy-99cb5.web.app

---

## 🎓 Learning Resources

### Documentation
- [Firebase Docs](https://firebase.google.com/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [YouTube API](https://developers.google.com/youtube/v3)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

### Tutorials Used
- Firebase Authentication & Firestore
- REST API Integration
- Real-time Database Queries
- PDF Processing with PDF.js
- Voice Recognition & Synthesis

---

## 📈 Future Roadmap

### Coming Soon 🚀
- [ ] Mobile app (React Native)
- [ ] Video tutorials creation
- [ ] Peer learning (study groups)
- [ ] Leaderboard system
- [ ] Certification programs
- [ ] Advanced analytics
- [ ] Social sharing features
- [ ] Offline mode

### Planned Features 💡
- [ ] Voice-based learning
- [ ] AI tutoring sessions
- [ ] Custom curriculum builder
- [ ] Parent dashboard
- [ ] School integration
- [ ] Multilingual support
- [ ] Advanced notifications
- [ ] Achievement marketplace

---

## 🏆 Project Achievements

- ✅ Multi-page SPA with client-side routing
- ✅ Real-time Firestore integration
- ✅ AI-powered features with Groq API
- ✅ Complete user authentication system
- ✅ Responsive, mobile-first design
- ✅ Dark and light theme support
- ✅ Progress tracking and analytics
- ✅ PDF upload and analysis

---

## 🙏 Acknowledgments

Special thanks to:
- **Firebase** - For excellent backend infrastructure
- **Groq** - For powerful and fast LLM models
- **Google** - For YouTube API and Cloud services
- **Open Source Community** - For amazing tools and libraries
- **All Learners** - For inspiring this project

---

## 📞 Contact & Social

- **GitHub:** anandkr30-glitch/EDUBUDDY(https://github.com/anandkr30-glitch/EDUBUDDY)
- **LinkedIn:** www.linkedin.com/in/anand-k-devz

---

## 💝 Support This Project

If EduBuddy helped you learn better:

- ⭐ **Star this repository** - Shows your appreciation!
- 🔗 **Share with friends** - Help others discover it
- 🐛 **Report bugs** - Help improve quality
- 💡 **Suggest features** - Shape the future
- 📝 **Write reviews** - Share your experience

---

## 📄 License Notice

```
MIT License

Copyright (c) 2024 EduBuddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

### Made with ❤️ for Learners Everywhere

**⭐ If you find this helpful, please star the repository!**

[⬆ Back to Top](#-edubuddy---ai-powered-educational-platform)

</div>

---

## 🎯 Quick Links

| Link | Purpose |
|------|---------|
| 🚀 (https://edubuddy-99cb5.web.app/) | Visit the live application |
| 📚 [Features](#-features) | See what EduBuddy can do |
| 🛠️ [Tech Stack](#-technologies-used) | Technologies used |
| 🤝 [Contributing](#-contributing) | How to contribute |
| 📝 [License](#-license) | License information |

---

**Last Updated:** March 2024  
**Maintained by:** anandkr30-glitch/EDUBUDDY(https://github.com/anandkr30-glitch/EDUBUDDY)  
**Status:** ✅ Active Development

---

## 🎓 Educational Purpose

EduBuddy is designed for:
- 📚 School students (Classes 6-12)
- 🎯 Competitive exam preparation
- 💡 Self-paced learning
- 🔄 Continuous skill improvement
- 📊 Progress monitoring

**Perfect for:**
- CBSE, ICSE, State Board students
- Competitive exams (JEE, NEET, etc.)
- General knowledge enhancement
- Subject-specific mastery

---

**Thank you for using EduBuddy!** 🚀✨
