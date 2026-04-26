import { fetchCarouselData, normalizeAssetPath } from "./api.js";

export async function initCarousel() {
  const carousel = document.querySelector(".carousel");
  const slideContainer = document.querySelector(".slide");
  const indicatorsContainer = document.getElementById("indicators-container");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");

  if (!carousel || !slideContainer || !indicatorsContainer) return;

  let currentIndex = 0;
  let images = [];
  let autoplayInterval = null;
  let animationState = "cargando";

  try {
    images = await fetchCarouselData();
  } catch (error) {
    console.error("Error cargando el carrusel:", error);
    return;
  }

  if (!Array.isArray(images) || !images.length) return;

  function applyBarAnimation(type) {
    const activeBar = indicatorsContainer.querySelector(".bar.active");
    if (!activeBar) return;

    activeBar.style.animation = "";
    activeBar.classList.remove("cargando", "descargando");
    void activeBar.offsetWidth;
    activeBar.classList.add(type);
    activeBar.style.animationPlayState = "running";
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }

    const activeBar = indicatorsContainer.querySelector(".bar.active");
    if (activeBar) {
      activeBar.style.animationPlayState = "paused";
    }
  }

  function updateCarousel() {
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    const currentItem = images[currentIndex];

    const previousUrl = normalizeAssetPath(images[previousIndex].url, "");
    const currentUrl = normalizeAssetPath(currentItem.url, "");
    const nextUrl = normalizeAssetPath(images[nextIndex].url, "");
    const buttonHtml =
      currentItem.boton_texto && currentItem.link
        ? `<a href="${currentItem.link}" class="caption-button">${currentItem.boton_texto}</a>`
        : "";

    slideContainer.innerHTML = `
      <img src="${previousUrl}" class="img-side" alt="anterior">
      <div class="main-wrapper">
        <img src="${currentUrl}" id="carousel-img" class="img-main" alt="${currentItem.alt || ""}">
        <div class="carousel-caption">
          <h2 class="caption-text">${currentItem.titulo || ""}</h2>
          ${buttonHtml}
        </div>
      </div>
      <img src="${nextUrl}" class="img-side" alt="siguiente">
    `;

    void slideContainer.offsetWidth;

    const bars = indicatorsContainer.querySelectorAll(".bar");
    bars.forEach((bar, index) => {
      bar.classList.toggle("active", index === currentIndex);
    });

    const animatedElements = [
      slideContainer.querySelector(".img-main"),
      slideContainer.querySelector(".img-side:first-child"),
      slideContainer.querySelector(".img-side:last-child"),
    ];

    animatedElements.forEach((element) => {
      if (element) {
        element.style.animation =
          "slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards";
      }
    });

    const caption = slideContainer.querySelector(".carousel-caption");
    if (caption) {
      caption.style.animation = "fadeInUp 0.6s ease-out 0.3s both";
    }

    applyBarAnimation("cargando");
  }

  function startAutoplay() {
    stopAutoplay();
    animationState = "cargando";
    applyBarAnimation(animationState);

    autoplayInterval = window.setInterval(() => {
      if (animationState === "cargando") {
        animationState = "descargando";
        applyBarAnimation(animationState);
        return;
      }

      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
      animationState = "cargando";
    }, 1500);
  }

  function jumpTo(index) {
    stopAutoplay();
    currentIndex = index;
    updateCarousel();
    window.setTimeout(startAutoplay, 100);
  }

  indicatorsContainer.innerHTML = "";
  images.forEach((_, index) => {
    const bar = document.createElement("span");
    bar.className = index === 0 ? "bar active" : "bar";
    bar.addEventListener("click", () => jumpTo(index));
    indicatorsContainer.appendChild(bar);
  });

  rightArrow?.addEventListener("click", () => {
    jumpTo((currentIndex + 1) % images.length);
  });

  leftArrow?.addEventListener("click", () => {
    jumpTo((currentIndex - 1 + images.length) % images.length);
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  updateCarousel();
  startAutoplay();
}
