window.Telegram.WebApp.ready();
Telegram.WebApp.expand(); // Разворачивает окно

// Запрос к backend API
fetch("http://localhost:8000/userdata")
  .then((response) => response.json())
  .then((data) => {
    // Создаём HTML с полученными данными
    const userHTML = `
      <h2>Пользователь: ${data.name}</h2>
      <p>Баланс: ${data.balance} ₽</p>
      <p>Премиум: ${data.premium ? "Да" : "Нет"}</p>
    `;
    document.body.innerHTML += userHTML;
  })
  .catch((error) => {
    console.error("Ошибка при получении данных:", error);
    document.body.innerHTML += "<p style='color:red;'>Ошибка загрузки данных</p>";
  });
