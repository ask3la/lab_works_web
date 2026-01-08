// Объект для хранения выбранных блюд
const selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Переменная для хранения фиксированной цены готового варианта ланча
let readyVariantPrice = null;

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
    
    // Обновляем визуальное выделение выбранных карточек
    updateSelectedCards();
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
    
    // Сбрасываем фиксированную цену при ручном выборе блюда
    readyVariantPrice = null;
    
    // Убираем активный класс со всех вариантов ланча при ручном выборе
    document.querySelectorAll('.lunch-variant').forEach(variant => {
        variant.classList.remove('active');
    });
    
    // Сохраняем выбранное блюдо в объект selectedDishes
    selectedDishes[dish.category] = dish;
    
    // Обновляем отображение блока "Ваш заказ" (внутри этой функции уже вызывается updateFormHiddenFields)
    updateOrderSection();
    
    // Пересчитываем стоимость
    calculateTotal();
    
    // Обновляем визуальное выделение карточек
    updateSelectedCards();
}

// Функция автоматического выбора блюд из варианта ланча
function selectLunchVariant(categories) {
    // Сбрасываем фиксированную цену для обычных вариантов
    readyVariantPrice = null;
    
    // Сначала очищаем все выбранные блюда
    selectedDishes.soup = null;
    selectedDishes.main = null;
    selectedDishes.salad = null;
    selectedDishes.drink = null;
    selectedDishes.dessert = null;
    
    // Разбиваем строку категорий на массив
    const categoryArray = categories.split(',');
    
    // Для каждой категории выбираем первое доступное блюдо
    categoryArray.forEach(category => {
        const categoryTrimmed = category.trim();
        const dishesInCategory = getDishesByCategory()[categoryTrimmed];
        
        if (dishesInCategory && dishesInCategory.length > 0) {
            // Выбираем первое блюдо из категории
            const firstDish = dishesInCategory[0];
            selectedDishes[categoryTrimmed] = firstDish;
        }
    });
    
    // Все категории, которые не были указаны в варианте, остаются null (уже очищены выше)
    
    // Обновляем отображение
    updateOrderSection();
    calculateTotal();
    updateSelectedCards();
}

// Функция выбора конкретных блюд по keywords (для готовых вариантов)
function selectReadyVariant(dishKeywords, fixedPrice) {
    // Сначала очищаем все выбранные блюда
    selectedDishes.soup = null;
    selectedDishes.main = null;
    selectedDishes.salad = null;
    selectedDishes.drink = null;
    selectedDishes.dessert = null;
    
    // Сохраняем фиксированную цену (или сбрасываем, если не передана)
    if (fixedPrice) {
        readyVariantPrice = parseInt(fixedPrice);
    } else {
        readyVariantPrice = null;
    }
    
    // Разбиваем строку keywords на массив
    const keywordsArray = dishKeywords.split(',');
    
    // Определяем, какие категории будут выбраны
    const selectedCategories = new Set();
    
    // Для каждого keyword находим и выбираем блюдо
    keywordsArray.forEach(keyword => {
        const keywordTrimmed = keyword.trim();
        const dish = dishes.find(d => d.keyword === keywordTrimmed);
        
        if (dish) {
            selectedDishes[dish.category] = dish;
            selectedCategories.add(dish.category);
        }
    });
    
    // Все категории, которые не были выбраны, остаются null (уже очищены выше)
    
    // Обновляем отображение
    updateOrderSection();
    calculateTotal();
    updateSelectedCards();
}

