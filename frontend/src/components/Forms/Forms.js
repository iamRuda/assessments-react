import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forms.css';
import './slider.css';
import { Link } from 'react-router-dom';

const Forms = () => {
    const [formData, setFormData] = useState({});
    const [jsonData, setJsonData] = useState({
        questions: [
            {
                id: 'question1',
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'multiple_choice_single',
                options: ['Да', 'Нет'],
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question2',
                questionHeader: 'Выберите языки программирования, которые вы знаете:',
                questionText: 'Вы можете выбрать несколько вариантов.',
                questionPostscript: 'Убедитесь, что вы выбрали все подходящие.',
                questionType: 'multiple_choice_multiple',
                options: ['JavaScript', 'Python', 'Java', 'C++'],
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
                selectedAnswers: []
            },
            {
                id: 'question4', // New question ID
                questionHeader: 'Опишите, как вы решаете проблемы в коде:',
                questionText: 'Поделитесь вашим опытом и подходами.',
                questionPostscript: 'Это многострочный ответ.',
                questionType: 'open_ended',
                responseType: 'multi_line', // This specifies that it's a multi-line response
                selectedAnswers: [] // Store multi-line response
            },
            {
                id: 'question5',
                questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать только одну)',
                questionText: 'Нажмите на любую кнопку, чтобы выбрать вашу любимую.',
                questionType: 'single_button_select',
                buttonOptions: {
                    1: '1',
                    2: '2',
                    3: '3',
                    4: '4',
                    5: '5'
                },
                selectedAnswers: []
            },
            {
                id: 'question6',
                questionHeader: 'Выберите вашу любимую кнопку из слайдера (Вы можете выбрать несколько)',
                questionText: 'Нажмите на любые кнопки, чтобы выбрать ваши любимые.',
                questionType: 'multiple_button_select',
                buttonOptions: {
                    1: '1',
                    2: '2',
                    3: '3',
                    4: '4',
                    5: '5'
                },
                selectedAnswers: []
            },
            {
                id: 'question7',
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'image_selection_single',
                options: {
                    option1: {
                        id: '1',
                        label: 'Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option2: {
                        id: '2',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option3: {
                        id: '3',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option4: {
                        id: '4',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option5: {
                        id: '5',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option6: {
                        id: '6',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option7: {
                        id: '7',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option8: {
                        id: '8',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option9: {
                        id: '9',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    }
                },
                correctAnswers: [],
                selectedAnswers: []
            },
            {
                id: 'question8',
                questionHeader: 'Вы когда-нибудь использовали Google Формы?',
                questionText: 'Пожалуйста, выберите один из вариантов ниже.',
                questionPostscript: 'Ваш ответ помогает нам понять опыт пользователей с Google Формами.',
                questionType: 'image_selection_multiple',
                options: {
                    option1: {
                        id: '1',
                        label: 'Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option2: {
                        id: '2',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option3: {
                        id: '3',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option4: {
                        id: '4',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option5: {
                        id: '5',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option6: {
                        id: '6',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option7: {
                        id: '7',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option8: {
                        id: '8',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    },
                    option9: {
                        id: '9',
                        label: 'No Google Forms',
                        imageUrl: 'https://via.placeholder.com/100'
                    }
                },
                correctAnswers: [],
                selectedAnswers: []
            }
        ]
    });

    const [isEditingJson, setIsEditingJson] = useState({});

    const handleChange = (e, questionId, isMultiple) => {
        const { value, checked } = e.target;
    
        setFormData((prevData) => {
            if (isMultiple) {
                const updatedValues = prevData[questionId] ? [...prevData[questionId]] : [];
                if (checked) {
                    updatedValues.push(value);
                } else {
                    const index = updatedValues.indexOf(value);
                    if (index > -1) {
                        updatedValues.splice(index, 1);
                    }
                }
    
                // Update selectedAnswers in jsonData
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
                const newValue = value; // Capture the input response
                
                // Update selectedAnswers in jsonData
                setJsonData((prevData) => ({
                    ...prevData,
                    questions: prevData.questions.map((q) =>
                        q.id === questionId ? { ...q, selectedAnswers: [newValue] } : q // Update selectedAnswers
                    )
                }));
    
                return {
                    ...prevData,
                    [questionId]: newValue // Save answer
                };
            }
        });
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


    const handleSingleButtonSelect = (buttonId, questionId) => {
        setFormData((prevData) => ({
            ...prevData,
            [questionId]: buttonId
        }));
    
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((q) =>
                q.id === questionId ? { ...q, selectedAnswers: [buttonId] } : q
            )
        }));
    };

    const handleMultipleButtonSelect = (buttonId, questionId) => {
        setJsonData((prevData) => ({
          ...prevData,
          questions: prevData.questions.map((q) => {
            if (q.id === questionId) {
              const isSelected = q.selectedAnswers.includes(buttonId);
              const newSelectedAnswers = isSelected
                ? q.selectedAnswers.filter((id) => id !== buttonId)
                : [...q.selectedAnswers, buttonId];
      
              return { ...q, selectedAnswers: newSelectedAnswers };
            }
            return q;
          })
        }));
      };
    
    const handleSingleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value; // id выбранного изображения
    
        // Обновляем данные в состоянии
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) => 
                question.id === questionId
                    ? { ...question, selectedAnswers: [selectedValue] } // Обновляем выбранный ответ для данного вопроса
                    : question
            )
        }));
    };

    const handleMultipleImageSelect = (e, questionId) => {
        const selectedValue = e.target.value; // id выбранного изображения
        const isChecked = e.target.checked; // флаг, отмечен ли чекбокс
    
        // Обновляем данные в состоянии
        setJsonData((prevData) => ({
            ...prevData,
            questions: prevData.questions.map((question) => 
                question.id === questionId
                    ? {
                        ...question,
                        selectedAnswers: isChecked
                            ? [...question.selectedAnswers, selectedValue] // Если выбрали, добавляем
                            : question.selectedAnswers.filter((answer) => answer !== selectedValue) // Если сняли, убираем
                    }
                    : question
            )
        }));
    };

    const handleAddQuestion = () => {
        const newQuestionId = `question_${Date.now()}_${Math.floor(Math.random() * 1000)}`; // Generate a unique ID using timestamp and random number
        const existingIds = jsonData.questions.map(q => q.id);
    
        // Проверяем на уникальность ID
        if (existingIds.includes(newQuestionId)) {
            alert('ID вопроса должен быть уникальным!');
            return;
        }
    
        const newQuestion = {
            id: newQuestionId,
            questionHeader: `Новый вопрос ${jsonData.questions.length + 1}`,
            questionText: 'Введите текст вопроса.',
            questionPostscript: '',
            questionType: 'multiple_choice_single',
            options: ['Да', 'Нет'], 
            correctAnswers: [],
            selectedAnswers: []
        };
    
        setJsonData((prevData) => ({
            ...prevData,
            questions: [...prevData.questions, newQuestion]
        }));
    
        setIsEditingJson((prevState) => ({
            ...prevState,
            [newQuestionId]: false
        }));
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

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-4">Анкета</h2>
                <button type="button" className="btn btn-success" onClick={handleAddQuestion}>Добавить вопрос</button>
            </div>
            <Link to="/dashboard" className="mb-3">{"<<"} Вернуться на главную</Link>

            <form onSubmit={handleSubmit}>
                {jsonData.questions.map((question) => (
                    <div key={question.id} className="card mb-4 p-3 shadow-sm position-relative" style={{ borderRadius: '10px' }}>
                        <h5 className="mb-3">{question.questionHeader}</h5>
                        
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
                                {question.options && question.questionType === 'multiple_choice_single' && (
                                    question.options.map((option, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                value={option}
                                                checked={question.selectedAnswers.includes(option)}
                                                onChange={(e) => handleChange(e, question.id, false)}
                                            />
                                            <label className="form-check-label">{option}</label>
                                        </div>
                                    ))
                                )}
                                {question.options && question.questionType === 'multiple_choice_multiple' && (
                                    question.options.map((option, index) => (
                                        <div key={index} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                value={option}
                                                checked={question.selectedAnswers.includes(option)}
                                                onChange={(e) => handleChange(e, question.id, true)}
                                            />
                                            <label className="form-check-label">{option}</label>
                                        </div>
                                    ))
                                )}
                                {question.questionType === 'open_ended' && question.responseType === 'single_line' && (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={question.selectedAnswers[0] || ''}
                                        onChange={(e) => handleChange(e, question.id, false)}
                                    />
                                )}
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
                                            {Object.entries(question.buttonOptions).map(([id, label]) => (
                                                <div key={id} className="slide">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSingleButtonSelect(id, question.id)}
                                                        className="d-block"
                                                        style={{
                                                            backgroundColor: question.selectedAnswers.includes(id) ? '#ff9900' : '#007bff'
                                                        }}
                                                    >
                                                        {label}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {question.questionType === 'multiple_button_select' && (
                                <div className="slider-container">
                                    <div className="slider-track">
                                    {Object.entries(question.buttonOptions).map(([id, label]) => (
                                        <div key={id} className="slide">
                                        <button
                                            type="button"
                                            onClick={() => handleMultipleButtonSelect(id, question.id)}
                                            className="d-block"
                                            style={{
                                            backgroundColor: question.selectedAnswers.includes(id) ? '#ff9900' : '#007bff'
                                            }}
                                        >
                                            {label}
                                        </button>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                )}
                                {question.questionType === 'image_selection_single' && (
                                    <div className="row">
                                        {Object.values(question.options).map((option, index) => (
                                            <div key={option.id} className="col-4 text-center mb-3">
                                                <label htmlFor={`image_${question.id}_${option.id}`} className="d-block position-relative img-form">
                                                    <img
                                                        src={option.imageUrl}
                                                        alt={option.label}
                                                        className="img-thumbnail"
                                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                                    />
                                                    <input
                                                        className="form-check-input checkbox-overlay"
                                                        type="radio"
                                                        id={`image_${question.id}_${option.id}`} // Составной id
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

                                {question.questionType === 'image_selection_multiple' && ( // Проверка для множественного выбора
                                    <div className="row">
                                        {Object.values(question.options).map((option, index) => (
                                            <div key={option.id} className="col-4 text-center mb-3">
                                                <label htmlFor={`image_${question.id}_${option.id}`} className="d-block position-relative img-form">
                                                    <img
                                                        src={option.imageUrl}
                                                        alt={option.label}
                                                        className="img-thumbnail"
                                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                                    />
                                                    <input
                                                        className="form-check-input checkbox-overlay"
                                                        type="checkbox" // Используем чекбокс для множественного выбора
                                                        id={`image_${question.id}_${option.id}`} // Составной id
                                                        value={option.id}
                                                        checked={question.selectedAnswers.includes(option.id)} // Проверка, выбрано ли изображение
                                                        onChange={(e) => handleMultipleImageSelect(e, question.id)} // Обработчик выбора
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
