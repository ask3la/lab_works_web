// Массив блюд для меню (будет заполнен через API)
let dishes = [];

// Функция загрузки блюд через API
async function loadDishes() {
    try {
        // Определяем URL API в зависимости от хостинга
        // Для хостинга Московского Политеха
        const apiUrlPolytech = 'http://lab7-api.std-900.ist.mospolytech.ru/api/dishes';
        // Для Netlify или GitHub Pages
        const apiUrlEdu = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
        
        // Определяем, какой URL использовать
        // Если текущий хост содержит mospolytech.ru, используем первый URL
        // Иначе используем второй URL
        let apiUrl = apiUrlEdu; // По умолчанию используем URL для Netlify/GitHub Pages
        
        if (window.location.hostname.includes('mospolytech.ru') || 
            window.location.hostname === 'std-900.ist.mospolytech.ru') {
            apiUrl = apiUrlPolytech;
        }
        
        // Выполняем запрос к API
        const response = await fetch(apiUrl);
        
        // Проверяем, успешен ли запрос
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        
        // Парсим JSON ответ
        const data = await response.json();
        
        // Преобразуем данные: заменяем "main-course" на "main" для совместимости с существующим кодом
        dishes = data.map(dish => {
            if (dish.category === 'main-course') {
                return { ...dish, category: 'main' };
            }
            return dish;
        });
        
        return dishes;
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        // В случае ошибки можно вернуть пустой массив или показать сообщение пользователю
        dishes = [];
        throw error;
    }
}

