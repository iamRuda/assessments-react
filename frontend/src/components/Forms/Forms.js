import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './forms.css';
import './slider.css';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const Forms = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [formData, setFormData] = useState({});
    const [jsonData, setJsonData] = useState({
        questions: []
    });

    const getToken = () => {
        return localStorage.getItem("authToken");
    };

    useEffect(() => {
        const initProfileData = async () => {
          try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/api/user/profile", {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            setProfileData(result);
            localStorage.setItem("profile", JSON.stringify(result));
          } catch (error) {
            console.error("Error fetching profile data", error);
          }
        };

        initProfileData();
    }, []);

    useEffect(() => {
        if (profileData && profileData.roles && profileData.roles.length > 0) {
            setUserRole(profileData.roles[0].role);
        }
    }, [profileData]);
    
    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const token = getToken();
                const response = await fetch(`http://localhost:8080/api/test/findById/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const result = await response.json();
                console.log('Test data:', result);
                setJsonData(result);
            } catch (error) {
                console.error("Error fetching test data", error);
            }
        };

        fetchTestData();
    }, [id]);

    const [scrollDirection, setScrollDirection] = useState('down');
    const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);

    const checkScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        const shouldShow = documentHeight > windowHeight;
        setIsScrollButtonVisible(shouldShow);
    
        const scrollBottom = documentHeight - (scrollY + windowHeight);
        const isNearBottom = scrollBottom < 100;
        const isNearTop = scrollY < 100;
    
        if (isNearBottom) {
            setScrollDirection('up');
        } else if (isNearTop) {
            setScrollDirection('down');
        } else {
            setScrollDirection(prev => prev || 'down');
        }
    };

    useEffect(() => {
        const handleResizeAndScroll = () => {
            checkScroll();
        };
    
        window.addEventListener('resize', handleResizeAndScroll);
        window.addEventListener('scroll', handleResizeAndScroll);
        checkScroll();
        
        return () => {
            window.removeEventListener('resize', handleResizeAndScroll);
            window.removeEventListener('scroll', handleResizeAndScroll);
        };
    }, [jsonData.questions]);

    const handleScrollClick = () => {
        if (scrollDirection === 'up') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ 
                top: document.documentElement.scrollHeight,
                behavior: 'smooth' 
            });
        }
    };

    const [isEditingJson, setIsEditingJson] = useState({});
    const [isEditingFields, setIsEditingFields] = useState({});
    const [editingData, setEditingData] = useState({});

    const handleChange = (id, questionId, isMultiple) => {
        setFormData((prevData) => {
            if (isMultiple) {
                const updatedValues = prevData[questionId] ? [...prevData[questionId]] : [];
                if (updatedValues.includes(id)) {
                    updatedValues.splice(updatedValues.indexOf(id), 1);
                } else {
                    updatedValues.push(id);
                }
    
                setJsonData((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q.id === questionId ? { ...q, selectedAnswers: updatedValues } : q
                    )
                }));
    
                return { ...prevData, [questionId]: updatedValues };
            } else {
                setJsonData((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q.id === questionId ? { ...q, selectedAnswers: [id] } : q
                    )
                }));
    
                return { ...prevData, [questionId]: [id] };
            }
        });
    };

    const handleSingleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value;
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) => 
                question.id === questionId
                    ? { ...question, selectedAnswers: [selectedValue] }
                    : question
            )
        }));
    };
    
    const handleMultipleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value;
        const isChecked = e.target.checked;
    
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) => 
                question.id === questionId
                    ? {
                        ...question,
                        selectedAnswers: isChecked
                            ? [...question.selectedAnswers, selectedValue]
                            : question.selectedAnswers.filter((answer) => answer !== selectedValue)
                    }
                    : question
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
    
        if (userRole === 'TEACHER' || userRole === 'ADMIN') {
            try {
                const response = await fetch(`http://localhost:8080/api/test/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(jsonData),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при обновлении теста');
                }
    
                const result = await response.json();
                alert('Тест успешно обновлён!');
            } catch (error) {
                console.error('Ошибка при обновлении:', error);
                alert(`Ошибка при сохранении: ${error.message}`);
            }
        } else if (userRole === 'STUDENT') {
            console.log('Отправка ответов:', jsonData);
        }
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

    const handleMaxScoreChange = (questionId, value) => {
        setJsonData(prevData => ({
            ...prevData,
            questions: prevData.questions.map(q => 
                q.id === questionId ? { ...q, maxScore: Number(value) } : q
            )
        }));
    };

    const handleStartFieldEditing = (questionId) => {
        const question = jsonData.questions.find(q => q.id === questionId);
        if (question) {
            setEditingData(prev => ({
                ...prev,
                [questionId]: {
                    questionHeader: question.questionHeader,
                    questionText: question.questionText,
                    questionPostscript: question.questionPostscript,
                    url: question.url,
                    options: question.options ? question.options.map(option => ({ ...option })) : undefined,
                    correctAnswers: [...question.correctAnswers],
                    questionType: question.questionType
                }
            }));
            setIsEditingFields(prev => ({ ...prev, [questionId]: true }));
        }
    };

    const handleFieldChange = (questionId, field, value) => {
        setEditingData(prev => ({
            ...prev,
            [questionId]: { ...prev[questionId], [field]: value }
        }));
    };

    const handleOptionTextChange = (questionId, optionId, newText) => {
        setEditingData(prev => {
            const updatedOptions = prev[questionId].options.map(option =>
                option.id === optionId ? { ...option, text: newText } : option
            );
            return { 
                ...prev,
                [questionId]: { ...prev[questionId], options: updatedOptions }
            };
        });
    };

    const handleOptionUrlChange = (questionId, optionId, newUrl) => {
        setEditingData(prev => {
            const updatedOptions = prev[questionId].options.map(option =>
                option.id === optionId ? { ...option, url: newUrl } : option
            );
            return { 
                ...prev,
                [questionId]: { ...prev[questionId], options: updatedOptions }
            };
        });
    };

    const handleAddOption = (questionId) => {
        setEditingData(prev => {
            const currentOptions = prev[questionId]?.options || [];
            const newOption = {
                id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                text: 'Новый вариант',
                url: null,
                type: null
            };
            return {
                ...prev,
                [questionId]: {
                    ...prev[questionId],
                    options: [...currentOptions, newOption]
                }
            };
        });
    };

    const handleDeleteOption = (questionId, optionId) => {
        setEditingData(prev => {
            const updatedOptions = prev[questionId].options.filter(option => option.id !== optionId);
            const updatedCorrectAnswers = prev[questionId].correctAnswers.filter(id => id !== optionId);
            return {
                ...prev,
                [questionId]: { 
                    ...prev[questionId],
                    options: updatedOptions,
                    correctAnswers: updatedCorrectAnswers
                }
            };
        });
    };

    const handleAddCorrectAnswer = (questionId) => {
        setEditingData(prev => {
            const currentAnswers = prev[questionId].correctAnswers || [];
            return {
                ...prev,
                [questionId]: { ...prev[questionId], correctAnswers: [...currentAnswers, ''] }
            };
        });
    };

    const handleCorrectAnswerChange = (questionId, index, value) => {
        setEditingData(prev => {
            const updatedAnswers = [...prev[questionId].correctAnswers];
            updatedAnswers[index] = value;
            return {
                ...prev,
                [questionId]: { ...prev[questionId], correctAnswers: updatedAnswers }
            };
        });
    };

    const handleDeleteCorrectAnswer = (questionId, index) => {
        setEditingData(prev => {
            const updatedAnswers = prev[questionId].correctAnswers.filter((_, i) => i !== index);
            return {
                ...prev,
                [questionId]: { ...prev[questionId], correctAnswers: updatedAnswers }
            };
        });
    };

    const handleSaveFieldEdits = (questionId) => {
        const edited = editingData[questionId];
        if (edited) {
            setJsonData(prev => ({
                ...prev,
                questions: prev.questions.map(q => 
                    q.id === questionId ? { 
                        ...q, 
                        questionHeader: edited.questionHeader,
                        questionText: edited.questionText,
                        questionPostscript: edited.questionPostscript,
                        url: edited.url,
                        options: edited.options,
                        correctAnswers: edited.correctAnswers,
                        questionType: edited.questionType
                    } : q
                )
            }));
            setIsEditingFields(prev => ({ ...prev, [questionId]: false }));
            setEditingData(prev => {
                const newEditingData = { ...prev };
                delete newEditingData[questionId];
                return newEditingData;
            });
        }
    };

    const handleCancelFieldEdits = (questionId) => {
        setIsEditingFields(prev => ({ ...prev, [questionId]: false }));
        setEditingData(prev => {
            const newEditingData = { ...prev };
            delete newEditingData[questionId];
            return newEditingData;
        });
    };

    const QuestionTemplateModal = ({ onClose, onSelectTemplate }) => {
        return (
          <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Выберите шаблон вопроса</h2>
              <div className="template-buttons d-flex flex-wrap justify-content-center">
                {[ // ⚠️ Изменены типы вопросов на верхний регистр
                  { type: 'MULTIPLE_CHOICE_SINGLE', label: 'Один ответ', imageUrl: '/icons/ui-radios.svg' },
                  { type: 'MULTIPLE_CHOICE_MULTIPLE', label: 'Несколько ответов', imageUrl: '/icons/ui-checks.svg' },
                  { type: 'OPEN_ENDED_SINGLE', label: 'Однострочный ответ', imageUrl: '/icons/input.svg' },
                  { type: 'OPEN_ENDED_MULTI', label: 'Многострочный ответ', imageUrl: '/icons/layout-text-sidebar-reverse.svg' },
                  { type: 'IMAGE_SELECTION_SINGLE', label: 'Изображение (один)', imageUrl: '/icons/image.svg' },
                  { type: 'IMAGE_SELECTION_MULTIPLE', label: 'Изображения (несколько)', imageUrl: '/icons/images.svg' },
                  { type: 'SINGLE_BUTTON_SELECT', label: 'Слайдер (один)', imageUrl: '/icons/segmented-nav.svg' },
                  { type: 'MULTIPLE_BUTTON_SELECT', label: 'Слайдер (несколько)', imageUrl: '/icons/segmented-nav.svg' },
                ].map((button, idx) => (
                  <button
                    key={idx}
                    className="template-btn m-2"
                    onClick={() => onSelectTemplate(button.type)}
                  >
                    <div className="icon-container">
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
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSelectTemplate = (templateType) => {
        const newQuestionId = `question_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newQuestion = getTemplateQuestion(templateType, newQuestionId);

        setJsonData((prevData) => ({
            ...prevData,
            questions: [...prevData.questions, newQuestion]
        }));
        
        setTimeout(() => {
            checkScroll();
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }, 0);
        setIsModalOpen(false);
    };

    const getTemplateQuestion = (templateType, newQuestionId) => {
        switch (templateType) { // ⚠️ Все case изменены на верхний регистр
            case 'MULTIPLE_CHOICE_SINGLE':
            return {
                id: newQuestionId,
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'MULTIPLE_CHOICE_SINGLE',
                url: null,
                isVisible: false,
                maxScore: 5,
                options: [
                    { id: "1", text: "Да", url: null, type: null },
                    { id: "2", text: "Нет", url: null, type: null }
                ],
                correctAnswers: [],
                selectedAnswers: []
            };
            case 'MULTIPLE_CHOICE_MULTIPLE':
            return {
                id: newQuestionId,
                questionHeader: 'Выберите языки программирования, которые вы знаете:',
                questionText: 'Вы можете выбрать несколько вариантов.',
                questionPostscript: 'Убедитесь, что вы выбрали все подходящие.',
                questionType: 'MULTIPLE_CHOICE_MULTIPLE',
                url: null,
                isVisible: false,
                maxScore: 5,
                options: [
                    { id: "1", text: "JavaScript", url: null, type: null },
                    { id: "2", text: "Python", url: null, type: null },
                    { id: "3", text: "Java", url: null, type: null },
                    { id: "4", text: "C++", url: null, type: null }
                ],
                correctAnswers: ['1', '2'],
                selectedAnswers: []
            };
            case 'OPEN_ENDED_SINGLE':
            return {
                id: newQuestionId,
                questionHeader: 'Опишите ваш опыт в программировании:',
                questionText: 'Пожалуйста, дайте краткий ответ.',
                questionPostscript: 'Это однострочный ответ.',
                questionType: 'OPEN_ENDED_SINGLE',
                url: null,
                isVisible: false,
                maxScore: 5,
                correctAnswers: [],
                selectedAnswers: [],
                options: []
            };
            case 'OPEN_ENDED_MULTI':
            return {
                id: newQuestionId,
                questionHeader: 'Опишите, как вы решаете проблемы в коде:',
                questionText: 'Поделитесь вашим опытом и подходами.',
                questionPostscript: 'Это многострочный ответ.',
                questionType: 'OPEN_ENDED_MULTI',
                url: null,
                isVisible: false,
                maxScore: 5, 
                correctAnswers: [],
                selectedAnswers: [],
                options: []
            };
            case 'IMAGE_SELECTION_SINGLE':
            return {
                id: newQuestionId,
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'IMAGE_SELECTION_SINGLE',
                url: null,
                isVisible: false,
                maxScore: 5,
                options: [
                    { id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', type: 'image' },
                    { id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', type: 'image' }
                ],
                correctAnswers: [],
                selectedAnswers: []
            };
            case 'IMAGE_SELECTION_MULTIPLE':
            return {
                id: newQuestionId,
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'IMAGE_SELECTION_MULTIPLE',
                isVisible: false,
                maxScore: 5,
                url: null,
                options: [
                    { id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', type: 'image' },
                    { id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', type: 'image' }
                ],
                correctAnswers: [],
                selectedAnswers: []
            };
            case 'SINGLE_BUTTON_SELECT':
            return {
                id: newQuestionId,
                questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать только одну)',
                questionText: 'Нажмите на любую кнопку, чтобы выбрать вашу любимую.',
                questionType: 'SINGLE_BUTTON_SELECT',
                url: null,
                isVisible: false,
                maxScore: 5,
                options: [
                    { id: "1", text: "1", url: null, type: null },
                    { id: "2", text: "2", url: null, type: null }
                ],
                correctAnswers: [],
                selectedAnswers: []
            };
            case 'MULTIPLE_BUTTON_SELECT':
            return {
                id: newQuestionId,
                questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать несколько)',
                questionText: 'Нажмите на любые кнопки, чтобы выбрать ваши любимые.',
                questionType: 'MULTIPLE_BUTTON_SELECT',
                url: null,
                isVisible: false,
                maxScore: 5,
                options: [
                    { id: "1", text: "1", url: null, type: null },
                    { id: "2", text: "2", url: null, type: null }
                ],
                correctAnswers: [],
                selectedAnswers: []
            };
            default:
            return {};
        }
    };

    const handleDeleteQuestion = (questionId) => {
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.filter((q) => q.id !== questionId)
        }));
    
        setFormData((prevData) => {
            const newFormData = { ...prevData };
            delete newFormData[questionId];
            return newFormData;
        });
    };

    return (
        <div className="container my-4">
            <div className="mb-3">
                <Link to="/dashboard" className="">{"<<"} Вернуться на главную</Link>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    {jsonData.test?.title || "Неизвестное тестирование"}
                </h2>
                {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
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
                )}
            </div>
            <form onSubmit={handleSubmit}>
                {jsonData.questions.map((question) => (
                    <div key={question.id} className="card mb-4 p-3 shadow-sm position-relative" style={{ borderRadius: '10px' }}>
                        <h5 className="mb-3">{question.questionHeader}</h5>
                        {question.url && (
                            <div className="mb-3">
                                <img src={question.url} alt="Question related" className="img-fluid" style={{ maxHeight: '50vh', objectFit: 'cover' }} />
                            </div>
                        )}
                        {isEditingFields[question.id] ? (
                            <div>
                                <div className="mb-3">
                                    <label>Тип вопроса</label>
                                    <select // ⚠️ Обновлены значения option
                                        className="form-select"
                                        value={editingData[question.id]?.questionType || 'MULTIPLE_CHOICE_SINGLE'}
                                        onChange={(e) => handleFieldChange(question.id, 'questionType', e.target.value)}
                                    >
                                        <option value="MULTIPLE_CHOICE_SINGLE">Один вариант</option>
                                        <option value="MULTIPLE_CHOICE_MULTIPLE">Несколько вариантов</option>
                                        <option value="OPEN_ENDED_SINGLE">Открытый вопрос (однострочный)</option>
                                        <option value="OPEN_ENDED_MULTI">Открытый вопрос (многострочный)</option>
                                        <option value="IMAGE_SELECTION_SINGLE">Выбор изображения (один)</option>
                                        <option value="IMAGE_SELECTION_MULTIPLE">Выбор изображения (несколько)</option>
                                        <option value="SINGLE_BUTTON_SELECT">Слайдер (один)</option>
                                        <option value="MULTIPLE_BUTTON_SELECT">Слайдер (несколько)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label>Заголовок вопроса</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={editingData[question.id]?.questionHeader || ''}
                                        onChange={(e) => handleFieldChange(question.id, 'questionHeader', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Текст вопроса</label>
                                    <textarea 
                                        className="form-control"
                                        value={editingData[question.id]?.questionText || ''}
                                        onChange={(e) => handleFieldChange(question.id, 'questionText', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Постскрипт</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={editingData[question.id]?.questionPostscript || ''}
                                        onChange={(e) => handleFieldChange(question.id, 'questionPostscript', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>URL изображения вопроса</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={editingData[question.id]?.url || ''}
                                        onChange={(e) => handleFieldChange(question.id, 'url', e.target.value)}
                                    />
                                </div>
                                {['OPEN_ENDED_SINGLE', 'OPEN_ENDED_MULTI'].includes(editingData[question.id]?.questionType) ? (
                                    <div className="mb-3">
                                        <label>Правильные ответы</label>
                                        {editingData[question.id]?.correctAnswers && editingData[question.id].correctAnswers.map((answer, index) => (
                                            <div key={index} className="input-group mb-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={answer}
                                                    onChange={(e) => handleCorrectAnswerChange(question.id, index, e.target.value)}
                                                />
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger" 
                                                    onClick={() => handleDeleteCorrectAnswer(question.id, index)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-primary" 
                                            onClick={() => handleAddCorrectAnswer(question.id)}
                                        >
                                            Добавить правильный ответ
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <label>Варианты ответа</label>
                                        {editingData[question.id]?.options && editingData[question.id].options.map((option) => (
                                            <div key={option.id} className="input-group mb-2">
                                                <span className="input-group-text">{option.id}</span>
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={option.text}
                                                    onChange={(e) => handleOptionTextChange(question.id, option.id, e.target.value)}
                                                />
                                                {['IMAGE_SELECTION_SINGLE', 'IMAGE_SELECTION_MULTIPLE'].includes(editingData[question.id]?.questionType) && (
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="URL изображения"
                                                        value={option.url || ''}
                                                        onChange={(e) => handleOptionUrlChange(question.id, option.id, e.target.value)}
                                                    />
                                                )}
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger" 
                                                    onClick={() => handleDeleteOption(question.id, option.id)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-primary" 
                                            onClick={() => handleAddOption(question.id)}
                                        >
                                            Добавить вариант
                                        </button>
                                    </div>
                                )}
                                <button type="button" className="btn btn-success me-2" onClick={() => handleSaveFieldEdits(question.id)}>Сохранить изменения</button>
                                <button type="button" className="btn btn-secondary" onClick={() => handleCancelFieldEdits(question.id)}>Отменить</button>
                            </div>
                        ) : isEditingJson[question.id] ? (
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
                                {question.options && (question.questionType === 'MULTIPLE_CHOICE_SINGLE' || question.questionType === 'MULTIPLE_CHOICE_MULTIPLE') && (
                                    question.options.map((option) => (
                                        <div key={option.id} className="form-check">
                                            <input
                                                type={question.questionType === 'MULTIPLE_CHOICE_SINGLE' ? 'radio' : 'checkbox'}
                                                className="form-check-input"
                                                value={option.id}
                                                checked={question.selectedAnswers.includes(option.id)}
                                                onChange={(e) => handleChange(e.target.value, question.id, question.questionType === 'MULTIPLE_CHOICE_MULTIPLE')}
                                            />
                                            <label className="form-check-label">{option.text}</label>
                                        </div>
                                    ))
                                )}
                                {question.questionType === 'OPEN_ENDED_SINGLE' && (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={question.selectedAnswers[0] || ''}
                                        onChange={(e) => handleChange(e.target.value, question.id, false)}
                                    />
                                )}
                                {question.questionType === 'OPEN_ENDED_MULTI' && (
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={question.selectedAnswers[0] || ''}
                                        onChange={(e) => handleChange(e.target.value, question.id, false)}
                                    />
                                )}
                                {question.questionType === 'SINGLE_BUTTON_SELECT' && (
                                    <div className="slider-container">
                                        <div className="slider-track">
                                            {question.options.map((option) => (
                                                <div key={option.id} className="slide">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange(option.id, question.id, false)}
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
                                {question.questionType === 'MULTIPLE_BUTTON_SELECT' && (
                                    <div className="slider-container">
                                        <div className="slider-track">
                                            {question.options.map((option) => (
                                                <div key={option.id} className="slide">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange(option.id, question.id, true)}
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
                                {question.questionType === 'IMAGE_SELECTION_SINGLE' && (
                                    <div className="row">
                                        {question.options.map((option) => (
                                            <div key={option.id} className="col-4 text-center mb-3">
                                                <label htmlFor={`image_${question.id}_${option.id}`} className="d-block position-relative img-form">
                                                    <img
                                                        src={option.url}
                                                        alt={option.text}
                                                        className="img-thumbnail"
                                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                                    />
                                                    <input
                                                        className="form-check-input checkbox-overlay"
                                                        type="radio"
                                                        id={`image_${question.id}_${option.id}`}
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
                                {question.questionType === 'IMAGE_SELECTION_MULTIPLE' && (
                                    <div className="row">
                                        {question.options.map((option) => (
                                            <div key={option.id} className="col-4 text-center mb-3">
                                                <label htmlFor={`image_${question.id}_${option.id}`} className="d-block position-relative img-form">
                                                    <img
                                                        src={option.url}
                                                        alt={option.text}
                                                        className="img-thumbnail"
                                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                                    />
                                                    <input
                                                        className="form-check-input checkbox-overlay"
                                                        type="checkbox"
                                                        id={`image_${question.id}_${option.id}`}
                                                        value={option.id}
                                                        checked={question.selectedAnswers.includes(option.id)}
                                                        onChange={(e) => handleMultipleImageSelect(e, question.id)}
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-muted mt-2">{question.questionPostscript}</p>
                                {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
                                    <div className="max-score-container d-flex align-items-center">
                                        <label className="mb-0">Баллы:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            className="score-input"
                                            value={question.maxScore || 0}
                                            onChange={(e) => handleMaxScoreChange(question.id, e.target.value)}
                                        />
                                    </div>
                                )}
                                {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={() => handleEditJson(question.id)}
                                    >
                                        Редактировать JSON
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-info me-2"
                                        onClick={() => handleStartFieldEditing(question.id)}
                                    >
                                        Редактировать вопрос
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        Удалить вопрос
                                    </button>
                                </div>)}
                            </div>
                        )}
                    </div>
                ))}
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        {(userRole === 'TEACHER' || userRole === 'ADMIN') ? 'Сохранить тест' : 'Отправить ответы'}
                    </button>
                </div>
            </form>
            {isScrollButtonVisible && (
                <button 
                    className="btn btn-primary rounded-circle shadow-lg"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '50px',
                        height: '50px',
                        zIndex: 1000
                    }}
                    onClick={handleScrollClick}
                    >
                    <FontAwesomeIcon 
                        icon={scrollDirection === 'up' ? faArrowUp : faArrowDown} 
                        className="fs-5"
                    />
                </button>
            )}
        </div>
    );
};

export default Forms;