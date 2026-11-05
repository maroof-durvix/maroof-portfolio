import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  Layers,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  Trophy,
  UserCheck,
  X,
} from "lucide-react";
import {
  profile,
  about,
  stats,
  skills,
  services,
  experience,
  projects,
  archiveProjects,
} from "../data/portfolioData.js";

// Combine all 20 live systems & projects
const allProjects = [...projects, ...archiveProjects];

/**
 * Intelligent Multilingual Portfolio Brain
 * Processes queries in English, Roman Urdu, Urdu script, and Hindi.
 * Extracts intent and fetches verified data from local portfolio collections.
 */
function processQuery(input) {
  const raw = input.trim();
  const q = raw.toLowerCase();

  // Language Detection
  const isUrduScript = /[\u0600-\u06FF]/.test(raw);
  const isRomanUrdu =
    /\b(kya|hai|hain|kaise|kese|batao|bata|karo|bhai|bro|mujhe|apka|uska|maroof|konsa|konse|kitne|kitna|naam|karta|kaam|chahiye|in|bare|kahan|kaha|shukriya|acha|theek|bolo|rabta|paisa|pese|paise|fees|rate)\b/i.test(
      q
    );

  // 1. GREETINGS & INTRO
  if (/^(hi|hello|hey|salam|assalam|aoa|hola|namaste|sup|yo|kese ho|kaise ho)\b/i.test(q)) {
    if (isUrduScript) {
      return `وعلیکم السلام! میں معروف احمد درویش کا **DURVIX AI Assistant** ہوں۔ 
میں آپ کو معروف کے تمام **20 پراجیکٹس**، ایوارڈز (Contest-Azm 1st Place Gold Medal)، ٹیکنالوجیز (Flutter, React, .NET, Laravel)، اور ہائرنگ کے بارے میں مکمل معلومات دے سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟`;
    }
    if (isRomanUrdu) {
      return `Walaikum Assalam! Main Maroof Ahmed Durwesh ka official **DURVIX AI Assistant** hoon 🤖.
Main Maroof ke **20+ live systems**, National Award winning **Green Life** app, tech stack, aur freelance availability ke bare me sab janta hoon.

Aap mujh se projects, skills, CV, ya rabta (contact) ke bare me kuch bhi pooch sakte hain!`;
    }
    return `Hello! I am Maroof's official **DURVIX AI Assistant** 🤖.
I have complete intelligence on his **20+ engineered live systems**, award-winning cross-platform mobile apps, enterprise full-stack architecture, and global freelance availability.

How can I assist you with Maroof's work or hiring today?`;
  }

  // 2. CONTEST-AZM / AWARDS / GOLD MEDAL
  if (
    /contest-azm|azm|winner|award|gold medal|competition|inam|medal|trophy|first place|1st place/i.test(
      q
    )
  ) {
    if (isUrduScript) {
      return `🏆 **کونٹیسٹ عزم میں پہلی پوزیشن اور گولڈ میڈل!**

معروف احمد درویش نے نیشنل سافٹ ویئر انوویشن ڈیفنس مقابلے میں **Green Life** پراجیکٹ پیش کر کے **1st Place Gold Medal** جیتا:
- **پراجیکٹ:** **[Green Life](https://green-life-eco-portal.vercel.app/)** (کلائمیٹ سسٹین ایبلٹی موبائل ایپ)
- **ٹیکنالوجی:** Flutter, Dart, Firebase, Android Native Engine
- **لائیو ڈیمو:** [green-life-eco-portal.vercel.app](https://green-life-eco-portal.vercel.app/)
- **اینڈرائیڈ APK:** آپ براہ راست [GreenLife.apk](/GreenLife.apk) ڈاؤن لوڈ کر کے ٹیسٹ کر سکتے ہیں!`;
    }
    if (isRomanUrdu) {
      return `🏆 **1st Place Gold Winner — Contest-Azm!**

Maroof ne National Software Innovation Defense competition me **Green Life** project defend karke **1st Place Gold Medal** jeeta tha:
- **Project:** **[Green Life](https://green-life-eco-portal.vercel.app/)** (Eco-Sustainability Mobile App)
- **Tech Stack:** Flutter, Dart, Android APK, Firebase, Real-Time Eco Algorithms
- **Live Demo:** [green-life-eco-portal.vercel.app](https://green-life-eco-portal.vercel.app/)
- **Android APK:** Aap direct [Download GreenLife.apk](/GreenLife.apk) se install karke chala sakte hain!`;
    }
    return `🏆 **1st Place Gold Winner — Contest-Azm!**

Maroof secured the prestigious **1st Place Gold Medal** at the National Software Innovation Defense competition for engineering and defending:
- **Project:** **[Green Life](https://green-life-eco-portal.vercel.app/)** — a cross-platform eco-sustainability ecosystem.
- **Technologies:** Flutter, Dart, Firebase, Android Native Engine, Offline Caching.
- **Live Portal:** [green-life-eco-portal.vercel.app](https://green-life-eco-portal.vercel.app/)
- **Direct APK:** Verified Android package available directly at [Download GreenLife.apk](/GreenLife.apk)!`;
  }

  // 3. ABOUT MAROOF / WHO IS HE / DURVIX FOUNDER
  if (
    /who is|about maroof|background|bio|kon hai|kaun hai|koun hai|bare me batao|philosophy|durvix|intro/i.test(
      q
    )
  ) {
    if (isUrduScript) {
      return `👨‍💻 **معروف احمد درویش کے بارے میں:**

معروف ایک **Full-Stack Developer & Software Engineer** اور **DURVIX** کے بانی (Founder & Principal Engineer) ہیں:
- **تجربہ و پراجیکٹس:** 20+ لائیو ویب اور موبائل سسٹمز کامیابی سے ڈیپلائے کیے۔
- **اہم سنگ میل:** Contest-Azm 1st Place Gold Winner (Green Life App)۔
- **ماہرانہ مہارتیں:** Flutter, React, Angular 19, ASP.NET Core (.NET 8), PHP Laravel, Node.js, SQL Server, MySQL, Firebase۔
- **حالت:** نئے پراجیکٹس اور عالمی فری لانس کام کے لیے دستیاب ہیں (Open to Work & Freelance)۔`;
    }
    if (isRomanUrdu) {
      return `👨‍💻 **Maroof Ahmed Durwesh ke Bare Me:**

Maroof ek **Full-Stack Developer & Software Engineer** aur **DURVIX** ke Founder & Principal Engineer hain:
- **Track Record:** 20+ production-grade web systems aur mobile applications live deploy kiye hain.
- **Top Milestone:** Contest-Azm National Software Competition me 1st Place Gold Medal Winner!
- **Core Stacks:** Flutter, Dart, React, Angular 19, ASP.NET Core (.NET 8), C#, PHP (Laravel), Node.js, MySQL, SQL Server, Firebase.
- **Philosophy:** Clean code, high performance, enterprise architecture aur seamless user experience.
- **Availability:** **Open to Work & Freelance Projects** worldwide!`;
    }
    return `👨‍💻 **About Maroof Ahmed Durwesh:**

Maroof is a **Full-Stack Developer & Software Engineer** and the Founder & Principal Engineer at **DURVIX**:
- **Engineering Track Record:** Engineered and deployed **20+ production systems** spanning full-stack web, cross-platform Flutter mobile apps, and enterprise backends.
- **National Milestone:** 1st Place Gold Medal Winner at Contest-Azm for *Green Life*.
- **Specializations:** React, Angular 19, Flutter, C# (.NET Core / ASP.NET 8), PHP (Laravel), Node.js, SQL Server, MySQL, and Firebase.
- **Philosophy:** Precision engineering, enterprise-grade scalability, and clean code.
- **Current Status:** **Open to Work & Freelance Projects** worldwide!`;
  }

  // 4. CV / RESUME DOWNLOAD
  if (/cv|resume|bio data|biodata|document|pdf|download cv/i.test(q)) {
    if (isRomanUrdu) {
      return `📄 **Maroof Ka Verified Resume / CV:**

Aap Maroof ka updated official PDF resume yahan se direct download kar sakte hain:
👉 **[Download Maroof Ahmed Durwesh Resume (PDF)](/Maroof_Ahmed_Durwesh_Resume.pdf)**

Is me unke complete professional experience, education, award-winning projects aur technical certifications darj hain.`;
    }
    return `📄 **Official Resume / CV:**

You can download Maroof Ahmed Durwesh's updated technical resume directly:
👉 **[Download Maroof Ahmed Durwesh Resume (PDF)](/Maroof_Ahmed_Durwesh_Resume.pdf)**

It includes his full engineering timeline, production systems architecture, and Contest-Azm 1st place gold credential.`;
  }

  // 5. MOBILE APPS / FLUTTER / APK DOWNLOADS
  if (/mobile|apk|android|flutter|dart|app download|ios|kinetix|green life/i.test(q)) {
    // If specifically Kinetix
    if (q.includes("kinetix")) {
      return `💪 **Kinetix Fitness Tracker (Flutter Mobile App):**
Personalized workout routines, daily calorie tracking, hydration logs, and milestones.
- **Tech Stack:** Flutter, Dart, Android APK, SQLite, Firebase
- **Live Demo Web:** [kinetix-app-seven.vercel.app](https://kinetix-app-seven.vercel.app)
- **Direct APK:** [Download kinetix_fitness_app.apk](/kinetix_fitness_app.apk)
- **GitHub:** [github.com/maroof-durvix/kinetix-fitness-app](https://github.com/maroof-durvix/kinetix-fitness-app)`;
    }

    if (isRomanUrdu) {
      return `📱 **Maroof Ke Flutter Mobile Apps & Direct APKs:**

1. **[Green Life](https://green-life-eco-portal.vercel.app/)** *(Contest-Azm 1st Place Gold Winner)*
   - Eco-sustainability mobile ecosystem with offline caching & climate impact metrics.
   - 📥 **APK:** [Download GreenLife.apk](/GreenLife.apk)
   - 🌐 **Live Web:** [green-life-eco-portal.vercel.app](https://green-life-eco-portal.vercel.app/)

2. **[Kinetix Fitness Tracker](https://kinetix-app-seven.vercel.app)**
   - High-performance fitness companion with SQLite offline-first sync & workout logs.
   - 📥 **APK:** [Download kinetix_fitness_app.apk](/kinetix_fitness_app.apk)
   - 🌐 **Live Web:** [kinetix-app-seven.vercel.app](https://kinetix-app-seven.vercel.app)`;
    }

    return `📱 **Flutter Mobile Applications & Android APKs:**

1. **[Green Life](https://green-life-eco-portal.vercel.app/)** *(Contest-Azm 1st Place Gold Winner)*
   - Eco-sustainability cross-platform app featuring climate impact algorithms and offline caching.
   - 📥 **APK:** [Download GreenLife.apk](/GreenLife.apk)
   - 🌐 **Live:** [green-life-eco-portal.vercel.app](https://green-life-eco-portal.vercel.app/)

2. **[Kinetix Fitness Tracker](https://kinetix-app-seven.vercel.app)**
   - Offline-first workout companion with daily calorie tracking and hydration logging.
   - 📥 **APK:** [Download kinetix_fitness_app.apk](/kinetix_fitness_app.apk)
   - 🌐 **Live:** [kinetix-app-seven.vercel.app](https://kinetix-app-seven.vercel.app)`;
  }

  // 6. SERVICES OFFERED / WHAT CAN HE BUILD
  if (/service|services|kya kar sakte ho|kya bana sakte|offer|kya kaam|can you build|capabilities/i.test(q)) {
    if (isRomanUrdu) {
      return `🛠️ **Maroof Ki Core Services:**

1. 🌐 **Full-Stack Web Engineering:** React.js, Angular 19, Next.js, Tailwind CSS se responsive SaaS dashboards aur portals.
2. 📱 **Cross-Platform Mobile Apps:** Flutter & Dart se high-performance Android aur iOS apps, offline-first sync aur APK builds.
3. ⚙️ **Enterprise Backend & REST APIs:** C# ASP.NET Core (.NET 8), PHP Laravel, Node.js se secure high-throughput APIs.
4. 🗄️ **Database & Cloud DevOps:** SQL Server (SSMS), MySQL, MongoDB, Firebase, Vercel aur MonsterASP cloud deployments.`;
    }
    return `🛠️ **Engineering Services Offered:**

1. 🌐 **Full-Stack Web Engineering:** High-concurrency SaaS dashboards, e-commerce checkout engines, and portals with React, Angular 19, and Next.js.
2. 📱 **Cross-Platform Mobile Apps:** Native-feel Flutter & Dart apps with offline SQLite sync, biometric authentication, and production APKs.
3. ⚙️ **Enterprise Backend & REST APIs:** Robust server-side architecture in C# ASP.NET Core (.NET 8), PHP (Laravel), and Node.js.
4. 🗄️ **Databases & Cloud DevOps:** Relational schema design (MSSQL, MySQL, MongoDB), MonsterASP, IIS, and Vercel cloud deployments.`;
  }

  // 7. TECH STACK & SKILLS
  if (/skill|skills|tech|stack|language|framework|c#|\.net|node|react|angular|laravel|php|python|database|sql/i.test(q)) {
    if (isRomanUrdu) {
      return `⚡ **Maroof Ke Core Technical Stacks:**

- **Frontend & Mobile:** Flutter, Dart, React.js, Angular 19, JavaScript (ES6+), TypeScript, Tailwind CSS, HTML5/CSS3.
- **Backend & Systems:** C# (.NET 8 / ASP.NET Core), Node.js (Express), PHP (Laravel), Python, REST APIs, MVC Architecture.
- **Databases:** MySQL, Microsoft SQL Server (SSMS), SQLite, MongoDB, Firebase Firestore.
- **Cloud & Tooling:** Git, GitHub, Vercel, MonsterASP, InfinityFree, Postman, Vite.
- **Specialty:** Mobile packaging (verified APKs), offline caching, enterprise scalable architectures.`;
    }
    return `⚡ **Core Technical Stacks & Skills:**

- **Frontend & Mobile:** Flutter & Dart, React.js, Angular 19, Modern JavaScript (ES6+), TypeScript, Tailwind CSS.
- **Backend Engineering:** C# (.NET Core / ASP.NET 8), Node.js / Express.js, PHP / Laravel, Python, RESTful API architecture.
- **Databases & Storage:** Microsoft SQL Server (SSMS), MySQL, SQLite, MongoDB, Firebase Firestore.
- **Cloud & Tooling:** Git, GitHub, Vercel, MonsterASP, InfinityFree, Postman, Vite.
- **Packaging:** Production Android APK compilation and distribution.`;
  }

  // 8. CONTACT / HIRE / RATES / WHATSAPP / EMAIL
  if (/contact|hire|rabta|email|phone|whatsapp|call|freelance|reach|talk|start project|budget|rate|paisa|cost|fees/i.test(q)) {
    if (isUrduScript) {
      return `📬 **معروف سے براہ راست رابطہ کریں:**

معروف کسٹم سافٹ ویئر، موبائل ایپس اور کل وقتی پراجیکٹس کے لیے دستیاب ہیں:
- 📱 **واٹس ایپ:** [${profile.whatsappDisplay}](${profile.whatsappLink})
- ✉️ **ای میل:** [${profile.email}](mailto:${profile.email})
- 💼 **لنکڈ ان:** [LinkedIn Profile](${profile.linkedin})
- 💻 **گٹ ہب:** [GitHub Profile](${profile.github})
- 📄 **سی وی:** [Download PDF Resume](/Maroof_Ahmed_Durwesh_Resume.pdf)

آپ واٹس ایپ پر ایک کلک سے ڈائریکٹ میسج بھیج سکتے ہیں!`;
    }
    if (isRomanUrdu) {
      return `📬 **Maroof Se Direct Rabta Karein:**

Aap freelance projects, web/mobile development ya technical consultation ke liye direct contact kar sakte hain:
- 📱 **WhatsApp:** [${profile.whatsappDisplay}](${profile.whatsappLink})
- ✉️ **Email:** [${profile.email}](mailto:${profile.email})
- 💼 **LinkedIn:** [Maroof Ahmed Durwesh](${profile.linkedin})
- 💻 **GitHub:** [github.com/maroof-durvix](${profile.github})
- 📄 **Resume / CV:** [Download PDF CV](/Maroof_Ahmed_Durwesh_Resume.pdf)

*Aap isi waqt upar diye gaye WhatsApp link par click karke direct chat shuru kar sakte hain!*`;
    }
    return `📬 **Connect Directly with Maroof:**

Maroof is available for custom software development, technical consultation, and full-time engineering roles:
- 📱 **Direct WhatsApp:** [${profile.whatsappDisplay}](${profile.whatsappLink})
- ✉️ **Direct Email:** [${profile.email}](mailto:${profile.email})
- 💼 **LinkedIn:** [Maroof Ahmed Durwesh](${profile.linkedin})
- 💻 **GitHub:** [github.com/maroof-durvix](${profile.github})
- 📄 **Official Resume:** [Download Verified PDF CV](/Maroof_Ahmed_Durwesh_Resume.pdf)

*Click the WhatsApp link above to initiate an instant direct brief!*`;
  }

  // 9. DYNAMIC SEARCH ACROSS ALL 20 PROJECTS
  // Check exact project names, aliases, categories or keywords
  for (const p of allProjects) {
    const titleLower = p.title.toLowerCase();
    const catLower = p.category.toLowerCase();
    const tagsLower = p.tags.join(" ").toLowerCase();

    // Check if query matches project title or key words of the project
    const titleTokens = titleLower.split(/\s+/).filter((t) => t.length > 3);
    const matchesTitle = titleTokens.some((tok) => q.includes(tok));
    const exactNameMatch = q.includes(titleLower);

    if (exactNameMatch || (matchesTitle && (q.includes("project") || q.includes("app") || q.includes("portal") || q.includes("batao") || q.includes("link") || q.includes("what is")))) {
      return formatSingleProject(p, isRomanUrdu);
    }
  }

  // Check specific domain / category queries
  if (/e-commerce|ecommerce|shop|store|cart/i.test(q)) {
    const matches = allProjects.filter(
      (p) =>
        p.category.toLowerCase().includes("commerce") ||
        p.category.toLowerCase().includes("retail") ||
        p.title.toLowerCase().includes("scooply") ||
        p.title.toLowerCase().includes("beshopable") ||
        p.title.toLowerCase().includes("luxe")
    );
    return formatProjectList(
      "🛒 E-Commerce & Retail Systems",
      matches,
      isRomanUrdu
    );
  }

  if (/real estate|property|houses|estate/i.test(q)) {
    const matches = allProjects.filter(
      (p) =>
        p.title.toLowerCase().includes("estates") ||
        p.title.toLowerCase().includes("apexluxe")
    );
    return formatProjectList("🏢 Real Estate Platforms", matches, isRomanUrdu);
  }

  if (/ai |artificial intelligence|studio|prompt/i.test(q)) {
    const matches = allProjects.filter(
      (p) =>
        p.filterGroup === "ai" ||
        p.title.toLowerCase().includes("decorai") ||
        p.title.toLowerCase().includes("prompt") ||
        p.title.toLowerCase().includes("nexus")
    );
    return formatProjectList("🤖 AI & Intelligent Tools", matches, isRomanUrdu);
  }

  if (/logistics|courier|parcel|delivery/i.test(q)) {
    const p = allProjects.find((x) => x.title.toLowerCase().includes("parcelpulse"));
    return formatSingleProject(p, isRomanUrdu);
  }

  if (/culinary|food|restaurant|ice cream|dessert|cooking/i.test(q)) {
    const matches = allProjects.filter(
      (p) =>
        p.title.toLowerCase().includes("jamesthew") ||
        p.title.toLowerCase().includes("scooply") ||
        p.title.toLowerCase().includes("restaurant")
    );
    return formatProjectList("🍽️ Culinary & Food Systems", matches, isRomanUrdu);
  }

  if (/education|school|lms|academy|learning|english/i.test(q)) {
    const matches = allProjects.filter(
      (p) =>
        p.title.toLowerCase().includes("english") ||
        p.title.toLowerCase().includes("edumanage")
    );
    return formatProjectList("🎓 EdTech & Learning Platforms", matches, isRomanUrdu);
  }

  if (/health|hospital|doctor|care/i.test(q)) {
    const p = allProjects.find((x) => x.title.toLowerCase().includes("carepulse"));
    if (p) return formatSingleProject(p, isRomanUrdu);
  }

  if (/solar|energy|green/i.test(q)) {
    const matches = allProjects.filter(
      (p) =>
        p.title.toLowerCase().includes("green life") ||
        p.title.toLowerCase().includes("solarplex")
    );
    return formatProjectList("🌱 CleanTech & Sustainability Systems", matches, isRomanUrdu);
  }

  // 10. ALL PROJECTS OVERVIEW (COUNT / LIST)
  if (/project|projects|kitne|list|show all|work|portfolio|systems/i.test(q)) {
    if (isRomanUrdu) {
      return `🚀 **Maroof Ke Top Systems (Total 20 Live Systems):**

1. **[Green Life](https://green-life-eco-portal.vercel.app/)** — 🏆 Contest-Azm Gold Winner (Flutter)
2. **[JamesThew Culinary Academy](http://jamesthew.tryasp.net/)** — ASP.NET Core & C# MVC
3. **[Scooply Artisan Creamery](http://scooply-icecream.runasp.net/)** — Angular 19 & ASP.NET Core API
4. **[ParcelPulse Logistics](https://parcelpulse.infinityfreeapp.com/)** — PHP 8.2 & MySQL Courier
5. **[DURVIX Estates](https://durvix-estates.vercel.app)** — Luxury Real Estate Web Engine
6. **[English with MHS](https://www.englishwithmhs.com/)** — Full-Featured LMS Platform
7. **[Kinetix Fitness Tracker](https://kinetix-app-seven.vercel.app)** — Flutter Android App (APK Available)
8. **[DecorAI Interior Studio](https://decorai-xi.vercel.app/)** — AI Generative Spatial Studio
9. **[ApexLuxe Real Estate](https://apexluxe-real-state.vercel.app/)** — Architectural Luxury Portal
10. **[SolarPlex Energy](https://solarplex.vercel.app/)** — CleanTech Solar Platform

*Website par "Explore All 20 Projects Archive" button se aap tamam categorized projects dekh sakte hain!*`;
    }
    return `🚀 **Maroof's Engineered Systems (Total 20 Production Deployments):**

1. **[Green Life](https://green-life-eco-portal.vercel.app/)** — 🏆 Contest-Azm Gold Winner (Flutter & Dart)
2. **[JamesThew Culinary Academy](http://jamesthew.tryasp.net/)** — ASP.NET Core, C#, SQL Server
3. **[Scooply Artisan Creamery](http://scooply-icecream.runasp.net/)** — Angular 19 & ASP.NET Core 8 API
4. **[ParcelPulse Logistics](https://parcelpulse.infinityfreeapp.com/)** — PHP 8.2 & MySQL Courier Management
5. **[DURVIX Estates](https://durvix-estates.vercel.app)** — Luxury Real Estate Web Ecosystem
6. **[English with MHS LMS](https://www.englishwithmhs.com/)** — Interactive Language Learning Platform
7. **[Kinetix Fitness Tracker](https://kinetix-app-seven.vercel.app)** — Offline-First Flutter Android App
8. **[DecorAI Interior Studio](https://decorai-xi.vercel.app/)** — Generative AI Room Decorator
9. **[ApexLuxe Real Estate](https://apexluxe-real-state.vercel.app/)** — Bespoke Luxury Architecture Portal
10. **[SolarPlex Energy](https://solarplex.vercel.app/)** — Rooftop Solar Yield & CleanTech Calculator

*Click "Explore All 20 Projects Archive" on the site to inspect the full categorized portfolio.*`;
  }

  // 11. GENERAL / SMART ASSISTANT FALLBACK
  if (isUrduScript) {
    return `میں معروف احمد درویش کے تمام **20 سسٹمز**، ایوارڈز، اور مہارتوں سے باخبر ہوں۔ آپ مجھ سے پوچھ سکتے ہیں:
- 🏆 *"کونٹیسٹ عزم گولڈ میڈل پراجیکٹ کے بارے میں بتائیں"*
- ⚡ *"معروف کو کونسی ٹیکنالوجیز آتی ہیں؟"*
- 📱 *"اینڈرائیڈ APK ڈاؤن لوڈ لنکس"*
- 💼 *"معروف کو ہائر یا رابطہ کیسے کریں؟"*
- 🌐 *"کسی بھی مخصوص پراجیکٹ (جیسے Green Life, Scooply, ParcelPulse) کی تفصیلات"*`;
  }

  if (isRomanUrdu) {
    return `Main Maroof ke tamam **20 projects**, technical skills, aur Contest-Azm award ke bare me sab janta hoon. Aap mujh se pooch sakte hain:
- 🏆 *"Contest-Azm winning project ke bare me batao"*
- ⚡ *"Konsi technologies aur backend frameworks aate hain?"*
- 📱 *"Flutter apps aur APK download links do"*
- 💼 *"Maroof ko hire ya contact kaise karein?"*
- 🌐 *"Koi khas project (jaise Scooply, JamesThew, ParcelPulse, Kinetix) ke bare me"*`;
  }

  return `I have complete verified intelligence on Maroof's 20 engineered systems, awards, and technical stacks. Try asking:
- 🏆 *"Tell me about his Contest-Azm 1st place gold winning project"*
- ⚡ *"What are his strongest backend and frontend stacks?"*
- 📱 *"Show his Flutter mobile apps with APK download files"*
- 💼 *"How can I hire Maroof or start a project?"*
- 🌐 *"Tell me about JamesThew, Scooply, or ParcelPulse"*`;
}

