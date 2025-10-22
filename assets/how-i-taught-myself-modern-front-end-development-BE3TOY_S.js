const e=`---
title: "How I Taught Myself Modern Front‑End Development"
slug: "how-i-taught-myself-modern-front-end-development"
date: "2025-07-19"
category: "Front End Development"
readTime: "5 min read"
excerpt: "The story of how I went beyond classroom basics to build a custom portfolio and a 3D maze game, learning modern tools and performance optimizations along the way."
---

**Tyler Mitton**  

*The story of how I went beyond the classroom basics to build a portfolio I’m proud of, and what I learned about performance, problem-solving, and learning to learn along the way.*

---

## Going Beyond the Basics

It all started in my Intro to Information Systems class. We were tasked with building a portfolio website, and while I enjoyed the process, I felt constrained by the tools. We were using simple HTML/CSS and Bootstrap templates, which are great for learning the fundamentals, but I felt the need to go beyond the basics. I wanted to create something truly custom and built with the modern technologies used in the industry today.

So, with the class complete and some free time on my hands, I set a challenge for myself: build a new portfolio from scratch using a professional-grade tech stack I had never touched before.

---

## Building the Foundation

I chose to build my website with **React.js** for its prevalent component-based structure, **TypeScript** for code reliability, and **Tailwind CSS** for complete design freedom, without (inevitably worse) custom CSS. To manage the development process, I used **Vite**, which is known for its incredible speed.

One of the most valuable parts of this initial phase was setting up a **CI/CD (Continuous Integration/Continuous Deployment) pipeline using GitHub Actions**. I wrote a script that automates the entire deployment process. Now, every time I push a commit to the \`main\` branch of my repository, GitHub Actions automatically triggers Vite to build the optimized, production-ready version of the site and deploys it from another branch. Creating this automation process was a huge learning experience and allows me to focus purely on development without worrying about the manual steps of getting it online.

With the workflow optimized, I was finally able to add the features I wanted:

- An integrated contact form so users could reach me quickly, without leaving my site
- A light/dark mode toggle, which I always love to see on the websites I visit
- A custom blog that maintains the same design language as the rest of the site and renders Markdown files as posts, so I don't always have to link to an external site

---

Want to see it for yourself?  
- [Visit the home page of my portfolio website](https://tylermitton.com)

---

## Putting My Skills to the Test with a Maze Game

![Maze Game Screenshot](/assets/Maze_Game_Screenshot.avif)

With the portfolio’s foundation in place, I wanted to add something that would allow me to learn more, showcase some new skills, and be fun. I decided to build a simple, explorable 3D maze game using **Three.js**. My first prototype was functional, but it had serious issues. It lagged horribly, and you could walk straight through walls. This project quickly became a powerful lesson in the Design Thinking process and the realities of web development. If you haven't read my [article on the design process,](https://tylermitton.com/Articles/the-process-of-design-thinking) you should know it consists of five steps:

1. **Empathize with the user**  

   This step was remarkably easy. I’m the only user.  

   Also, it didn’t take much to know what was wrong with it. It lagged terribly, you could walk through walls, and you would often get stuck in small boxes (although you could just walk out, it was clearly an issue for the future that the maze was never a perfect one). Those things were not great for the user experience, so I had to really define the problem.

2. **Defining the Performance Problem** 

   The first step was to figure out why such a simple, barebones 3D scene was so laggy. After research and consulting AI tools, I identified the culprits: I was rendering 1000 wall segments as separate objects, when I could be rendering 1 wall segment 1000 times.  

   In the mindset of performance optimizations, I noticed another inefficiency. The game was rendering all the walls within a certain radius; even those directly behind the player. This is a total waste.  

   Clearly defining those problems was a key step to brainstorming solutions.

3. **Ideating on Further Optimizations**  

   After reading the documentation, I found solutions to both. One solution was a built-in Three.js feature called **InstancedMesh**, which allows the game to render a single wall object 1,000 times for much improved performance. Implementing this dramatically reduced the draw calls to the graphics card and instantly fixed the lag.  

   The second solution is a common game development technique called **frustum culling**, which allows only the objects within the player’s camera view cone (the frustum) to be rendered. Once again, Three.js had a built-in method for this, and implementing it provided another significant performance boost. This taught me a valuable lesson: it’s always worth it to read the documentation for great tools.

4–5. **Prototyping and Testing: Collision Detection and a Perfect Maze Algorithm**  

   Of course, with each different feature update for the maze game, I went back to step one of the design thinking process, because it’s naturally iterative. I’ve chosen not to explain some of the steps because they’re less interesting, so I'll skip ahead to prototyping and testing the collision detection as well as the implementation of the **Depth-First Search** algorithm to ensure a perfect maze every time.  

   After the performance optimizations, the game was fast, but it still had obvious flaws—you could still walk through walls and get stuck in boxes. While implementing collision detection, I ran into a bizarre bug where players could walk through east-west walls but not north-south ones. The root cause was an embarrassing oversight… I had mistakenly applied the same north-south hitbox orientation to every single wall segment.  

   I got collision detection working, but when you ran into a wall, you came to a jarring, complete stop. I wanted a smoother experience. The solution was to implement **wall sliding**, where the horizontal component of the player’s movement vector is maintained after they collide with a wall to make them slide along the surface. This creates a much more fluid sense of motion.  

   The last major issue was that the maze itself used to be generated with a simple random algorithm, which created disconnected areas and multiple paths. After researching maze generation algorithms, I chose and implemented the **Depth-First Search** algorithm. This algorithm is efficient and creates the long, winding corridors that you see now. It guarantees a path from any one point to another: **a perfect maze.**

---

## The Process Is the Purpose

As of now, I think the maze game has reached its final state. I have:

1. Added support for mobile phones  
2. Fixed jumpy/glitchy camera movement in mouse mode with an input smoothing algorithm

The goal was never to create a complex game with objectives and rewards, but to build a simple, exploratory experience while tackling some classic development challenges. It acts as a testament to my development process: identifying problems, researching efficient solutions, and iterating until the user experience feels right.

Above all, this project taught me **how to learn**. Throughout this process, generative AI was a valuable tutor, teaching me things like how to use Vite, frustum culling, and maze algorithms.

This experience has solidified my passion for building things and, more importantly, has refined my process for learning how to build them well.

---

Want to see the maze game for yourself?  
- [Explore the maze game here](https://tylermitton.com/MazeGame/)
`;export{e as default};
