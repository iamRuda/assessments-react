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
                id: 'question8', // New question ID
                questionHeader: 'Опишите, как вы решаете проблемы в коде:',
                questionText: 'Поделитесь вашим опытом и подходами.',
                questionPostscript: 'Это многострочный ответ.',
                questionType: 'open_ended',
                responseType: 'multi_line', // This specifies that it's a multi-line response
                selectedAnswers: [] // Store multi-line response
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
