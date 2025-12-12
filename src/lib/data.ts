// export type TeamMember = {

//   id: string;
//   name: string;
//   role: string;
// };

// // export const teamMembers: // src/components/about/team.tsx (or src/lib/data.ts)

// export const teamMembers = [
//   {
//     name: 'Karan',
//     role: 'Developer',
//     githubUrl: 'https://github.com/KaranChakravarti', // Example GitHub URL
//     portfolioUrl: 'https://karan-portfolio.vercel.app', // Example Portfolio URL (use your actual URL)
//   },
//   {
//     name: 'Vidhyadhar',
//     role: 'Management',
//     githubUrl: 'https://github.com/NAVATHVIDYADHAR12/NutriGenius', // Example GitHub URL (from 2 hrs, 16 mins ago (2025-12-11 18:57:39))
//     portfolioUrl: 'https://nutrigenius.vercel.app', // Example Portfolio URL (from 2 hrs, 0 mins ago (2025-12-11 19:14:12))
//   },
//   // ... other team members with their respective URLs
//   {
//     name: 'Sangeetha',
//     role: 'Team Leader',
//     githubUrl: 'https://github.com/sangeetha0314', // Example
//     portfolioUrl: 'https://sangeetha-portfolio.vercel.app', // Example
//   },
//   {
//     name: 'Maheen',
//     role: 'Presentation',
//     githubUrl: 'https://github.com/maheen', // Example
//     portfolioUrl: 'https://maheen-portfolio.vercel.app', // Example
//   },
//   {
//     name: 'Ayaan',
//     role: 'Documentary',
//     githubUrl: 'https://github.com/ayaan', // Example
//     portfolioUrl: 'https://ayaan-portfolio.vercel.app', // Example
//   },
//   {
//     name: 'Ashish',
//     role: 'AI & Ideas',
//     githubUrl: 'https://github.com/Ashish173Vns', // Example (from 3 hrs, 43 mins ago (2025-12-11 17:31:13))
//     portfolioUrl: 'https://ashish-portfolio.vercel.app', // Example
//   },
//   {
//     name: 'Saleem',
//     role: 'Developer',
//     githubUrl: 'https://github.com/saleem', // Example
//     portfolioUrl: 'https://saleem-portfolio.vercel.app', // Example
//   },
// ];



// src/lib/data.ts (or src/lib/types.ts if you have a separate types file)

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  githubUrl?: string; // Add this line, making it optional
  portfolioUrl?: string; // Add this line, making it optional
};

// Now your teamMembers array will correctly match the updated TeamMember type.
export const teamMembers: TeamMember[] = [
  {
    id: 'karan', // You'll also need to add 'id' properties to your objects based on your type definition
    name: 'Karan',
    role: 'Developer',
    githubUrl: 'https://github.com/KaranChakravarti',
    portfolioUrl: 'https://karan-portfolio.vercel.app',
  },
  {
    id: 'vidhyadhar',
    name: 'Daniel',
    role: 'Documentary',
    githubUrl: 'https://github.com/NAVATHVIDYADHAR12',
    portfolioUrl: 'https://nutrigenius.vercel.app',
  },
  {
    id: 'sangeetha',
    name: 'Sangeetha',
    role: 'Team Leader',
    githubUrl: 'https://github.com/sangeetha0314',
    portfolioUrl: 'https://sangeetha-portfolio.vercel.app',
  },
  {
    id: 'maheen',
    name: 'Maheen',
    role: 'Presentation',
    githubUrl: 'https://github.com/fahamaheen-source',
    portfolioUrl: 'https://maheen-portfolio.vercel.app',
  },
  {
    id: 'ayaan',
    name: 'Ayaan',
    role: 'Documentary',
    githubUrl: 'https://github.com/rasoolayaan52-max',
    portfolioUrl: 'https://ayaan-portfolio.vercel.app',
  },
  {
    id: 'ashish',
    name: 'Ashish',
    role: 'AI & Ideas',
    githubUrl: 'https://github.com/Ashish173Vns',
    portfolioUrl: 'https://ashish-portfolio.vercel.app',
  },
  {
    id: 'saleem',
    name: 'Saleem',
    role: 'Team Management',
    githubUrl: 'https://github.com/saleem',
    portfolioUrl: 'https://saleem-portfolio.vercel.app',
  },
];