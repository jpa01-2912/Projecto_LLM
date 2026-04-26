import { enhanceLoggedUserGreeting } from "./auth-ui.js";
import { initCarousel } from "./carousel.js";
import { initDropdown } from "./dropdown.js";
import { initGames } from "./games.js";
import { initNews } from "./news.js";
import { initStore } from "./store.js";

document.addEventListener("DOMContentLoaded", async () => {
  initDropdown();
  enhanceLoggedUserGreeting();

  await Promise.all([
    initCarousel(),
    initNews(),
    initGames(),
    initStore(),
  ]);
});
