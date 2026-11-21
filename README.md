# Snake — Tiny Arcade

A small, no-build Snake game made with plain HTML, CSS, and JavaScript. It runs in a browser and can be hosted for free with GitHub Pages.

## Play on your computer

Open `index.html` in a browser. Use the arrow keys or WASD to move. On a phone, use the on-screen arrows. Press Space to pause or resume.

## Publish it with GitHub Pages

1. Create a new, empty repository on GitHub (for example, `snake-game`). Do not add a README or other files when creating it.
2. Open a terminal in this `snake-for-you` folder.
3. Run these commands, replacing `YOUR-USERNAME` with your GitHub username:

   ```powershell
   git init -b main
   git add .
   git commit -m "Create Snake game website"
   git remote add origin https://github.com/YOUR-USERNAME/snake-game.git
   git push -u origin main
   ```

4. On GitHub, open the repository's **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
5. Open the **Actions** tab. The included workflow will publish the site; when it finishes, GitHub will show the website URL in the Pages settings.

After that, each push to `main` automatically republishes the site. The game itself is static, so it does not need a server or API keys.
