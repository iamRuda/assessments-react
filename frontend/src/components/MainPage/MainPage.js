import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Импортируйте useNavigate

const MainPage = () => {
  const navigate = useNavigate(); // Инициализация useNavigate

  return (
    <div className="bg-light text-dark">
      <header className="p-3 bg-white shadow-sm">
        <div className="container text-center">
          <h1 className="fw-bold">Добро пожаловать в систему тестирования!</h1>
          <p className="lead">Ваш надежный помощник в обучении и оценке знаний.</p>
        </div>
      </header>

      <section className="text-center py-5">
        <h2 className="display-5">Начните свое путешествие к успеху!</h2>
        <div className="d-grid gap-2 col-md-6 mx-auto mt-4">
          <button className="btn btn-info btn-lg" onClick={() => alert("Зарегистрироваться")}>
            Зарегистрироваться
          </button>
          <button 
            className="btn btn-outline-primary btn-lg" 
            onClick={() => navigate("/login")} // Используйте navigate для перехода на /login
          >
            Войти
          </button>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="pb-2 border-bottom">Почему выбирают нашу систему тестирования?</h2>
        <p className="fs-5">
          Наша система тестирования предлагает уникальный подход к обучению. Мы обеспечиваем
          простую и интуитивно понятную платформу, которая помогает вам:
        </p>
        <ul className="fs-5">
          <li>✅ Оценивать свои знания в различных предметах.</li>
          <li>✅ Получать обратную связь и рекомендации по улучшению.</li>
          <li>✅ Проходить тесты в любое время и в любом месте.</li>
          <li>✅ Участвовать в конкурсах и соревнованиях с другими пользователями.</li>
        </ul>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <h2 className="pb-2 text-center text-info">Наши преимущества</h2>
          <p className="fs-5 text-center">
            Мы предоставляем не только платформу для тестирования, но и дополнительные инструменты,
            которые делают процесс обучения более эффективным:
          </p>
          <ul className="list-unstyled text-center">
            <li>📝 Интерактивные тесты и задания.</li>
            <li>📈 Подробная аналитика и отчеты по результатам.</li>
            <li>🔔 Уведомления о новых тестах и обновлениях.</li>
            <li>🔒 Высокий уровень безопасности ваших данных.</li>
            <li>🤝 Поддержка сообщества и доступ к учебным материалам.</li>
          </ul>
        </div>
      </section>

      <footer className="d-flex justify-content-between align-items-center py-3 my-4 border-top bg-white">
        <div className="container">
          <p className="text-muted">© 2023 Система тестирования</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
