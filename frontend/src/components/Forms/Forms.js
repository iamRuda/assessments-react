import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './forms.css';
import './slider.css';
import { Link } from 'react-router-dom';

const Forms = () => {

    useEffect(() => {
        const fetchProtectedData = async () => {
          const token = localStorage.getItem("token");
    
            try {
              const response = await fetch("http://localhost:8080/api/test/user", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const result = await response.json();
              setData(result);
            } catch (error) {
              console.error("Error fetching protected data", error);
            }
          };
    
        fetchProtectedData();
      }); // сыпет ошибку

    const [formData, setFormData] = useState({});
    const [jsonData, setJsonData] = useState({
        questions: [
            {
                id: 'question1',
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'multiple_choice_single',
                url: 'https://multi-admin.ru/mediabank_blog/11/121267/713d35c65bef4f7457062252f398f04fistock-462392661.jpg',
                options: [
                    { id: "1", text: "Да", url: null, typeUrl: null },
                    { id: "2", text: "Нет", url: null, typeUrl: null }
                ],
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question2',
                questionHeader: 'Выберите языки программирования, которые вы знаете:',
                questionText: 'Вы можете выбрать несколько вариантов.',
                questionPostscript: 'Убедитесь, что вы выбрали все подходящие.',
                questionType: 'multiple_choice_multiple',
                url: null,
                options: [
                    { id: "1", text: "JavaScript", url: null, typeUrl: null },
                    { id: "2", text: "Python", url: null, typeUrl: null },
                    { id: "3", text: "Java", url: null, typeUrl: null },
                    { id: "4", text: "C++", url: null, typeUrl: null }
                ],
                correctAnswers: ['1', '2'],
                selectedAnswers: []
            },
            {
                id: 'question3',
                questionHeader: 'Опишите ваш опыт в программировании:',
                questionText: 'Пожалуйста, дайте краткий ответ.',
                questionPostscript: 'Это однострочный ответ.',
                questionType: 'open_ended',
                responseType: 'single_line',
                url: null,
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question4', 
                questionHeader: 'Опишите, как вы решаете проблемы в коде:',
                questionText: 'Поделитесь вашим опытом и подходами.',
                questionPostscript: 'Это многострочный ответ.',
                questionType: 'open_ended',
                responseType: 'multi_line', 
                url: null,
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question5',
                questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать только одну)',
                questionText: 'Нажмите на любую кнопку, чтобы выбрать вашу любимую.',
                questionType: 'single_button_select',
                url: null,
                options: [
                    { id: "1", text: "1", url: null, typeUrl: null },
                    { id: "2", text: "2", url: null, typeUrl: null },
                    { id: "3", text: "3", url: null, typeUrl: null },
                    { id: "4", text: "4", url: null, typeUrl: null },
                    { id: "5", text: "5", url: null, typeUrl: null }
                ],
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question6',
                questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать несколько)',
                questionText: 'Нажмите на любые кнопки, чтобы выбрать ваши любимые.',
                questionType: 'multiple_button_select',
                url: null,
                options: [
                    { id: "1", text: "1", url: null, typeUrl: null },
                    { id: "2", text: "2", url: null, typeUrl: null },
                    { id: "3", text: "3", url: null, typeUrl: null },
                    { id: "4", text: "4", url: null, typeUrl: null },
                    { id: "5", text: "5", url: null, typeUrl: null }
                ],
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question7',
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'image_selection_single',
                url: null,
                options: [
                    { id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '3', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '4', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '5', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '6', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '7', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '8', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '9', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' }
                ],
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question8',
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'image_selection_multiple',
                url: null,
                options: [
                    { id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '3', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '4', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '5', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '6', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '7', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '8', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                    { id: '9', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' }
                ],
                correctAnswers: [],
                selectedAnswers: []
            }
        ]
    });

    const [isEditingJson, setIsEditingJson] = useState({});

    const handleChange = (id, questionId, isMultiple) => {
        setFormData((prevData) => {
            // Обновляем данные для выбора нескольких вариантов (если isMultiple == true)
            if (isMultiple) {
                const updatedValues = prevData[questionId] ? [...prevData[questionId]] : [];
                if (updatedValues.includes(id)) {
                    updatedValues.splice(updatedValues.indexOf(id), 1); // Удаляем элемент, если он уже выбран
                } else {
                    updatedValues.push(id); // Добавляем элемент, если он ещё не выбран
                }
    
                setJsonData((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q.id === questionId ? { ...q, selectedAnswers: updatedValues } : q
                    )
                }));
    
                return {
                    ...prevData,
                    [questionId]: updatedValues
                };
            } else {
                // Обновляем данные для одиночного выбора
                setJsonData((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q.id === questionId ? { ...q, selectedAnswers: [id] } : q
                    )
                }));
    
                return {
                    ...prevData,
                    [questionId]: [id]
                };
            }
        });
    };

    
    const handleSingleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value; // id of the selected image
    
        // Update the state data with the selected answer for single image selection
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) => 
                question.id === questionId
                    ? { ...question, selectedAnswers: [selectedValue] } // Update selected answer with single selection
                    : question
            )
        }));
    };
    
    const handleMultipleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value; // id of the selected image
        const isChecked = e.target.checked; // Whether the checkbox is checked
    
        // Update the state data for multiple image selection (add or remove from selectedAnswers)
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) => 
                question.id === questionId
                    ? {
                        ...question,
                        selectedAnswers: isChecked
                            ? [...question.selectedAnswers, selectedValue] // Add selected answer
                            : question.selectedAnswers.filter((answer) => answer !== selectedValue) // Remove selected answer
                    }
                    : question
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleJsonChange = (e, questionId) => {
        const updatedJson = e.target.value;
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.id === questionId ? { ...q, json: updatedJson } : q
            )
        }));
    };

    const handleEditJson = (questionId) => {
        const question = jsonData.questions.find((q) => q.id === questionId);
        if (question) {
            const questionJson = JSON.stringify(question, null, 2);
            setJsonData((prevData) => ({
                ...prevData,
                questions: prevData.questions.map((q) =>
                    q.id === questionId ? { ...q, json: questionJson } : q
                )
            }));

            setIsEditingJson((prevState) => ({
                ...prevState,
                [questionId]: true
            }));
        }
    };

    const handleJsonToQuestion = (questionId) => {
        try {
            const questionJson = jsonData.questions.find((q) => q.id === questionId).json;
            const parsedJson = JSON.parse(questionJson);

            // Check for unique ID before updating
            const existingIds = jsonData.questions.map(q => q.id);
            if (existingIds.includes(parsedJson.id) && parsedJson.id !== questionId) {
                alert('ID вопроса должен быть уникальным!');
                return;
            }

            setJsonData((prevData) => ({
                ...prevData,
                questions: prevData.questions.map((q) =>
                    q.id === questionId ? parsedJson : q
                )
            }));

            setIsEditingJson((prevState) => ({
                ...prevState,
                [questionId]: false
            }));
        } catch (error) {
            alert('Неправильный формат JSON');
        }
    };  

    const QuestionTemplateModal = ({ onClose, onSelectTemplate }) => {
        return (
          <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Выберите шаблон вопроса</h2>
              <div className="template-buttons d-flex flex-wrap justify-content-center">
                {/* Кнопки с иконками */}
                {[
                  { type: 'multiple_choice_single', label: 'Один ответ', imageUrl: '/icons/ui-radios.svg' },
                  { type: 'multiple_choice_multiple', label: 'Несколько ответов', imageUrl: '/icons/ui-checks.svg' },
                  { type: 'open_ended_single', label: 'Однострочный ответ', imageUrl: '/icons/input.svg' },
                  { type: 'open_ended_multi', label: 'Многострочный ответ', imageUrl: '/icons/layout-text-sidebar-reverse.svg' },
                  { type: 'image_selection_single', label: 'Изображение (один)', imageUrl: '/icons/image.svg' },
                  { type: 'image_selection_multiple', label: 'Изображения (несколько)', imageUrl: '/icons/images.svg' },
                  { type: 'slider_single', label: 'Слайдер (один)', imageUrl: '/icons/segmented-nav.svg' },
                  { type: 'slider_multiple', label: 'Слайдер (несколько)', imageUrl: '/icons/segmented-nav.svg' },
                ].map((button, idx) => (
                  <button
                    key={idx}
                    className="template-btn m-2"
                    onClick={() => onSelectTemplate(button.type)}
                  >
                    <div className="icon-container">
                      {/* Иконка внутри квадрата */}
                      <img
                        src={button.imageUrl}
                        alt={button.label}
                        className="icon"
                      />
                    </div>
                    <span>{button.label}</span>
                  </button>
                ))}
              </div>
              <button className="close-modal btn btn-secondary" onClick={onClose}>Закрыть</button>
            </div>
          </div>
        );
      };
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddQuestion = () => {
        setIsModalOpen(true);  // Показываем модальное окно
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);  // Закрываем модальное окно
    };

    const handleSelectTemplate = (templateType) => {
        const newQuestionId = `question_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newQuestion = getTemplateQuestion(templateType, newQuestionId);

        // Добавляем новый вопрос в jsonData
        setJsonData((prevData) => ({
            ...prevData,
            questions: [...prevData.questions, newQuestion]
        }));
        
         // Прокручиваем страницу до последнего добавленного вопроса
        setTimeout(scrollToLastQuestion, 0); // Вызываем прокрутку после обновления состояния

        setIsModalOpen(false);  // Закрываем модальное окно после добавления
    };

    const getTemplateQuestion = (templateType, newQuestionId) => {
    switch (templateType) {
        case 'multiple_choice_single':
        return {
            id: newQuestionId,
            questionHeader: 'Вы когда-нибудь использовали Google Формы?',
            questionText: 'Пожалуйста, выберите один из вариантов ниже.',
            questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
            questionType: 'multiple_choice_single',
            url: null,
            options: [
                { id: "1", text: "Да", url: null, typeUrl: null },
                { id: "2", text: "Нет", url: null, typeUrl: null }
            ],
            correctAnswers: [],
            selectedAnswers: []
        };
        case 'multiple_choice_multiple':
        return {
            id: newQuestionId,
            questionHeader: 'Выберите языки программирования, которые вы знаете:',
            questionText: 'Вы можете выбрать несколько вариантов.',
            questionPostscript: 'Убедитесь, что вы выбрали все подходящие.',
            questionType: 'multiple_choice_multiple',
            url: null,
            options: [
                { id: "1", text: "JavaScript", url: null, typeUrl: null },
                { id: "2", text: "Python", url: null, typeUrl: null },
                { id: "3", text: "Java", url: null, typeUrl: null },
                { id: "4", text: "C++", url: null, typeUrl: null }
            ],
            correctAnswers: ['1', '2'],
            selectedAnswers: []
        };
        case 'open_ended_single':
        return {
            id: newQuestionId,
            questionHeader: 'Опишите ваш опыт в программировании:',
            questionText: 'Пожалуйста, дайте краткий ответ.',
            questionPostscript: 'Это однострочный ответ.',
            questionType: 'open_ended',
            responseType: 'single_line',
            url: null,
            correctAnswers: [],
            selectedAnswers: []
        };
        case 'open_ended_multi':
        return {
            id: newQuestionId,
            questionHeader: 'Опишите, как вы решаете проблемы в коде:',
            questionText: 'Поделитесь вашим опытом и подходами.',
            questionPostscript: 'Это многострочный ответ.',
            questionType: 'open_ended',
            responseType: 'multi_line',
            url: null, 
            correctAnswers: [],
            selectedAnswers: []
        };
        case 'image_selection_single':
        return {
            id: newQuestionId,
            questionHeader: 'Вы когда-нибудь использовали Google Формы?',
            questionText: 'Пожалуйста, выберите один из вариантов ниже.',
            questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
            questionType: 'image_selection_single',
            url: null,
            options: [
                { id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '3', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '4', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '5', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '6', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '7', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '8', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '9', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' }
            ],
            correctAnswers: [],
            selectedAnswers: []
        };
        case 'image_selection_multiple':
        return {
            id: newQuestionId,
            questionHeader: 'Вы когда-нибудь использовали Google Формы?',
            questionText: 'Пожалуйста, выберите один из вариантов ниже.',
            questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
            questionType: 'image_selection_multiple',
            url: null,
            options: [
                { id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '3', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '4', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '5', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '6', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '7', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '8', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' },
                { id: '9', text: 'No Google Forms', url: 'https://via.placeholder.com/100', typeUrl: 'image' }
            ],
            correctAnswers: [],
            selectedAnswers: []
        };
        case 'slider_single':
        return {
            id: newQuestionId,
            questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать только одну)',
            questionText: 'Нажмите на любую кнопку, чтобы выбрать вашу любимую.',
            questionType: 'single_button_select',
            url: null,
            options: [
                { id: "1", text: "1", url: null, typeUrl: null },
                { id: "2", text: "2", url: null, typeUrl: null },
                { id: "3", text: "3", url: null, typeUrl: null },
                { id: "4", text: "4", url: null, typeUrl: null },
                { id: "5", text: "5", url: null, typeUrl: null }
            ],
            correctAnswers: [],
            selectedAnswers: []
        };
        case 'slider_multiple':
        return {
            id: newQuestionId,
            questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать несколько)',
            questionText: 'Нажмите на любые кнопки, чтобы выбрать ваши любимые.',
            questionType: 'multiple_button_select',
            url: null,
            options: [
                { id: "1", text: "1", url: null, typeUrl: null },
                { id: "2", text: "2", url: null, typeUrl: null },
                { id: "3", text: "3", url: null, typeUrl: null },
                { id: "4", text: "4", url: null, typeUrl: null },
                { id: "5", text: "5", url: null, typeUrl: null }
            ],
            correctAnswers: [],
            selectedAnswers: []
        };
        default:
        return {};
    }
    };

    const handleEditQuestionId = (newId, questionId) => {
        const existingIds = jsonData.questions.map(q => q.id);
        // Проверка на уникальность нового ID
        if (existingIds.includes(newId) && newId !== questionId) {
            alert('ID вопроса должен быть уникальным!');
            return;
        }

        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.id === questionId ? { ...q, id: newId } : q
            )
        }));
    };

    const handleDeleteQuestion = (questionId) => {
        // Remove the question with the matching id from the jsonData state
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.filter((q) => q.id !== questionId)
        }));
    
        // Optionally, you can clear the corresponding data in formData state if needed
        setFormData((prevData) => {
            const newFormData = { ...prevData };
            delete newFormData[questionId];
            return newFormData;
        });
    };

    // Функция для прокрутки страницы до последнего добавленного вопроса
    const scrollToLastQuestion = () => {
        // Прокручиваем страницу до самого низа
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }, 0);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-4">Анкета</h2>
                <div>
                    <button className="btn btn-primary" onClick={handleAddQuestion}>
                        Добавить вопрос
                    </button>

                    {isModalOpen && (
                        <QuestionTemplateModal
                        onClose={handleCloseModal}
                        onSelectTemplate={handleSelectTemplate}
                        />
                    )}
                </div>
            </div>
            <Link to="/dashboard" className="mb-3">{"<<"} Вернуться на главную</Link>

            <form onSubmit={handleSubmit}>
                {jsonData.questions.map((question) => (
                    <div key={question.id} className="card mb-4 p-3 shadow-sm position-relative" style={{ borderRadius: '10px' }}>
                        <h5 className="mb-3">{question.questionHeader}</h5>
                        
                        {question.url && (
                            <div className="mb-3">
                                <img src={question.url} alt="Question related" className="img-fluid" style={{ maxHeight: '50vh', objectFit: 'cover' }} />
                            </div>
                        )}
                        
                        {isEditingJson[question.id] ? (
                            <div>
                                <textarea
                                    className="form-control"
                                    rows="10"
                                    value={question.json || ''}
                                    onChange={(e) => handleJsonChange(e, question.id)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary mt-2"
                                    onClick={() => handleJsonToQuestion(question.id)}
                                >
                                    Ok
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-dark">{question.questionText}</p>
                                {/* Рендеринг для single choice (radio) */}
                                {question.options && question.questionType === 'multiple_choice_single' && (
                                    question.options.map((option) => (
                                        <div key={option.id} className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            value={option.id}
                                            checked={question.selectedAnswers.includes(option.id)}
                                            onChange={() => handleChange(option.id, question.id, false)}
                                        />
                                        <label className="form-check-label">{option.text}</label>
                                        </div>
                                    ))
                                )}

                                {/* Рендеринг для multiple choice (checkbox) */}
                                {question.options && question.questionType === 'multiple_choice_multiple' && (
                                    question.options.map((option) => (
                                        <div key={option.id} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            value={option.id}
                                            checked={question.selectedAnswers.includes(option.id)}
                                            onChange={() => handleChange(option.id, question.id, true)}
                                        />
                                        <label className="form-check-label">{option.text}</label>
                                        </div>
                                    ))
                                )}

                                {/* Рендеринг для open-ended single-line ответа */}
                                {question.questionType === 'open_ended' && question.responseType === 'single_line' && (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={question.selectedAnswers[0] || ''}
                                        onChange={(e) => handleChange(e, question.id, false)}
                                    />
                                )}

                                {/* Рендеринг для open-ended multi-line ответа */}
                                {question.questionType === 'open_ended' && question.responseType === 'multi_line' && (
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={question.selectedAnswers[0] || ''}
                                        onChange={(e) => handleChange(e, question.id, false)}
                                    />
                                )}

                                {question.questionType === 'single_button_select' && (
                                    <div className="slider-container">
                                        <div className="slider-track">
                                            {question.options.map((option) => (
                                                <div key={option.id} className="slide">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange(option.id, question.id, false)} // Для одиночного выбора передаем false
                                                        className="d-block"
                                                        style={{
                                                            backgroundColor: question.selectedAnswers.includes(option.id) ? '#ff9900' : '#007bff'
                                                        }}
                                                    >
                                                        {option.text}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {question.questionType === 'multiple_button_select' && (
                                    <div className="slider-container">
                                        <div className="slider-track">
                                            {question.options.map((option) => (
                                                <div key={option.id} className="slide">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange(option.id, question.id, true)} // Для множественного выбора передаем true
                                                        className="d-block"
                                                        style={{
                                                            backgroundColor: question.selectedAnswers.includes(option.id) ? '#ff9900' : '#007bff'
                                                        }}
                                                    >
                                                        {option.text}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {question.questionType === 'image_selection_single' && (
                                    <div className="row">
                                        {question.options.map((option) => (
                                            <div key={option.id} className="col-4 text-center mb-3">
                                                <label htmlFor={`image_${question.id}_${option.id}`} className="d-block position-relative img-form">
                                                    <img
                                                        src={option.url} // Ensure you are using 'url' here for the image source
                                                        alt={option.text} // Option text can be used for alt text
                                                        className="img-thumbnail"
                                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                                    />
                                                    <input
                                                        className="form-check-input checkbox-overlay"
                                                        type="radio"
                                                        id={`image_${question.id}_${option.id}`} // Composite ID for uniqueness
                                                        name={`selectedImage_${question.id}`}
                                                        value={option.id}
                                                        checked={question.selectedAnswers[0] === option.id}
                                                        onChange={(e) => handleSingleImageSelect(e, question.id)}
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.questionType === 'image_selection_multiple' && (
                                    <div className="row">
                                        {question.options.map((option) => (
                                            <div key={option.id} className="col-4 text-center mb-3">
                                                <label htmlFor={`image_${question.id}_${option.id}`} className="d-block position-relative img-form">
                                                    <img
                                                        src={option.url} // Ensure you are using 'url' here as well
                                                        alt={option.text} // Option text can be used for alt text
                                                        className="img-thumbnail"
                                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                                    />
                                                    <input
                                                        className="form-check-input checkbox-overlay"
                                                        type="checkbox"
                                                        id={`image_${question.id}_${option.id}`} // Composite ID for uniqueness
                                                        value={option.id}
                                                        checked={question.selectedAnswers.includes(option.id)} // Check if image is selected
                                                        onChange={(e) => handleMultipleImageSelect(e, question.id)} // Handler for selection
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                
                                <p className="text-muted mt-2">{question.questionPostscript}</p>
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-2"
                                    onClick={() => handleEditJson(question.id)}
                                >
                                    Редактировать JSON
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger mt-2"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    Удалить вопрос
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary mt-4">Отправить</button>
            </form>
        </div>
    );
};

export default Forms;
