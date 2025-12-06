// Объект для хранения выбранных блюд
const selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Объект для хранения активных фильтров по категориям
const activeFilters = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Функция получения блюд по категориям с сортировкой
function getDishesByCategory() {
    const dishesByCategory = {
        'soup': [],
        'main': [],
        'salad': [],
        'drink': [],
        'dessert': []
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

// Функция фильтрации блюд по категории и kind
function filterDishesByKind(dishesList, kind) {
    if (!kind) {
        return dishesList; // Если фильтр не выбран, возвращаем все блюда
    }
    return dishesList.filter(dish => dish.kind === kind);
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

// Функция отображения блюд в категории с учетом фильтра
function renderCategoryDishes(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Получаем все блюда категории
    const allDishes = getDishesByCategory()[category];
    
    // Применяем фильтр, если он активен
    const activeFilter = activeFilters[category];
    const filteredDishes = filterDishesByKind(allDishes, activeFilter);
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем карточки отфильтрованных блюд
    filteredDishes.forEach(dish => {
        const card = createDishCard(dish);
        container.appendChild(card);
    });
    
    // Добавляем обработчики кликов на карточки
    addCardClickHandlers();
}

// Функция отображения блюд на странице
function renderDishes() {
    // Отображаем блюда для каждой категории
    renderCategoryDishes('soup', 'soup-grid');
    renderCategoryDishes('main', 'main-grid');
    renderCategoryDishes('salad', 'salad-grid');
    renderCategoryDishes('drink', 'drink-grid');
    renderCategoryDishes('dessert', 'dessert-grid');
}

// Функция добавления обработчиков кликов на карточки
function addCardClickHandlers() {
    const cards = document.querySelectorAll('.dish-card');
    
    cards.forEach(card => {
        // Удаляем старые обработчики, если они есть
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Добавляем новый обработчик
        newCard.addEventListener('click', function() {
            const keyword = this.getAttribute('data-dish');
            selectDish(keyword);
        });
    });
}

// Функция обработки клика на фильтр
function handleFilterClick(category, filterButton) {
    const kind = filterButton.getAttribute('data-kind');
    const currentFilter = activeFilters[category];
    
    // Если кликнули по уже активному фильтру - снимаем фильтр
    if (currentFilter === kind) {
        activeFilters[category] = null;
        filterButton.classList.remove('active');
    } else {
        // Убираем active со всех фильтров категории
        const filterContainer = filterButton.parentElement;
        const allFilters = filterContainer.querySelectorAll('.filter-btn');
        allFilters.forEach(btn => btn.classList.remove('active'));
        
        // Устанавливаем новый активный фильтр
        activeFilters[category] = kind;
        filterButton.classList.add('active');
    }
    
    // Перерисовываем блюда категории
    const categoryContainers = {
        'soup': 'soup-grid',
        'main': 'main-grid',
        'salad': 'salad-grid',
        'drink': 'drink-grid',
        'dessert': 'dessert-grid'
    };
    
    renderCategoryDishes(category, categoryContainers[category]);
}

// Функция инициализации фильтров
function initFilters() {
    const filterConfigs = [
        { category: 'soup', containerId: 'soup-filters' },
        { category: 'main', containerId: 'main-filters' },
        { category: 'salad', containerId: 'salad-filters' },
        { category: 'drink', containerId: 'drink-filters' },
        { category: 'dessert', containerId: 'dessert-filters' }
    ];
    
    filterConfigs.forEach(config => {
        const filterContainer = document.getElementById(config.containerId);
        if (!filterContainer) return;
        
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleFilterClick(config.category, this);
            });
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
    
    // Обновляем отображение блока "Ваш заказ" (внутри этой функции уже вызывается updateFormHiddenFields)
    updateOrderSection();
    
    // Пересчитываем стоимость
    calculateTotal();
}

// Функция обновления скрытых полей формы с выбранными блюдами
function updateFormHiddenFields() {
    const form = document.querySelector('.order-form');
    if (!form) return;
    
    // Удаляем все скрытые поля, связанные с блюдами
    // Сначала собираем все поля в массив, чтобы избежать проблем с "живой" коллекцией
    const allHiddenFields = Array.from(form.querySelectorAll('input[type="hidden"]'));
    const fieldsToRemove = allHiddenFields.filter(field => {
        const name = field.name;
        // Определяем поля, которые относятся к блюдам
        return name.startsWith('dish_') || 
               name === 'soup_name' || name === 'soup_price' ||
               name === 'main_name' || name === 'main_price' ||
               name === 'salad_name' || name === 'salad_price' ||
               name === 'drink_name' || name === 'drink_price' ||
               name === 'dessert_name' || name === 'dessert_price';
    });
    
    // Удаляем найденные поля
    fieldsToRemove.forEach(field => field.remove());
    
    // Добавляем скрытые поля для выбранных блюд (только одно поле каждого типа)
    Object.keys(selectedDishes).forEach(category => {
        const dish = selectedDishes[category];
        if (dish) {
            // Добавляем поле с keyword блюда
            const keywordField = document.createElement('input');
            keywordField.type = 'hidden';
            keywordField.name = `dish_${category}`;
            keywordField.value = dish.keyword;
            form.appendChild(keywordField);
            
            // Добавляем поле с названием блюда
            const nameField = document.createElement('input');
            nameField.type = 'hidden';
            nameField.name = `${category}_name`;
            nameField.value = dish.name;
            form.appendChild(nameField);
            
            // Добавляем поле с ценой блюда
            const priceField = document.createElement('input');
            priceField.type = 'hidden';
            priceField.name = `${category}_price`;
            priceField.value = dish.price;
            form.appendChild(priceField);
        }
    });
}

// Функция обновления блока "Ваш заказ"
function updateOrderSection() {
    const emptyOrder = document.getElementById('empty-order');
    const orderCategories = document.getElementById('order-categories');
    
    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasAnySelection = selectedDishes.soup || selectedDishes.main || 
                           selectedDishes.salad || selectedDishes.drink || 
                           selectedDishes.dessert;
    
    if (!hasAnySelection) {
        // Ничего не выбрано
        emptyOrder.style.display = 'block';
        orderCategories.style.display = 'none';
        // Удаляем скрытые поля
        updateFormHiddenFields();
        return;
    }
    
    // Что-то выбрано - показываем блоки категорий
    emptyOrder.style.display = 'none';
    orderCategories.style.display = 'block';
    
    // Обновляем каждую категорию
    updateCategory('soup', 'order-soup', 'soup-name', 'soup-price', 'Блюдо не выбрано');
    updateCategory('main', 'order-main', 'main-name', 'main-price', 'Блюдо не выбрано');
    updateCategory('salad', 'order-salad', 'salad-name', 'salad-price', 'Блюдо не выбрано');
    updateCategory('drink', 'order-drink', 'drink-name', 'drink-price', 'Напиток не выбран');
    updateCategory('dessert', 'order-dessert', 'dessert-name', 'dessert-price', 'Десерт не выбран');
    
    // Обновляем скрытые поля формы
    updateFormHiddenFields();
}

// Функция обновления категории в заказе
function updateCategory(categoryKey, categoryElementId, nameElementId, priceElementId, emptyText) {
    const categoryElement = document.getElementById(categoryElementId);
    const nameElement = document.getElementById(nameElementId);
    const priceElement = document.getElementById(priceElementId);
    
    if (!categoryElement || !nameElement || !priceElement) return;
    
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
    
    if (!totalElement || !totalPriceElement) return;
    
    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasAnySelection = selectedDishes.soup || selectedDishes.main || 
                           selectedDishes.salad || selectedDishes.drink || 
                           selectedDishes.dessert;
    
    if (!hasAnySelection) {
        // Ничего не выбрано - скрываем блок стоимости
        totalElement.style.display = 'none';
        return;
    }
    
    // Вычисляем сумму цен всех выбранных блюд
    let total = 0;
    
    if (selectedDishes.soup) total += selectedDishes.soup.price;
    if (selectedDishes.main) total += selectedDishes.main.price;
    if (selectedDishes.salad) total += selectedDishes.salad.price;
    if (selectedDishes.drink) total += selectedDishes.drink.price;
    if (selectedDishes.dessert) total += selectedDishes.dessert.price;
    
    // Отображаем стоимость
    totalElement.style.display = 'block';
    totalPriceElement.textContent = `${total}₽`;
}

// Функция сбора данных формы в структурированный объект
function collectFormData() {
    const form = document.querySelector('.order-form');
    if (!form) return null;
    
    const formData = new FormData(form);
    const data = {
        order: {}
    };
    
    // Собираем данные о выбранных блюдах в объект order
    Object.keys(selectedDishes).forEach(category => {
        const dish = selectedDishes[category];
        if (dish) {
            data.order[category] = {
                keyword: dish.keyword,
                name: dish.name,
                price: dish.price
            };
        }
    });
    
    // Собираем остальные данные формы
    formData.forEach((value, key) => {
        // Пропускаем скрытые поля блюд, так как они уже в order
        if (!key.startsWith('dish_') && 
            key !== 'soup_name' && key !== 'soup_price' &&
            key !== 'main_name' && key !== 'main_price' &&
            key !== 'salad_name' && key !== 'salad_price' &&
            key !== 'drink_name' && key !== 'drink_price' &&
            key !== 'dessert_name' && key !== 'dessert_price') {
            data[key] = value;
        }
    });
    
    return data;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отображаем блюда на странице
    renderDishes();
    
    // Инициализируем фильтры
    initFilters();
    
    // Инициализируем блок заказа
    updateOrderSection();
    
    // Обработчик отправки формы - отправляем данные в формате JSON
    const form = document.querySelector('.order-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Предотвращаем стандартную отправку формы
            
            // Собираем данные в нужном формате
            const data = collectFormData();
            
            if (!data) {
                alert('Ошибка при сборе данных формы');
                return;
            }
            
            // Отправляем данные через fetch в формате JSON
            fetch('https://httpbin.org/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                // Перенаправляем на страницу с результатом или показываем сообщение
                console.log('Данные отправлены:', result);
                // Можно показать alert или перенаправить на другую страницу
                alert('Заказ успешно отправлен!');
                // Опционально: form.reset(); для очистки формы
            })
            .catch(error => {
                console.error('Ошибка при отправке:', error);
                alert('Произошла ошибка при отправке заказа');
            });
        });
        
        // Обработчик сброса формы
        form.addEventListener('reset', function() {
            // Сбрасываем выбранные блюда
            selectedDishes.soup = null;
            selectedDishes.main = null;
            selectedDishes.salad = null;
            selectedDishes.drink = null;
            selectedDishes.dessert = null;
            
            // Сбрасываем фильтры
            Object.keys(activeFilters).forEach(category => {
                activeFilters[category] = null;
            });
            
            // Убираем active со всех фильтров
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Обновляем отображение
            renderDishes();
            updateOrderSection();
            calculateTotal();
        });
    }
});

