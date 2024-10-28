import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MainPage.css';
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Card, CardContent } from "@mui/material";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light text-dark">
      {/* Image Header with Gradient Effect */}
      <div className="image-header">
        <Container className="text-center text-black" style={{ padding: '80px 0' }}>
          <Typography variant="h2" component="h1">Добро пожаловать в систему тестирования!</Typography>
          <Typography variant="h5" component="p">Ваш надежный помощник в обучении и оценке знаний.</Typography>
          
          {/* Button and Registration Prompt */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: '20px' }}> {/* Reduced margin for closeness */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}> {/* Adjusted margin */}
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: '150px',
                  borderRadius: '20px',
                  padding: '10px',
                  color: 'white'
                }}
                onClick={() => navigate("/login")}
              >
                Войти
              </Button>
            </div>

            <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
              Еще нет аккаунта?  
              <span 
                style={{ color: '#007bff', cursor: 'pointer' }} 
                onClick={() => navigate("/registration")}
              >
                Зарегистрироваться!
              </span>
            </Typography>
          </div>
        </Container>
      </div>

      {/* Added Cards Section with Images */}
      <section className="container py-5">
        <div className="row">
          {/* First Card */}
          <div className="col-md-4">
            <Card>
              <img
                src={require('./first.jpg')}
                alt="Test Environment"
                className="card-img-top"
              />
              <CardContent>
                <Typography variant="h5">Удобная платформа</Typography>
                <Typography variant="body2">
                  Наша система предоставляет интуитивно понятный интерфейс для тестирования в различных предметах.
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Second Card */}
          <div className="col-md-4">
            <Card>
              <img
                src={require('./second.jpg')}
                alt="Analytics"
                className="card-img-top"
              />
              <CardContent>
                <Typography variant="h5">Подробная аналитика</Typography>
                <Typography variant="body2">
                  Мы предлагаем детализированные отчеты и рекомендации для улучшения ваших знаний.
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Third Card */}
          <div className="col-md-4">
            <Card>
              <img
                src={require('./third.jpg')}
                alt="Security"
                className="card-img-top"
              />
              <CardContent>
                <Typography variant="h5">Безопасность данных</Typography>
                <Typography variant="body2">
                  Обеспечиваем защиту ваших данных с использованием современных технологий безопасности.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="security-testing-info">
  <h2 className="info-heading">Информация о системе тестирования</h2>
  <p className="info-text">
    Системы тестирования безопасности на производстве играют критически важную роль в обеспечении 
    защиты оборудования и производственных процессов. Эти системы направлены на выявление 
    уязвимостей и проверку эффективности различных мер безопасности. Регулярные тестирования 
    позволяют своевременно обнаруживать потенциальные угрозы и минимизировать риски для 
    сотрудников и активов компании.
  </p>
</div>


      {/* Section for Testing System Features */}
      <section className="container py-5">
        <h2 className="pb-3 text-center text-info" style={{ marginTop: '40px' }}>Почему выбирают нашу систему тестирования?</h2>
        <div className="list-container" style={{ display: 'flex' }}>
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
          <p className="text-muted">© 2024 Система тестирования</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