/**
 * Format a single project cleanly with live link, repo, and APK if available
 */
function formatSingleProject(p, isRomanUrdu) {
  if (!p) return "Project not found in archive.";
  const apkLine = p.apkUrl ? `\n- 📥 **Android APK:** [Download ${p.downloadFileName || "APK"}](${p.apkUrl})` : "";
  const liveLine = p.liveUrl ? `\n- 🌐 **Live Demo:** [${p.liveUrl}](${p.liveUrl})` : "";
  const gitLine = p.githubUrl ? `\n- 💻 **GitHub:** [Repository Link](${p.githubUrl})` : "";

  return `🚀 **${p.title}** (${p.badge || p.category}):
${p.description}

- **Tech Stack:** ${p.tags.join(", ")}${liveLine}${apkLine}${gitLine}`;
}

/**
 * Format a list of matching projects
 */
function formatProjectList(title, list, isRomanUrdu) {
  if (!list.length) return "No matching projects found.";
  const items = list
    .slice(0, 4)
    .map(
      (p) =>
        `- **[${p.title}](${p.liveUrl})** — ${p.tags.slice(0, 3).join(", ")} (${p.badge || p.category})`
    )
    .join("\n");

  return `${title}:\n\n${items}\n\n*Aap kisi bhi project ka naam likh kar uski mukammal details pooch sakte hain!*`;
}

