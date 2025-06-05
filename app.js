const track = document.querySelector(".carousel-track");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;
let startX = 0;

window.Telegram.WebApp.ready();
Telegram.WebApp.expand();

function updatePosition() {
  track.style.transform = `translateX(-${currentIndex * 100}vw)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].clientX - startX;
  if (diff < -50 && currentIndex < 4) currentIndex++;
  else if (diff > 50 && currentIndex > 0) currentIndex--;
  updatePosition();
});

updatePosition();