// Функция обновления визуального выделения выбранных карточек
function updateSelectedCards() {
    // Убираем выделение со всех карточек
    document.querySelectorAll('.dish-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Добавляем выделение на выбранные карточки
    Object.keys(selectedDishes).forEach(category => {
        const dish = selectedDishes[category];
        if (dish) {
            const card = document.querySelector(`[data-dish="${dish.keyword}"]`);
            if (card) {
                card.classList.add('selected');
            }
        }
    });
}

// Функция обновления скрытых полей формы с выбранными блюдами
// Все данные о блюдах хранятся только в order_data, поэтому эта функция только удаляет старые поля
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
    // Все данные о блюдах будут только в order_data, который добавляется при отправке формы
    fieldsToRemove.forEach(field => field.remove());
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
    
    // Если установлена фиксированная цена готового варианта - используем её
    if (readyVariantPrice !== null) {
        totalElement.style.display = 'block';
        totalPriceElement.textContent = `${readyVariantPrice}₽`;
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

// Функция проверки состава ланча
function validateLunchCombo() {
    const hasSoup = selectedDishes.soup !== null;
    const hasMain = selectedDishes.main !== null;
    const hasSalad = selectedDishes.salad !== null;
    const hasDrink = selectedDishes.drink !== null;
    const hasDessert = selectedDishes.dessert !== null;
    
    // Проверяем, выбрано ли хотя бы одно блюдо (кроме десерта)
    const hasAnyMainDish = hasSoup || hasMain || hasSalad || hasDrink;
    
    // Если ничего не выбрано (даже десерт)
    if (!hasAnyMainDish && !hasDessert) {
        return {
            isValid: false,
            notificationType: 'nothing_selected',
            message: 'Ничего не выбрано. Выберите блюда для заказа',
            image: 'https://cdn-icons-png.flaticon.com/512/3081/3081990.png'
        };
    }
    
    // Проверяем соответствие одному из 5 вариантов ланча
    // Вариант 1: Суп + Главное блюдо + Салат + Напиток
    const variant1 = hasSoup && hasMain && hasSalad && hasDrink;
    // Вариант 2: Суп + Главное блюдо + Напиток
    const variant2 = hasSoup && hasMain && hasDrink && !hasSalad;
    // Вариант 3: Суп + Салат + Напиток
    const variant3 = hasSoup && hasSalad && hasDrink && !hasMain;
    // Вариант 4: Главное блюдо + Салат + Напиток
    const variant4 = hasMain && hasSalad && hasDrink && !hasSoup;
    // Вариант 5: Главное блюдо + Напиток
    const variant5 = hasMain && hasDrink && !hasSoup && !hasSalad;
    
    // Если соответствует одному из вариантов - валидно (десерт можно добавлять к любому)
    if (variant1 || variant2 || variant3 || variant4 || variant5) {
        return { isValid: true };
    }
    
    // Если не соответствует ни одному варианту - определяем, чего не хватает
    
    // Если выбран только напиток и/или десерт (нет главного блюда)
    // Эта проверка должна быть раньше, чтобы не конфликтовать с другими
    if ((hasDrink || hasDessert) && !hasMain && !hasSoup && !hasSalad) {
        return {
            isValid: false,
            notificationType: 'no_main',
            message: 'Выберите главное блюдо',
            image: 'https://cdn-icons-png.flaticon.com/512/3081/3081982.png'
        };
    }
    
    // Если выбран суп, но не выбраны главное блюдо и салат
    if (hasSoup && !hasMain && !hasSalad && !hasDrink) {
        return {
            isValid: false,
            notificationType: 'no_main_or_salad',
            message: 'Выберите главное блюдо/салат/стартер',
            image: 'https://cdn-icons-png.flaticon.com/512/3081/3081982.png'
        };
    }
    
    // Если выбран салат, но не выбраны суп и главное блюдо
    if (hasSalad && !hasSoup && !hasMain && !hasDrink) {
        return {
            isValid: false,
            notificationType: 'no_soup_or_main',
            message: 'Выберите суп или главное блюдо',
            image: 'https://cdn-icons-png.flaticon.com/512/3081/3081981.png'
        };
    }
    
    // Если выбраны все необходимые блюда, кроме напитка
    // Проверяем все возможные комбинации, которые требуют напиток
    if ((hasSoup && hasMain && hasSalad && !hasDrink) ||
        (hasSoup && hasMain && !hasSalad && !hasDrink) ||
        (hasSoup && !hasMain && hasSalad && !hasDrink) ||
        (!hasSoup && hasMain && hasSalad && !hasDrink) ||
        (!hasSoup && hasMain && !hasSalad && !hasDrink)) {
        return {
            isValid: false,
            notificationType: 'no_drink',
            message: 'Выберите напиток',
            image: 'https://cdn-icons-png.flaticon.com/512/3081/3081984.png'
        };
    }
    
    // Другие случаи (не должны возникать при правильной логике)
    return {
        isValid: false,
        notificationType: 'invalid_combo',
        message: 'Выбранные блюда не соответствуют ни одному варианту ланча',
        image: 'https://cdn-icons-png.flaticon.com/512/3081/3081990.png'
    };
}

// Функция создания и отображения уведомления
function showNotification(message) {
    // Удаляем предыдущее уведомление, если оно есть
    const existingNotification = document.querySelector('.notification-overlay');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Создаем контейнер уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Создаем текст уведомления
    const text = document.createElement('p');
    text.className = 'notification-text';
    text.textContent = message;
    
    // Создаем кнопку "Окей" с иконкой
    const button = document.createElement('button');
    button.className = 'notification-button';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'notification-icon';
    iconSpan.textContent = '👍';
    button.appendChild(document.createTextNode('Окей '));
    button.appendChild(iconSpan);
    
    // Обработчик клика на кнопку
    button.addEventListener('click', function() {
        overlay.remove();
    });
    
    // Обработчик клика на overlay (закрытие при клике вне уведомления)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    // Собираем структуру
    notification.appendChild(text);
    notification.appendChild(button);
    overlay.appendChild(notification);
    
    // Добавляем в DOM
    document.body.appendChild(overlay);
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

// Функция инициализации обработчиков кликов на варианты ланча
function initLunchVariants() {
    const variants = document.querySelectorAll('.lunch-variant');
    
    variants.forEach(variant => {
        variant.addEventListener('click', function() {
            const categories = this.getAttribute('data-categories');
            const dishKeywords = this.getAttribute('data-dishes');
            
            // Убираем активный класс со всех вариантов
            variants.forEach(v => v.classList.remove('active'));
            
            // Добавляем активный класс к выбранному варианту
            this.classList.add('active');
            
            if (dishKeywords) {
                // Это готовый вариант с конкретными блюдами
                const fixedPrice = this.getAttribute('data-price');
                selectReadyVariant(dishKeywords, fixedPrice);
            } else if (categories) {
                // Это обычный вариант с категориями
                selectLunchVariant(categories);
            }
            
            // Прокручиваем к форме заказа для удобства
            const formContainer = document.querySelector('.order-form-container');
            if (formContainer) {
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        
        // Добавляем курсор pointer для интерактивности
        variant.style.cursor = 'pointer';
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Загружаем блюда через API
        await loadDishes();
        
        // Отображаем блюда на странице
        renderDishes();
        
        // Инициализируем фильтры
        initFilters();
        
        // Инициализируем блок заказа
        updateOrderSection();
        
        // Инициализируем обработчики кликов на варианты ланча
        initLunchVariants();
        
        // Обработчик отправки формы
        const form = document.querySelector('.order-form');
        if (form) {
            // Флаг для разрешения отправки после валидации
            let allowSubmit = false;
            
            form.addEventListener('submit', function(e) {
                // Если отправка уже разрешена - пропускаем
                if (allowSubmit) {
                    return true;
                }
                
                e.preventDefault(); // Предотвращаем стандартную отправку формы
                
                // Проверяем состав ланча
                const validation = validateLunchCombo();
                
                if (!validation.isValid) {
                    // Показываем уведомление с ошибкой
                    showNotification(validation.message);
                    return false; // Не отправляем форму
                }
                
                // Если валидация прошла успешно - отправляем форму
                // Обновляем скрытые поля формы с данными о заказе
                updateFormHiddenFields();
                
                // Добавляем скрытое поле с данными заказа в формате JSON
                const existingOrderDataField = form.querySelector('input[name="order_data"]');
                if (existingOrderDataField) {
                    existingOrderDataField.remove();
                }
                
                const orderDataField = document.createElement('input');
                orderDataField.type = 'hidden';
                orderDataField.name = 'order_data';
                
                // Собираем данные заказа - только текущие выбранные блюда
                const orderData = {
                    order: {}
                };
                
                // Добавляем только те блюда, которые действительно выбраны (не null и не undefined)
                Object.keys(selectedDishes).forEach(category => {
                    const dish = selectedDishes[category];
                    // Проверяем, что блюдо действительно выбрано (не null, не undefined, и является объектом)
                    if (dish && dish !== null && typeof dish === 'object' && dish.keyword) {
                        orderData.order[category] = {
                            keyword: dish.keyword,
                            name: dish.name,
                            price: dish.price
                        };
                    }
                });
                
                // Вычисляем итоговую стоимость
                let totalPrice = 0;
                if (readyVariantPrice !== null) {
                    // Если есть фиксированная цена готового варианта, используем её
                    totalPrice = readyVariantPrice;
                    orderData.ready_variant_price = readyVariantPrice;
                } else {
                    // Иначе вычисляем сумму цен всех выбранных блюд
                    Object.keys(selectedDishes).forEach(category => {
                        const dish = selectedDishes[category];
                        // Проверяем, что блюдо действительно выбрано (не null, не undefined, и является объектом)
                        if (dish && dish !== null && typeof dish === 'object' && dish.price) {
                            totalPrice += dish.price;
                        }
                    });
                }
                
                // Добавляем итоговую стоимость в order_data
                orderData.total_price = totalPrice;
                
                orderDataField.value = JSON.stringify(orderData);
                form.appendChild(orderDataField);
                
                // Разрешаем стандартную отправку формы
                allowSubmit = true;
                form.submit();
            });
            
            // Обработчик сброса формы
            form.addEventListener('reset', function() {
                // Сбрасываем выбранные блюда
                selectedDishes.soup = null;
                selectedDishes.main = null;
                selectedDishes.salad = null;
                selectedDishes.drink = null;
                selectedDishes.dessert = null;
                
                // Сбрасываем фиксированную цену готового варианта
                readyVariantPrice = null;
                
                // Сбрасываем фильтры
                Object.keys(activeFilters).forEach(category => {
                    activeFilters[category] = null;
                });
                
                // Убираем active со всех фильтров
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Убираем активный класс со всех вариантов ланча
                document.querySelectorAll('.lunch-variant').forEach(variant => {
                    variant.classList.remove('active');
                });
                
                // Обновляем отображение
                renderDishes();
                updateOrderSection();
                calculateTotal();
                updateSelectedCards();
            });
        }
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        // Можно показать сообщение пользователю об ошибке загрузки данных
        alert('Не удалось загрузить данные о блюдах. Пожалуйста, обновите страницу.');
    }
});

