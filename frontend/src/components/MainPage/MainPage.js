import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Paper, Typography, Container } from "@mui/material";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light text-dark">
      {/* Image Header with Gradient Effect */}
      <div className="image-header">
        <div className="text-center text-black" style={{ padding: '80px 0' }}>
          <Typography variant="h2" component="h1">Добро пожаловать в систему тестирования!</Typography>
          <Typography variant="h5" component="p">Ваш надежный помощник в обучении и оценке знаний.</Typography>
        </div>
      </div>

      <Container maxWidth="sm" style={{ marginTop: '-70px', position: 'relative', zIndex: 2 }}>
        {/* Registration Form Box */}
        <Paper elevation={3} className="registration-form">
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Зарегистрироваться
          </Typography>
          <TextField fullWidth label="Имя" margin="normal" variant="outlined" />
          <TextField fullWidth label="Email" margin="normal" variant="outlined" />
          <TextField fullWidth label="Пароль" type="password" margin="normal" variant="outlined" />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '15px' }}
            onClick={() => navigate("/registration")}
          >
            Зарегистрироваться
          </Button>
          {/* Войти Button Inside the Form */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ marginTop: '10px' }}
            onClick={() => navigate("/login")}
          >
            Войти
          </Button>
        </Paper>
      </Container>

      <div className="security-testing-info">
        <p>
          Системы тестирования безопасности на производстве играют критически важную роль в обеспечении 
          защиты оборудования и производственных процессов. Эти системы направлены на выявление 
          уязвимостей и проверку эффективности различных мер безопасности. Регулярные тестирования 
          позволяют своевременно обнаруживать потенциальные угрозы и минимизировать риски для 
          сотрудников и активов компании. Современные методы тестирования включают как статический, 
          так и динамический анализ, что обеспечивает всестороннюю оценку состояния безопасности на 
          всех этапах производства.
        </p>
      </div>

      {/* Section for Testing System Features */}
      <section className="container py-5">
        <h2 className="pb-3 text-center text-info" style={{ marginTop: '40px' }}>Почему выбирают нашу систему тестирования?</h2>
        <div className="list-container" style={{ display: 'flex', margin: '10' }}>
          {/* Left Box */}
          <div className="list-box list-box-left">
            <h3 className="list-heading">Вы сможете:</h3>
            <ul className="fs-5">
              <li>Оценивать свои знания в различных предметах.</li>
              <li>Получать обратную связь и рекомендации по улучшению.</li>
              <li>Проходить тесты в любое время и в любом месте.</li>
              <li>Участвовать в конкурсах и соревнованиях с другими пользователями.</li>
            </ul>
          </div>

          {/* Right Box */}
          <div className="list-box list-box-right">
            <h3 className="list-heading">Наша система предлагает:</h3>
            <ul className="fs-5">
              <li>Интерактивные тесты и задания.</li>
              <li>Подробная аналитика и отчеты по результатам.</li>
              <li>Уведомления о новых тестах и обновлениях.</li>
              <li>Высокий уровень безопасности ваших данных.</li>
              <li>Поддержка сообщества и доступ к учебным материалам.</li>
            </ul>
          </div>
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
