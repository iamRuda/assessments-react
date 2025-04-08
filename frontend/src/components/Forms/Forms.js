import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forms.css';
import './slider.css';
import './colorpicker.css';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp,
    faArrowDown,
    faPencilAlt,
    faChartBar,
    faPalette,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

const Forms = () => {

    const navigate = useNavigate();

    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [isTestCompleted, setIsTestCompleted] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [formData, setFormData] = useState({});
    const [jsonData, setJsonData] = useState({questions: []});
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [localThresholds, setLocalThresholds] = useState([]);
    const [isStrictValidation, setIsStrictValidation] = useState(true);  // Флаг строгой проверки
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [localDescription, setLocalDescription] = useState('');
    const [localColor, setLocalColor] = useState('');
    const [localTheme, setLocalTheme] = useState('');

    useEffect(() => {
        const originalBackground = document.body.style.backgroundColor;
        document.body.style.backgroundColor = jsonData.test?.color || '#f8f9fa';
        document.body.style.transition = 'background-color 0.3s ease';
      
        return () => {
          document.body.style.backgroundColor = originalBackground;
        };
      }, [jsonData.test?.color]);

    useEffect(() => {
        const checkTestCompletion = async () => {
            if (userRole === 'STUDENT' && profileData?.id) {
                try {
                    const token = getToken();
                    const response = await fetch(
                        `http://localhost:8080/api/result/findByUserIdAndTestId/${profileData.id}/${id}`,
                        {headers: {Authorization: `Bearer ${token}`}}
                    );

                    if (response.ok) {
                        const result = await response.json();
                        setIsTestCompleted(result.completed);
                    }
                } catch (error) {
                    console.error("Error checking test completion", error);
                }
            }
        };

        checkTestCompletion();
    }, [id, userRole, profileData]);

    const getToken = () => {
        return localStorage.getItem("authToken");
    };

    useEffect(() => {
        const initProfileData = async () => {
            try {
                const token = getToken();
                const response = await fetch("http://localhost:8080/api/user/profile", {
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`},
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
            setIsLoading(true);
            try {
                const token = getToken();
                const response = await fetch(`http://localhost:8080/api/test/findById/${id}`, {
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`},
                });

                if ((response.status === 403) || (response.status === 404)) {
                    setIsNotFound(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Ошибка загрузки теста');
                }

                const result = await response.json();
                setJsonData(result);
            } catch (error) {
                console.error("Error fetching test data", error);
                if (error.message.includes('404')) {
                    setIsNotFound(true);
                }
            } finally {
                setIsLoading(false);
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
            window.scrollTo({top: 0, behavior: 'smooth'});
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
                        q.id === questionId ? {...q, selectedAnswers: updatedValues} : q
                    )
                }));

                return {...prevData, [questionId]: updatedValues};
            } else {
                setJsonData((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q.id === questionId ? {...q, selectedAnswers: [id]} : q
                    )
                }));

                return {...prevData, [questionId]: [id]};
            }
        });
    };

    const handleSingleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value;
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) =>
                question.id === questionId
                    ? {...question, selectedAnswers: [selectedValue]}
                    : question
            )
        }));
    };

    // Проверка статуса теста
    useEffect(() => {
        const checkTestStatus = async () => {
            if (userRole === 'STUDENT') {
                try {
                    const response = await fetch(
                        `http://localhost:8080/api/result/findByUserIdAndTestId/${profileData.id}/${id}`,
                        {headers: {Authorization: `Bearer ${getToken()}`}}
                    );
                    if (response.ok) {
                        const result = await response.json();
                        setIsTestCompleted(result.completed);
                    }
                } catch (error) {
                    console.error("Error checking test status:", error);
                }
            }
        };
        checkTestStatus();
    }, [id, userRole, profileData]);


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

    const validateForm = () => {
        if (userRole === 'STUDENT' && isTestCompleted) return false;
        if (userRole === 'STUDENT') {
            // Проверка для студентов
            for (const question of jsonData.questions) {
                if (!question.selectedAnswers || question.selectedAnswers.length === 0) {
                    return false; // Найден вопрос без ответа
                }
            }
            return true; // Все вопросы имеют ответы
        } else if (userRole === 'TEACHER' || userRole === 'ADMIN') {
            // Проверка для преподавателей или админов
            for (const question of jsonData.questions) {
                if (!question.questionHeader || !question.questionText || !question.maxScore) {
                    return false; // Найден вопрос без обязательных полей
                }
                if (question.options && question.options.length > 0) {
                    for (const option of question.options) {
                        if (!option.text) {
                            return false; // Найдена опция без текста
                        }
                    }
                }
            }
            return true; // Все обязательные поля заполнены
        }
        return false; // Неизвестная роль
    };
    // Логика потверждения
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

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
                window.location.reload();
            } catch (error) {
                console.error('Ошибка при обновлении:', error);
                alert(`Ошибка при сохранении: ${error.message}`);
            }
        } else if (userRole === 'STUDENT') {
            try {
                const response = await fetch("http://localhost:8080/api/test/complete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(jsonData)
                });

                alert("Тест успешно отправлен на проверку!");
                navigate('/dashboard');
            } catch (error) {
                console.error("Ошибка при отправке теста:", error);
                alert(`Ошибка при отправке теста: ${error.message}`);
            }
        }
    };

    const handleJsonChange = (e, questionId) => {
        const updatedJson = e.target.value;
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.id === questionId ? {...q, json: updatedJson} : q
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
                    q.id === questionId ? {...q, json: questionJson} : q
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
                q.id === questionId ? {...q, maxScore: Number(value)} : q
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
                    options: question.options ? question.options.map(option => ({...option})) : undefined,
                    correctAnswers: [...question.correctAnswers],
                    questionType: question.questionType
                }
            }));
            setIsEditingFields(prev => ({...prev, [questionId]: true}));
        }
    };

    const handleFieldChange = (questionId, field, value) => {
        setEditingData(prev => ({
            ...prev,
            [questionId]: {...prev[questionId], [field]: value}
        }));
    };

    const handleOptionTextChange = (questionId, optionId, newText) => {
        setEditingData(prev => {
            const updatedOptions = prev[questionId].options.map(option =>
                option.id === optionId ? {...option, text: newText} : option
            );
            return {
                ...prev,
                [questionId]: {...prev[questionId], options: updatedOptions}
            };
        });
    };

    const handleOptionUrlChange = (questionId, optionId, newUrl) => {
        setEditingData(prev => {
            const updatedOptions = prev[questionId].options.map(option =>
                option.id === optionId ? {...option, url: newUrl} : option
            );
            return {
                ...prev,
                [questionId]: {...prev[questionId], options: updatedOptions}
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
                [questionId]: {...prev[questionId], correctAnswers: [...currentAnswers, '']}
            };
        });
    };

    const handleCorrectAnswerChange = (questionId, index, value) => {
        setEditingData(prev => {
            const updatedAnswers = [...prev[questionId].correctAnswers];
            updatedAnswers[index] = value;
            return {
                ...prev,
                [questionId]: {...prev[questionId], correctAnswers: updatedAnswers}
            };
        });
    };

    const handleDeleteCorrectAnswer = (questionId, index) => {
        setEditingData(prev => {
            const updatedAnswers = prev[questionId].correctAnswers.filter((_, i) => i !== index);
            return {
                ...prev,
                [questionId]: {...prev[questionId], correctAnswers: updatedAnswers}
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
            setIsEditingFields(prev => ({...prev, [questionId]: false}));
            setEditingData(prev => {
                const newEditingData = {...prev};
                delete newEditingData[questionId];
                return newEditingData;
            });
        }
    };

    const handleCancelFieldEdits = (questionId) => {
        setIsEditingFields(prev => ({...prev, [questionId]: false}));
        setEditingData(prev => {
            const newEditingData = {...prev};
            delete newEditingData[questionId];
            return newEditingData;
        });
    };

    const QuestionTemplateModal = ({onClose, onSelectTemplate}) => {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Выберите шаблон вопроса</h2>
                    <div className="template-buttons d-flex flex-wrap justify-content-center">
                        {[
                            {type: 'MULTIPLE_CHOICE_SINGLE', label: 'Один ответ', imageUrl: '/icons/ui-radios.svg'},
                            {
                                type: 'MULTIPLE_CHOICE_MULTIPLE',
                                label: 'Несколько ответов',
                                imageUrl: '/icons/ui-checks.svg'
                            },
                            {type: 'OPEN_ENDED_SINGLE', label: 'Однострочный ответ', imageUrl: '/icons/input.svg'},
                            {
                                type: 'OPEN_ENDED_MULTI',
                                label: 'Многострочный ответ',
                                imageUrl: '/icons/layout-text-sidebar-reverse.svg'
                            },
                            {
                                type: 'IMAGE_SELECTION_SINGLE',
                                label: 'Изображение (один)',
                                imageUrl: '/icons/image.svg'
                            },
                            {
                                type: 'IMAGE_SELECTION_MULTIPLE',
                                label: 'Изображения (несколько)',
                                imageUrl: '/icons/images.svg'
                            },
                            {
                                type: 'SINGLE_BUTTON_SELECT',
                                label: 'Слайдер (один)',
                                imageUrl: '/icons/segmented-nav.svg'
                            },
                            {
                                type: 'MULTIPLE_BUTTON_SELECT',
                                label: 'Слайдер (несколько)',
                                imageUrl: '/icons/segmented-nav.svg'
                            },
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
        switch (templateType) {
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
                        {id: "1", text: "Да", url: null, type: null},
                        {id: "2", text: "Нет", url: null, type: null}
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
                        {id: "1", text: "JavaScript", url: null, type: null},
                        {id: "2", text: "Python", url: null, type: null},
                        {id: "3", text: "Java", url: null, type: null},
                        {id: "4", text: "C++", url: null, type: null}
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
                        {id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', type: 'image'},
                        {id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', type: 'image'}
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
                        {id: '1', text: 'Google Forms', url: 'https://via.placeholder.com/100', type: 'image'},
                        {id: '2', text: 'No Google Forms', url: 'https://via.placeholder.com/100', type: 'image'}
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
                        {id: "1", text: "1", url: null, type: null},
                        {id: "2", text: "2", url: null, type: null}
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
                        {id: "1", text: "1", url: null, type: null},
                        {id: "2", text: "2", url: null, type: null}
                    ],
                    correctAnswers: [],
                    selectedAnswers: []
                };
            default:
                return {};
        }
    };

    const handleCloseTest = () => {
        navigate('/dashboard');
    };

    const handleDeleteQuestion = (questionId) => {
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.filter((q) => q.id !== questionId)
        }));

        setFormData((prevData) => {
            const newFormData = {...prevData};
            delete newFormData[questionId];
            return newFormData;
        });
    };

    const handleSaveTheme = () => {
        setJsonData(prev => ({
          ...prev,
          test: {
            ...prev.test,
            description: localDescription,
            color: localColor || null,
            theme: localTheme
          }
        }));
        setIsThemeModalOpen(false);
      };

    const handleOpenGradingModal = () => {
        const thresholds = jsonData.test?.gradingThresholds
            ? Object.entries(jsonData.test.gradingThresholds)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([key, value]) => ({
                    id: `threshold_${key}_${Date.now()}`,
                    percentage: key,
                    grade: value
                }))
            : [];
        setLocalThresholds(thresholds);
        setIsGradingModalOpen(true);
    };

    const handleCloseGradingModal = () => {
        setIsGradingModalOpen(false);
    };

    const handleThresholdChange = (id, field, value) => {
        setLocalThresholds(prev =>
            prev.map(threshold => {
                if (threshold.id === id) {
                    if (field === 'percentage' && threshold.percentage === '0') return threshold;
                    return {...threshold, [field]: value};
                }
                return threshold;
            })
        );
    };

    const handleAddThreshold = () => {
        const newThreshold = {
            id: `threshold_new_${Date.now()}`,
            percentage: '50',
            grade: 'Новая оценка'
        };
        setLocalThresholds(prev => [...prev, newThreshold]);
    };

    const handleSortThresholds = () => {
        setLocalThresholds(prev => {
            const sorted = [...prev].sort((a, b) => parseInt(a.percentage) - parseInt(b.percentage));
            return sorted;
        });
    };

    const handleRemoveThreshold = (id) => {
        const threshold = localThresholds.find(t => t.id === id);
        if (!threshold) return;

        if (threshold.percentage === '0') {
            alert('Порог 0% нельзя удалить!');
            return;
        }
        const updated = localThresholds.filter(t => t.id !== id);
        setLocalThresholds(updated);
    };

    const handleSaveGrading = () => {
        // Финализируем сортировку перед сохранением
        const sorted = [...localThresholds].sort((a, b) => parseInt(a.percentage) - parseInt(b.percentage));

        // Проверки
        const hasEmptyGrade = sorted.some(t => t.grade.trim() === '');
        if (hasEmptyGrade) return alert('Название оценки не может быть пустым!');

        if (!sorted.some(t => t.percentage === '0')) {
            return alert('Должен присутствовать порог 0%!');
        }

        // Преобразуем в объект
        const gradingThresholds = sorted.reduce((acc, curr) => {
            acc[curr.percentage] = curr.grade;
            return acc;
        }, {});

        // Сохраняем данные
        setJsonData(prev => ({
            ...prev,
            test: {...prev.test, gradingThresholds}
        }));
        setIsGradingModalOpen(false);
    };

    if (isNotFound) {
        return (
            <div className="container text-center mt-5">
                <h1 className="display-1">Упс...</h1>
                <p className="lead">Тест не найден или у вас нет доступа к нему</p>
                <Link to="/dashboard" className="btn btn-primary">
                    Вернуться на главную
                </Link>
            </div>
        );
    }

    // Рендер лоадера во время загрузки
    if (isLoading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-2">Загрузка теста...</p>
            </div>
        );
    }

    return (
        <>
        <div className="container my-4" style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'white',
            boxShadow: '0 0 30px rgba(0,0,0,0.05)',
            borderRadius: '8px',
            padding: '2rem'
          }}>
            <div className="mb-3">
                <Link to="/dashboard" className="">{"<<"} Вернуться на главную</Link>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => {
                                setJsonData(prev => ({
                                    ...prev,
                                    test: {...prev.test, title: newTitle}
                                }));
                                setIsEditingTitle(false);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setJsonData(prev => ({
                                        ...prev,
                                        test: {...prev.test, title: newTitle}
                                    }));
                                    setIsEditingTitle(false);
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <h2 className="mb-0">
                            {jsonData.test?.title || "Получение данных..."}
                        </h2>
                    )}
                    {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
                        <button
                            className="btn btn-link p-0"
                            onClick={() => {
                                setNewTitle(jsonData.test?.title || '');
                                setIsEditingTitle(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} className="fs-5 text-muted"/>
                        </button>
                    )}
                </div>
                {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
                <div>
                    <button
                    className="btn btn-secondary me-2"
                    onClick={() => {
                        setLocalDescription(jsonData.test?.description || '');
                        setLocalColor(jsonData.test?.color || '');
                        setLocalTheme(jsonData.test?.theme || '');
                        setIsThemeModalOpen(true);
                    }}
                    >
                    <FontAwesomeIcon icon={faPalette} className="me-2"/>
                    Настроить тему
                    </button>
                    <button
                    className="btn btn-secondary me-2"
                    onClick={handleOpenGradingModal}
                    >
                    <FontAwesomeIcon icon={faChartBar} className="me-2"/>
                    Изменить оценивание
                    </button>
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
            
            {isThemeModalOpen && (
                <div className="modal-overlay" onClick={() => setIsThemeModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
                    <h3 className="mb-4">Настройки оформления</h3>
                    
                    <div className="mb-4">
                        <label className="form-label fw-medium mb-2">Описание теста</label>
                        <textarea
                        className="form-control"
                        rows="2"
                        value={localDescription}
                        onChange={(e) => setLocalDescription(e.target.value)}
                        placeholder="Добавьте краткое описание теста..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-medium mb-2">Выбор цвета темы</label>
                        <div className="color-picker-container bg-light p-3 rounded-3">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            {/* Превью цвета */}
                            <div className="position-relative">
                            <div 
                                className="color-preview rounded-2"
                                style={{ 
                                width: '80px',
                                height: '80px',
                                backgroundColor: localColor || 'transparent',
                                backgroundImage: !localColor 
                                    ? `repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%)`
                                    : undefined,
                                backgroundSize: '10px 10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                {localColor && (
                                <button
                                    className="btn btn-link p-0 text-danger position-absolute"
                                    style={{
                                    top: '-10px',
                                    right: '-10px',
                                    fontSize: '1.5rem'
                                    }}
                                    onClick={() => setLocalColor('')}
                                    title="Сбросить цвет"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                                )}
                            </div>
                            </div>

                            {/* Палитра и готовые цвета */}
                            <div className="flex-grow-1">
                            <div className="">
                                <label className="form-label small mb-2">Свой выбор цвета:</label>
                                <input
                                type="color"
                                className="form-control form-control-color w-100"
                                value={localColor || '#ffffff'}
                                onChange={(e) => setLocalColor(e.target.value)}
                                id="colorInput"
                                style={{
                                    height: '40px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                                />
                            </div>
                            
                            <div className="">
                                <label className="form-label small mb-2">Готовые варианты:</label>
                                <div className="d-flex gap-2 flex-wrap">
                                {['#6c757d', '#0d6efd', '#198754', '#dc3545', '#ffc107', '#686ec2', '#20c997', '#fd7e14'].map((color) => (
                                    <button
                                    key={color}
                                    className="color-preset rounded-circle border-0"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: color,
                                        transition: 'transform 0.2s'
                                    }}
                                    onClick={() => setLocalColor(color)}
                                    title={`Цвет ${color}`}
                                    />
                                ))}
                                <button
                                    className="color-preset rounded-circle border-0"    
                                    style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%)',
                                    backgroundSize: '10px 10px'
                                    }}
                                    onClick={() => setLocalColor('')}
                                    title="Прозрачный"
                                />
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-medium mb-2">Тема оформления</label>
                        <input
                        type="text"
                        className="form-control"
                        value={localTheme}
                        onChange={(e) => setLocalTheme(e.target.value)}
                        placeholder="Например: Программирование, Математика..."
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setIsThemeModalOpen(false)}
                        >
                        Отмена
                        </button>
                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveTheme}
                        >
                        Сохранить изменения
                        </button>
                    </div>
                    </div>
                </div>
                )}

            {/* Модальное окно критериев оценивания */}
            {isGradingModalOpen && (
                <div className="modal-overlay" onClick={handleCloseGradingModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Критерии оценивания</h3>
                        <div className="mb-3">
                            <p className="text-muted">Укажите минимальный процент для оценки (пример: 0 - 2, 50 -
                                3)</p>
                            {localThresholds.map((threshold) => (
                                <div key={threshold.id} className="input-group mb-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="form-control"
                                        placeholder="Процент"
                                        value={threshold.percentage}
                                        onChange={(e) => handleThresholdChange(threshold.id, 'percentage', e.target.value)}
                                        readOnly={threshold.percentage === '0'}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSortThresholds()}
                                        onBlur={handleSortThresholds}
                                    />
                                    <span className="input-group-text">-</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Оценка"
                                        value={threshold.grade}
                                        onChange={(e) => handleThresholdChange(threshold.id, 'grade', e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSortThresholds()}
                                        onBlur={handleSortThresholds}
                                    />
                                    {threshold.percentage !== '0' && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => handleRemoveThreshold(threshold.id)}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline-primary mb-3"
                                onClick={handleAddThreshold}
                            >
                                Добавить критерий
                            </button>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCloseGradingModal}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSaveGrading}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {jsonData.questions.map((question) => (
                    <div key={question.id} className="card mb-4 p-3 shadow-sm position-relative"
                            style={{borderRadius: '10px'}}>
                        <h5 className="mb-3">{question.questionHeader}</h5>
                        {question.url && (
                            <div className="mb-3">
                                <img src={question.url} alt="Question related" className="img-fluid"
                                        style={{maxHeight: '50vh', objectFit: 'cover'}}/>
                            </div>
                        )}
                        {isEditingFields[question.id] ? (
                            <div>
                                <div className="mb-3">
                                    <label>Тип вопроса</label>
                                    <select
                                        className="form-select"
                                        value={editingData[question.id]?.questionType || 'MULTIPLE_CHOICE_SINGLE'}
                                        onChange={(e) => handleFieldChange(question.id, 'questionType', e.target.value)}
                                    >
                                        <option value="MULTIPLE_CHOICE_SINGLE">Один вариант</option>
                                        <option value="MULTIPLE_CHOICE_MULTIPLE">Несколько вариантов</option>
                                        <option value="OPEN_ENDED_SINGLE">Открытый вопрос (однострочный)</option>
                                        <option value="OPEN_ENDED_MULTI">Открытый вопрос (многострочный)</option>
                                        <option value="IMAGE_SELECTION_SINGLE">Выбор изображения (один)</option>
                                        <option value="IMAGE_SELECTION_MULTIPLE">Выбор изображения (несколько)
                                        </option>
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
                                <button type="button" className="btn btn-success me-2"
                                        onClick={() => handleSaveFieldEdits(question.id)}>Сохранить изменения
                                </button>
                                <button type="button" className="btn btn-secondary"
                                        onClick={() => handleCancelFieldEdits(question.id)}>Отменить
                                </button>
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

                                {isTestCompleted && userRole === 'STUDENT' ? (
                                    // Блок отображения завершенных ответов
                                    <div className="completed-answers">
                                        {['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(question.questionType) && (
                                            <div className="mb-3">
                                                <strong>
                                                    {question.questionType === 'MULTIPLE_CHOICE_SINGLE'
                                                        ? "Выбранный ответ:"
                                                        : "Выбранные ответы:"}
                                                </strong>
                                                {question.options
                                                    .filter(opt => question.selectedAnswers.includes(opt.id))
                                                    .map(opt => (
                                                        <div key={opt.id} className="ms-2 text-success">
                                                            ✔ {opt.text}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                        {question.questionType === 'OPEN_ENDED_SINGLE' && (
                                            <div className="mb-3">
                                                <strong>Ваш ответ:</strong>
                                                <div className="ms-2 bg-light p-2 rounded">
                                                    {question.selectedAnswers[0] || 'Нет ответа'}
                                                </div>
                                            </div>
                                        )}

                                        {question.questionType === 'OPEN_ENDED_MULTI' && (
                                            <div className="mb-3">
                                                <strong>Ваш ответ:</strong>
                                                <pre className="ms-2 bg-light p-2 rounded">
                                    {question.selectedAnswers[0] || 'Нет ответа'}
                                </pre>
                                            </div>
                                        )}

                                        {question.questionType.startsWith('IMAGE_SELECTION') && (
                                            <div className="row">
                                                {question.options
                                                    .filter(opt => question.selectedAnswers.includes(opt.id))
                                                    .map(opt => (
                                                        <div key={opt.id}
                                                                className="col-4 text-center mb-3 position-relative">
                                                            <img
                                                                src={opt.url}
                                                                alt={opt.text}
                                                                className="img-thumbnail"
                                                                style={{
                                                                    border: '2px solid #28a745',
                                                                    opacity: 0.9
                                                                }}
                                                            />
                                                            <div
                                                                className="position-absolute top-0 end-0 m-1 bg-success text-white rounded-circle p-1">
                                                                ✓
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                        {question.questionType.includes('BUTTON_SELECT') && (
                                            <div className="slider-container">
                                                <div className="slider-track">
                                                    {question.options.map((option) => (
                                                        <div key={option.id} className="slide">
                                                            <div
                                                                className="d-block"
                                                                style={{
                                                                    backgroundColor: question.selectedAnswers.includes(option.id)
                                                                        ? '#28a745'
                                                                        : '#6c757d',
                                                                    color: 'white',
                                                                    opacity: 0.7,
                                                                    cursor: 'default'
                                                                }}
                                                            >
                                                                {option.text}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Оригинальные интерактивные элементы
                                    <>
                                        {question.options && (question.questionType === 'MULTIPLE_CHOICE_SINGLE' || question.questionType === 'MULTIPLE_CHOICE_MULTIPLE') && (
                                            question.options.map((option) => (
                                                <div key={option.id} className="form-check">
                                                    <input
                                                        type={question.questionType === 'MULTIPLE_CHOICE_SINGLE' ? 'radio' : 'checkbox'}
                                                        className="form-check-input"
                                                        value={option.id}
                                                        checked={question.selectedAnswers.includes(option.id)}
                                                        onChange={(e) => handleChange(e.target.value, question.id, question.questionType === 'MULTIPLE_CHOICE_MULTIPLE')}
                                                        disabled={isTestCompleted && userRole === 'STUDENT'}
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
                                                disabled={isTestCompleted && userRole === 'STUDENT'}
                                            />
                                        )}

                                        {question.questionType === 'OPEN_ENDED_MULTI' && (
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={question.selectedAnswers[0] || ''}
                                                onChange={(e) => handleChange(e.target.value, question.id, false)}
                                                disabled={isTestCompleted && userRole === 'STUDENT'}
                                            />
                                        )}

                                        {question.questionType === 'SINGLE_BUTTON_SELECT' && (
                                            <div className="slider-container">
                                                <div className="slider-track">
                                                    {question.options.map((option) => (
                                                        <div key={option.id} className="slide">
                                                            <button
                                                                type="button"
                                                                onClick={() => !isTestCompleted && handleChange(option.id, question.id, false)}
                                                                className="d-block"
                                                                style={{
                                                                    backgroundColor: question.selectedAnswers.includes(option.id)
                                                                        ? '#ff9900'
                                                                        : '#007bff',
                                                                    opacity: isTestCompleted ? 0.7 : 1
                                                                }}
                                                                disabled={isTestCompleted}
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
                                                                onClick={() => !isTestCompleted && handleChange(option.id, question.id, true)}
                                                                className="d-block"
                                                                style={{
                                                                    backgroundColor: question.selectedAnswers.includes(option.id)
                                                                        ? '#ff9900'
                                                                        : '#007bff',
                                                                    opacity: isTestCompleted ? 0.7 : 1
                                                                }}
                                                                disabled={isTestCompleted}
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
                                                        <img
                                                            src={option.url}
                                                            alt={option.text}
                                                            className="img-thumbnail"
                                                            style={{
                                                                cursor: isTestCompleted ? 'default' : 'pointer',
                                                                border: question.selectedAnswers.includes(option.id)
                                                                    ? '2px solid #28a745'
                                                                    : '1px solid #dee2e6'
                                                            }}
                                                        />
                                                        {!isTestCompleted && (
                                                            <input
                                                                className="form-check-input checkbox-overlay"
                                                                type="radio"
                                                                name={`selectedImage_${question.id}`}
                                                                value={option.id}
                                                                checked={question.selectedAnswers.includes(option.id)}
                                                                onChange={(e) => handleSingleImageSelect(e, question.id)}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {question.questionType === 'IMAGE_SELECTION_MULTIPLE' && (
                                            <div className="row">
                                                {question.options.map((option) => (
                                                    <div key={option.id} className="col-4 text-center mb-3">
                                                        <img
                                                            src={option.url}
                                                            alt={option.text}
                                                            className="img-thumbnail"
                                                            style={{
                                                                cursor: isTestCompleted ? 'default' : 'pointer',
                                                                border: question.selectedAnswers.includes(option.id)
                                                                    ? '2px solid #28a745'
                                                                    : '1px solid #dee2e6'
                                                            }}
                                                        />
                                                        {!isTestCompleted && (
                                                            <input
                                                                className="form-check-input checkbox-overlay"
                                                                type="checkbox"
                                                                value={option.id}
                                                                checked={question.selectedAnswers.includes(option.id)}
                                                                onChange={(e) => handleMultipleImageSelect(e, question.id)}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
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
                    <button
                        type={isTestCompleted ? "button" : "submit"}
                        className="btn btn-primary"
                        onClick={isTestCompleted ? handleCloseTest : undefined}
                    >
                        {isTestCompleted && userRole === 'STUDENT' ? (
                            'Закрыть'
                        ) : (userRole === 'TEACHER' || userRole === 'ADMIN') ?
                            'Сохранить тест' :
                            'Отправить ответы'}
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
    </>
    );
};

export default Forms;