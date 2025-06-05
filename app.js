window.addEventListener("DOMContentLoaded", () => {
  window.Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  const track = document.querySelector(".carousel-track");
  const dots = document.querySelectorAll(".dot");

  let currentIndex = 0;
  let startX = 0;
  const loadedModels = {};

  function updatePosition(index) {
    track.style.transform = `translateX(-${index * 100}vw)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    const modelMap = {
      1: { id: "model1", path: "dom11.4.gltf" },
      2: { id: "model2", path: "depo8.gltf" },
      3: { id: "model3", path: "depo9.gltf" },
      4: { id: "model4", path: "pol11.gltf" },
    };

    if (modelMap[index] && !loadedModels[index]) {
      initViewer(modelMap[index].id, modelMap[index].path);
      loadedModels[index] = true;
    }
  }

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50 && currentIndex < 4) currentIndex++;
    else if (diff > 50 && currentIndex > 0) currentIndex--;
    updatePosition(currentIndex);
  });

  updatePosition(currentIndex);

  function initViewer(containerId, modelPath) {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === "undefined") {
      console.error("Three.js не загружен или контейнер не найден.");
      return;
    }

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
});
