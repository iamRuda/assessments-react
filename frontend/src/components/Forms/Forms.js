import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forms.css'; // Не забудьте создать и подключить файл стилей
import "./slider.css";

const Forms = () => {
    const [formData, setFormData] = useState({
        googleFormsUsed: '',
        hobbies: [],
        selectedImage: '',
        selectedImages: [],
        selectedButton: '', // Состояние для одной выбранной кнопки
        selectedButtons: [] // Состояние для нескольких выбранных кнопок
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                hobbies: checked
                    ? [...prevData.hobbies, value]
                    : prevData.hobbies.filter((hobby) => hobby !== value)
            }));
        } else if (type === 'radio') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleImageSelect = (e) => {
        const { value, type } = e.target;
        if (type === 'radio') {
            setFormData((prevData) => ({
                ...prevData,
                selectedImage: value,
                selectedImages: [] // очищаем массив выбранных изображений
            }));
        } else if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                selectedImages: prevData.selectedImages.includes(value)
                    ? prevData.selectedImages.filter((img) => img !== value)
                    : [...prevData.selectedImages, value]
            }));
        }
    };

    const handleSingleButtonSelect = (buttonNumber) => {
        setFormData((prevData) => ({
            ...prevData,
            selectedButton: buttonNumber // Устанавливаем только одну выбранную кнопку
        }));
    };

    const handleMultipleButtonSelect = (buttonNumber) => {
        setFormData((prevData) => {
            const isSelected = prevData.selectedButtons.includes(buttonNumber);
            return {
                ...prevData,
                selectedButtons: isSelected
                    ? prevData.selectedButtons.filter((btn) => btn !== buttonNumber) // Удаляем кнопку, если она уже выбрана
                    : [...prevData.selectedButtons, buttonNumber] // Добавляем кнопку в массив
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Анкета</h2>
            <form onSubmit={handleSubmit}>
                {/* Вопрос 1 */}
                <div className="card mb-4 p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <h5 className="mb-3">Вы когда-нибудь использовали Google Формы?</h5>
                    <p>Пожалуйста, выберите один из вариантов ниже.</p>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="googleFormsUsed"
                            id="yes"
                            value="Да"
                            checked={formData.googleFormsUsed === 'Да'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="yes">Да</label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="googleFormsUsed"
                            id="no"
                            value="Нет"
                            checked={formData.googleFormsUsed === 'Нет'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="no">Нет</label>
                    </div>
                    <p className="mt-2" style={{ color: '#6c757d' }}>
                        Ваш ответ помогает нам понять опыт пользователей с Google Формами.
                    </p>
                </div>

                {/* Вопрос 2 - Множественный выбор */}
                <div className="card mb-4 p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <h5 className="mb-3">Каковы ваши увлечения? (Вы можете выбрать несколько)</h5>
                    <p>Выберите все, что вам подходит.</p>
                    {['Чтение', 'Путешествия', 'Кулинария'].map((hobby) => (
                        <div className="form-check" key={hobby}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="hobbies"
                                id={hobby}
                                value={hobby}
                                checked={formData.hobbies.includes(hobby)}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor={hobby}>{hobby}</label>
                        </div>
                    ))}
                    <p className="mt-2" style={{ color: '#6c757d' }}>
                        Увлечения помогают нам узнать больше о ваших интересах!
                    </p>
                </div>

                {/* Вопрос 3 - Выбор одного изображения */}                
                <div className="card mb-4 p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <h5 className="mb-3">Выберите ваше любимое изображение (Вы можете выбрать только одно)</h5>
                    <p>Пожалуйста, выберите одно изображение из предложенных ниже.</p>
                    <div className="row">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <div key={index} className="col-4 text-center mb-3 position-relative">
                                <label htmlFor={`image${index}`} className="d-block position-relative img-form">
                                    <img
                                        src={`https://via.placeholder.com/100?text=${index + 1}`}
                                        alt={`Опция ${index + 1}`}
                                        className="img-thumbnail"
                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                    />
                                    <input
                                        className="form-check-input checkbox-overlay"
                                        type="radio"
                                        id={`image${index}`}
                                        name="selectedImage"
                                        value={`Single Image ${index + 1}`}
                                        checked={formData.selectedImage === `Single Image ${index + 1}`}
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2" style={{ color: '#6c757d' }}>
                        Выбирайте внимательно! Ваше любимое изображение может отражать ваш стиль.
                    </p>
                </div>

                {/* Вопрос 4 - Выбор изображений */}                
                <div className="card mb-4 p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <h5 className="mb-3">Выберите ваши любимые изображения (Вы можете выбрать несколько)</h5>
                    <p>Выберите столько изображений, сколько хотите.</p>
                    <div className="row">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <div key={index} className="col-4 text-center mb-3 position-relative">
                                <label htmlFor={`checkboxImage${index}`} className="d-block position-relative img-form">
                                    <img
                                        src={`https://via.placeholder.com/100?text=${index + 1}`}
                                        alt={`Опция ${index + 1}`}
                                        className="img-thumbnail"
                                        style={{ cursor: 'pointer', borderRadius: '10px' }}
                                    />
                                    <input
                                        className="form-check-input checkbox-overlay"
                                        type="checkbox"
                                        id={`checkboxImage${index}`}
                                        value={`Multiple Image ${index + 1}`}
                                        checked={formData.selectedImages.includes(`Multiple Image ${index + 1}`)}
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2" style={{ color: '#6c757d' }}>
                        Не стесняйтесь выражать себя с помощью нескольких выборов!
                    </p>
                </div>

                {/* Вопрос 5 - Выбор одной кнопки */}                
                <div className="card mb-4 p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <h5 className="mb-3">Выберите вашу любимую кнопку из слайдера (Вы можете выбрать только одну)</h5>
                    <p>Нажмите на любую кнопку, чтобы выбрать вашу любимую.</p>
                    <div className="slider-container">
                        <div className="slider-track">
                            {Array.from({ length: 100 }).map((_, index) => (
                                <div key={index} className="slide">
                                    <label htmlFor={`sliderButton${index}`} className="d-block">
                                        <button
                                            type="button"
                                            onClick={() => handleSingleButtonSelect(`Кнопка ${index + 1}`)} // Используйте отдельный обработчик
                                            className="d-block"
                                            style={{
                                                backgroundColor: formData.selectedButton === `Кнопка ${index + 1}` ? '#ff9900' : '#007bff', // Измените цвет на оранжевый
                                            }}
                                        >
                                            {index + 1}
                                        </button>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-2" style={{ color: '#6c757d' }}>
                        Ваш выбор поможет нам лучше понять ваши предпочтения.
                    </p>
                </div>

                {/* Вопрос 6 - Выбор нескольких кнопок */}                
                <div className="card mb-4 p-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <h5 className="mb-3">Выберите ваши любимые кнопки из слайдера (Вы можете выбрать несколько)</h5>
                    <p>Нажмите на любую кнопку, чтобы выбрать вашу любимую.</p>
                    <div className="slider-container">
                        <div className="slider-track">
                            {Array.from({ length: 100 }).map((_, index) => (
                                <div key={index} className="slide">
                                    <label htmlFor={`multipleSliderButton${index}`} className="d-block">
                                        <button
                                            type="button"
                                            onClick={() => handleMultipleButtonSelect(`Кнопка ${index + 1}`)} // Используйте отдельный обработчик
                                            className="d-block"
                                            style={{
                                                backgroundColor: formData.selectedButtons.includes(`Кнопка ${index + 1}`) ? '#ff9900' : '#007bff', // Измените цвет на оранжевый
                                            }}
                                        >
                                            {index + 1}
                                        </button>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-2" style={{ color: '#6c757d' }}>
                        Выберите несколько кнопок, которые вам нравятся!
                    </p>
                </div>

                {/* Кнопка отправки */}
                <button type="submit" className="btn btn-primary">Отправить анкету</button>
            </form>
        </div>
    );
};

export default Forms;
