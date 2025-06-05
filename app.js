window.Telegram.WebApp.ready();
Telegram.WebApp.expand();

const track = document.querySelector(".carousel-track");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;
let startX = 0;
let isDragging = false;

// Обновление позиции и точек
function updatePosition(index) {
  track.style.transition = "transform 0.2s ease-out";
  track.style.transform = `translateX(-${index * 100}vw)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Обработка свайпа
track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  const diff = e.changedTouches[0].clientX - startX;
  if (diff < -50 && currentIndex < 4) currentIndex++;
  else if (diff > 50 && currentIndex > 0) currentIndex--;
  updatePosition(currentIndex);
  isDragging = false;
});

updatePosition(currentIndex);

// === Загрузка 3D моделей ===

function initViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, (gltf) => {
    const model = gltf.scene;
    model.scale.set(1.5, 1.5, 1.5);
    scene.add(model);
    camera.position.set(0, 1.5, 5);

    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();
  }, undefined, (error) => {
    console.error(`Ошибка загрузки модели ${modelPath}:`, error);
  });
}

// Загружаем модели (названия файлов — точно как на GitHub!)
initViewer("model1", "dom11.4.gltf");
initViewer("model2", "depo8.gltf");
initViewer("model3", "depo9.gltf");
initViewer("model4", "pol11.gltf");