export default function DurvixAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I am Maroof's **DURVIX AI Assistant** 🤖.\n\nI can answer anything about his **20+ live systems**, award-winning Flutter apps, full-stack architecture, and availability. \n\n*Aap mujh se English, Roman Urdu, ya Urdu me kisi bhi project ya skill ke bare me pooch sakte hain!*",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Natural assistant formulating response delay
    setTimeout(() => {
      const responseText = processQuery(query);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 420);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { label: "🏆 Contest-Azm Winner", prompt: "Tell me about his Contest-Azm 1st place winning project" },
    { label: "⚡ Core Tech Stack", prompt: "What are Maroof's strongest technical stacks and skills?" },
    { label: "📱 Flutter Apps & APK", prompt: "Show his mobile apps and APK download files" },
    { label: "💼 Hire Maroof", prompt: "How can I hire Maroof or start a project?" },
  ];

  return (
    <aside aria-label="DURVIX AI Assistant" className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {/* ================= Trigger Floating Pill Button ================= */}
      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 rounded-full border border-brand-orange/60 bg-black/90 px-4 py-3 text-xs font-bold text-white shadow-2xl shadow-black/95 backdrop-blur-xl transition hover:border-brand-orange hover:bg-black hover:shadow-[0_0_35px_rgba(255,122,26,0.4)]"
        >
          {/* Glowing Animated AI Aura Dot */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-orange" />
          </span>

          <Sparkles size={16} className="text-brand-orange animate-pulse" />

          <span className="tracking-wide flex items-center gap-1.5">
            <span className="text-brand-orange font-mono font-black">DURVIX</span>
            <span>AI Assistant</span>
          </span>
        </motion.button>
      )}

      {/* ================= Interactive AI Chat Box Drawer ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col w-[92vw] sm:w-[420px] h-[570px] max-h-[82vh] rounded-3xl border border-white/15 bg-[#090D16]/95 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#07090F] px-4 sm:px-5">
              <div className="flex items-center gap-2.5">
                <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-brand-orange/50 bg-brand-orange/15 text-brand-orange shadow-[0_0_15px_rgba(255,122,26,0.25)]">
                  <Bot size={20} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-black" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-tight text-white font-mono">DURVIX AI</span>
                    <span className="rounded-full bg-brand-orange/15 px-1.5 py-0.2 text-[9px] font-bold text-brand-orange">
                      v2.5
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Portfolio Intelligence • Multilingual</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Direct WhatsApp Quick Shortcut */}
                <a
                  href={profile.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Direct WhatsApp with Maroof"
                  className="grid h-8 w-8 place-items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500 hover:text-ink"
                >
                  <MessageCircle size={15} />
                </a>

                {/* Reset Chat */}
                <button
                  type="button"
                  onClick={() =>
                    setMessages([
                      {
                        id: `reset-${Date.now()}`,
                        sender: "ai",
                        text: "Chat refreshed. How can I assist you with Maroof's work or skills?",
                        time: "Just now",
                      },
                    ])
                  }
                  title="Clear chat"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw size={13} />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-brand-orange hover:text-ink active:scale-95"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Quick Prompt Pills Bar */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 bg-black/40 px-3 py-2 scrollbar-none">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-zinc-300 transition hover:border-brand-orange/50 hover:bg-white/[0.08] hover:text-brand-orange active:scale-95"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap break-words ${
                      m.sender === "user"
                        ? "bg-brand-orange text-ink font-semibold shadow-[0_4px_16px_rgba(255,122,26,0.25)] rounded-tr-sm"
                        : "border border-white/10 bg-[#0F1320] text-zinc-200 rounded-tl-sm shadow-md"
                    }`}
                  >
                    {/* Render message with parsed markdown links cleanly */}
                    <MessageContent text={m.text} isUser={m.sender === "user"} />
                  </div>
                  <span className="mt-1 px-1 text-[9px] text-zinc-500 font-mono">{m.time}</span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#0F1320] px-3.5 py-2.5 w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-bounce [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-bounce [animation-delay:0.3s]" />
                  <span className="ml-1 text-[10px] font-mono text-zinc-400">DURVIX AI formulating...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-white/10 bg-[#07090F] p-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-1.5 shadow-inner focus-within:border-brand-orange/60 transition">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask in English, Roman Urdu or Urdu..."
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-orange text-ink transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={13} />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1 text-[9px] text-zinc-500 font-mono">
                <span>DURVIX Assistant • 20+ Systems Loaded</span>
                <span>Press Enter ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

/**
 * Message Content renderer: turns markdown links [text](url) into clickable anchor pills
 */
function MessageContent({ text, isUser }) {
  if (isUser) return <span>{text}</span>;

  // Split by [label](url)
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    const isApkOrPdf = url.endsWith(".apk") || url.endsWith(".pdf");

    parts.push(
      <a
        key={`${url}-${match.index}`}
        href={url}
        target={url.startsWith("http") ? "_blank" : undefined}
        download={isApkOrPdf ? true : undefined}
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-bold text-brand-orange underline underline-offset-2 hover:text-white transition"
      >
        <span>{label}</span>
        {isApkOrPdf ? <Download size={11} className="inline" /> : <ArrowUpRight size={11} className="inline" />}
      </a>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <span>
      {parts.map((part, idx) =>
        typeof part === "string" ? (
          <span key={idx}>{formatBold(part)}</span>
        ) : (
          part
        )
      )}
    </span>
  );
}

function formatBold(str) {
  // Simple bold parser for **bold** text
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const pieces = [];
  let lastIdx = 0;
  let m;

  while ((m = boldRegex.exec(str)) !== null) {
    if (m.index > lastIdx) {
      pieces.push(str.substring(lastIdx, m.index));
    }
    pieces.push(
      <strong key={m.index} className="font-extrabold text-white">
        {m[1]}
      </strong>
    );
    lastIdx = boldRegex.lastIndex;
  }
  if (lastIdx < str.length) {
    pieces.push(str.substring(lastIdx));
  }
  return pieces;
}
