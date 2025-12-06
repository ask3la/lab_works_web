// Объект для хранения выбранных блюд
const selectedDishes = {
    soup: null,
    main: null,
    drink: null
};

// Функция получения блюд по категориям с сортировкой
function getDishesByCategory() {
    const dishesByCategory = {
        'soup': [],
        'main': [],
        'drink': []
    };
    
    // Разделяем блюда по категориям
    dishes.forEach(dish => {
        if (dishesByCategory[dish.category]) {
            dishesByCategory[dish.category].push(dish);
        }
    });
    
    // Сортируем каждую категорию по алфавиту
    Object.keys(dishesByCategory).forEach(category => {
        dishesByCategory[category].sort((a, b) => {
            return a.name.localeCompare(b.name, 'ru');
        });
    });
    
    return dishesByCategory;
}

// Функция проверки, является ли строка URL
function isUrl(str) {
    if (!str || typeof str !== 'string') {
        return false;
    }
    return str.startsWith('http://') || str.startsWith('https://');
}

// Функция создания карточки блюда
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    
    // Создаем изображение только если есть image
    let img = null;
    if (dish.image) {
        img = document.createElement('img');
        img.alt = dish.name;
        
        // Проверяем, является ли image URL
        if (isUrl(dish.image)) {
            // Это URL - используем напрямую
            img.src = dish.image;
        } else {
            // Это не URL - пробуем открыть файл из папки images
            // Формируем путь: images/{category}/{image}
            const imagePath = `images/${dish.image}`;
            img.src = imagePath;
        }
        
        // Обработчик ошибки загрузки изображения
        img.onerror = function() {
            // Если изображение не загрузилось - скрываем его
            this.style.display = 'none';
            // Можно также удалить элемент, но скрытие безопаснее
        };
        
        // Добавляем изображение в карточку
        card.appendChild(img);
    }
    
    // Создаем элементы с информацией о блюде
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `${dish.price}₽`;
    
    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = dish.name;
    
    const weight = document.createElement('p');
    weight.className = 'weight';
    weight.textContent = dish.count;
    
    // Добавляем элементы в карточку
    card.appendChild(price);
    card.appendChild(name);
    card.appendChild(weight);
    
    return card;
}

// Функция отображения блюд на странице
function renderDishes() {
    // Получаем отсортированные блюда по категориям
    const dishesByCategory = getDishesByCategory();
    
    // Маппинг категорий к контейнерам
    const categoryContainers = {
        'soup': document.getElementById('soup-grid'),
        'main': document.getElementById('main-grid'),
        'drink': document.getElementById('drink-grid')
    };
    
    // Очищаем контейнеры и заполняем отсортированными блюдами
    Object.keys(categoryContainers).forEach(category => {
        const container = categoryContainers[category];
        container.innerHTML = '';
        
        // Добавляем карточки блюд из этой категории
        dishesByCategory[category].forEach(dish => {
            const card = createDishCard(dish);
            container.appendChild(card);
        });
    });
    
    // Добавляем обработчики кликов на карточки
    addCardClickHandlers();
}

// Функция добавления обработчиков кликов на карточки
function addCardClickHandlers() {
    const cards = document.querySelectorAll('.dish-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const keyword = this.getAttribute('data-dish');
            selectDish(keyword);
        });
    });
}

// Функция выбора блюда
function selectDish(keyword) {
    // Находим блюдо в массиве по keyword
    const dish = dishes.find(d => d.keyword === keyword);
    
    if (!dish) {
        return;
    }
    
    // Сохраняем выбранное блюдо в объект selectedDishes
    selectedDishes[dish.category] = dish;
    
    // Обновляем отображение блока "Ваш заказ"
    updateOrderSection();
    
    // Пересчитываем стоимость
    calculateTotal();
}

// Функция обновления блока "Ваш заказ"
function updateOrderSection() {
    const emptyOrder = document.getElementById('empty-order');
    const orderCategories = document.getElementById('order-categories');
    
    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasAnySelection = selectedDishes.soup || selectedDishes.main || selectedDishes.drink;
    
    if (!hasAnySelection) {
        // Ничего не выбрано
        emptyOrder.style.display = 'block';
        orderCategories.style.display = 'none';
        return;
    }
    
    // Что-то выбрано - показываем блоки категорий
    emptyOrder.style.display = 'none';
    orderCategories.style.display = 'block';
    
    // Обновляем каждую категорию
    updateCategory('soup', 'order-soup', 'soup-name', 'soup-price', 'Блюдо не выбрано');
    updateCategory('main', 'order-main', 'main-name', 'main-price', 'Блюдо не выбрано');
    updateCategory('drink', 'order-drink', 'drink-name', 'drink-price', 'Напиток не выбран');
}

// Функция обновления категории в заказе
function updateCategory(categoryKey, categoryElementId, nameElementId, priceElementId, emptyText) {
    const categoryElement = document.getElementById(categoryElementId);
    const nameElement = document.getElementById(nameElementId);
    const priceElement = document.getElementById(priceElementId);
    
    const selectedDish = selectedDishes[categoryKey];
    
    if (selectedDish) {
        // Блюдо выбрано
        categoryElement.style.display = 'block';
        nameElement.textContent = selectedDish.name;
        priceElement.textContent = `${selectedDish.price}₽`;
    } else {
        // Блюдо не выбрано
        categoryElement.style.display = 'block';
        nameElement.textContent = emptyText;
        priceElement.textContent = '';
    }
}

// Функция подсчета итоговой стоимости
function calculateTotal() {
    const totalElement = document.getElementById('order-total');
    const totalPriceElement = document.getElementById('total-price');
    
    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasAnySelection = selectedDishes.soup || selectedDishes.main || selectedDishes.drink;
    
    if (!hasAnySelection) {
        // Ничего не выбрано - скрываем блок стоимости
        totalElement.style.display = 'none';
        return;
    }
    
    // Вычисляем сумму цен всех выбранных блюд
    let total = 0;
    
    if (selectedDishes.soup) {
        total += selectedDishes.soup.price;
    }
    if (selectedDishes.main) {
        total += selectedDishes.main.price;
    }
    if (selectedDishes.drink) {
        total += selectedDishes.drink.price;
    }
    
    // Отображаем стоимость
    totalElement.style.display = 'block';
    totalPriceElement.textContent = `${total}₽`;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отображаем блюда на странице
    renderDishes();
    
    // Инициализируем блок заказа
    updateOrderSection();
    
    // Обработчик сброса формы
    const form = document.querySelector('.order-form');
    form.addEventListener('reset', function() {
        // Сбрасываем выбранные блюда
        selectedDishes.soup = null;
        selectedDishes.main = null;
        selectedDishes.drink = null;
        
        // Обновляем отображение
        updateOrderSection();
        calculateTotal();
    });
});
