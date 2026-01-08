// Массив блюд для меню (будет заполнен через API)
let dishes = [];

// API Key (используется для запросов к API)
// ВАЖНО: Замените 'YOUR_API_KEY_HERE' на ваш реальный API ключ из СДО Московского Политеха
const API_KEY = '8221c797-eb86-48a8-a6a8-b7e448764807';

// Функция получения базового URL API
function getApiBaseUrl() {
    const apiUrlPolytech = 'http://lab8-api.std-900.ist.mospolytech.ru';
    const apiUrlEdu = 'https://edu.std-900.ist.mospolytech.ru';
    
    if (window.location.hostname.includes('mospolytech.ru') || 
        window.location.hostname === 'std-900.ist.mospolytech.ru') {
        return apiUrlPolytech;
    }
    return apiUrlEdu;
}

// Функция загрузки блюд через API
async function loadDishes() {
    try {
        const baseUrl = getApiBaseUrl();
        const apiUrl = `${baseUrl}/labs/api/dishes?api_key=${API_KEY}`;
        
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
        dishes = [];
        throw error;
    }
}

// Функция получения блюда по ID
async function getDishById(dishId) {
    try {
        const baseUrl = getApiBaseUrl();
        const apiUrl = `${baseUrl}/labs/api/dishes/${dishId}?api_key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        
        const dish = await response.json();
        
        // Преобразуем категорию если нужно
        if (dish.category === 'main-course') {
            dish.category = 'main';
        }
        
        return dish;
    } catch (error) {
        console.error('Ошибка при загрузке блюда:', error);
        throw error;
    }
}

