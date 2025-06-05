window.addEventListener("DOMContentLoaded", () => {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  const track = document.querySelector(".carousel-track");
  const dots = document.querySelectorAll(".dot");

  let currentIndex = 0;
  let startX = 0;
  const loadedModels = {};

  const modelMap = {
    1: {
      id: "model1",
      path: "https://cdn.jsdelivr.net/gh/alinaparhom/BimMaxPro@main/dom11.4.gltf"
    },
    2: {
      id: "model2",
      path: "https://cdn.jsdelivr.net/gh/alinaparhom/BimMaxPro@main/depo8.gltf"
    },
    3: {
      id: "model3",
      path: "https://cdn.jsdelivr.net/gh/alinaparhom/BimMaxPro@main/depo9.gltf"
    },
    4: {
      id: "model4",
      path: "https://cdn.jsdelivr.net/gh/alinaparhom/BimMaxPro@main/pol11.gltf"
    }
  };

  function updatePosition(index) {
    track.style.transform = `translateX(-${index * 100}vw)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

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
    if (!container || typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") {
      console.error("Three.js или GLTFLoader не загружены или контейнер не найден:", containerId);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 160, 200); // поднята и отдалена камера
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.y = -1.5;

        scene.add(model);

        function animate() {
          requestAnimationFrame(animate);
          model.rotation.y += 0.005;
          renderer.render(scene, camera);
        }

        animate();
      },
      undefined,
      (error) => {
        console.error(`Ошибка загрузки модели ${modelPath}:`, error);
      }
    );
  }
});
