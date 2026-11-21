# My Portfolio 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=yellow)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

## What is this?

my portfolio is designed to showcase my career history, skill sets, and more.

View the [site](https://pratiksinghlad.github.io/).

**This portfolio code is free to use, and no attribution is required.** You can fork or download this repository to customize it for your own use. Please don't forget to leave a ⭐ if you like this portfolio!

![screenshot](/public/images/screenshot.jpg)

## Features

✅ Open source (free to use, no attribution required)  
✅ Built with Vite for lightning-fast development  
✅ Responsive design & mobile-friendly  
✅ TypeScript checking and Prettier formatting  
✅ Static site published to GitHub Pages

## Quick Setup

1. Ensure you have [Node.js](https://nodejs.org/) 22 or newer installed. Check your installation by running:

   ```bash
   node -v
   ```

2. In the project directory, install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view the app in the browser.

5. Customize the template by navigating to the `/src/components` directory. Modify texts, pictures, and other information as needed.

The page will automatically reload when you make changes. Prettier formats the code on save.

## Deployment

Pushes to `main` build the site and publish the `build` folder to the `gh-pages` branch. GitHub Pages serves that branch, and its CDN compresses the HTML, CSS, and JavaScript on the way to the browser.

Pull requests run the same lint and build without deploying.

## Continuous Integration/Continuous Deployment

This project uses GitHub Actions for CI/CD:

### Automated Workflows

1. **Build Verification**

   - Runs on every push and pull request to the main branch
   - Installs dependencies from the lockfile with Node.js 22
   - Lints and builds the static site
   - Uploads a compressed build artifact on pushes to main

2. **Deploy**
   - Publishes that artifact to the `gh-pages` branch as one orphan commit
   - Skips Jekyll so GitHub Pages serves the files as a static site

### Status Badges

![Build Status](https://github.com/pratiksinghlad/pratiksinghlad.github.io/actions/workflows/build.yml/badge.svg)

## Code Quality and Development Tools

### TypeScript and Prettier

- **TypeScript**: The build fails when types, function length, or naming rules fail
- **Prettier**: Formats code on save
- **VS Code Integration**: Works with the settings in this repository

### Development Server

The project uses Vite as the development server, offering:

### VS Code Configuration

The repository includes optimized VS Code settings for:

- Automatic code formatting on save
- TypeScript integration
- Recommended extensions

You don't need to configure anything - it works out of the box!
