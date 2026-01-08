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

// Функция сохранения заказа в localStorage
function saveOrder() {
    const orderData = {
        soup: selectedDishes.soup,
        main: selectedDishes.main,
        salad: selectedDishes.salad,
        drink: selectedDishes.drink,
        dessert: selectedDishes.dessert,
        ready_variant_price: readyVariantPrice
    };
    console.log('Сохраняю заказ:', orderData);
    console.log('ID блюд:', {
        soup_id: orderData.soup?.id,
        main_id: orderData.main?.id,
        salad_id: orderData.salad?.id,
        drink_id: orderData.drink?.id,
        dessert_id: orderData.dessert?.id
    });
    console.log('Полная структура блюд:', {
        soup: orderData.soup ? Object.keys(orderData.soup) : null,
        main: orderData.main ? Object.keys(orderData.main) : null,
        salad: orderData.salad ? Object.keys(orderData.salad) : null,
        drink: orderData.drink ? Object.keys(orderData.drink) : null,
        dessert: orderData.dessert ? Object.keys(orderData.dessert) : null
    });
    saveOrderToStorage(orderData);
}

// Функция загрузки заказа из localStorage
async function loadOrder() {
    const storedOrder = loadOrderFromStorage();
    if (!storedOrder) {
        return;
    }
    
    // Загружаем блюда по ID из localStorage
    const categoryMap = {
        soup_id: 'soup',
        main_id: 'main',
        salad_id: 'salad',
        drink_id: 'drink',
        dessert_id: 'dessert'
    };
    
    for (const [storageKey, category] of Object.entries(categoryMap)) {
        const dishId = storedOrder[storageKey];
        if (dishId) {
            try {
                const dish = await getDishById(dishId);
                if (dish) {
                    selectedDishes[category] = dish;
                }
            } catch (error) {
                console.error(`Ошибка загрузки блюда ${dishId}:`, error);
            }
        }
    }
    
    // Восстанавливаем фиксированную цену, если есть
    if (storedOrder.ready_variant_price !== null && storedOrder.ready_variant_price !== undefined) {
        readyVariantPrice = storedOrder.ready_variant_price;
    }
}

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
        console.error('Блюдо не найдено:', keyword);
        return;
    }
    
    // Проверяем наличие id у блюда
    if (!dish.id) {
        console.error('Блюдо не имеет поля id:', dish);
        console.error('Структура блюда:', Object.keys(dish));
    }
    
    // Сбрасываем фиксированную цену при ручном выборе блюда
    readyVariantPrice = null;
    
    // Убираем активный класс со всех вариантов ланча при ручном выборе
    document.querySelectorAll('.lunch-variant').forEach(variant => {
        variant.classList.remove('active');
    });
    
    // Сохраняем выбранное блюдо в объект selectedDishes
    selectedDishes[dish.category] = dish;
    
    // Сохраняем в localStorage
    saveOrder();
    
    // Обновляем панель перехода
    updateCheckoutPanel();
    
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
    
    // Сохраняем в localStorage
    saveOrder();
    
    // Обновляем панель перехода
    updateCheckoutPanel();
    
    // Обновляем визуальное выделение карточек
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
    
    // Для каждого keyword находим и выбираем блюдо
    keywordsArray.forEach(keyword => {
        const keywordTrimmed = keyword.trim();
        const dish = dishes.find(d => d.keyword === keywordTrimmed);
        
        if (dish) {
            selectedDishes[dish.category] = dish;
        }
    });
    
    // Сохраняем в localStorage
    saveOrder();
    
    // Обновляем панель перехода
    updateCheckoutPanel();
    
    // Обновляем визуальное выделение карточек
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

// Функция подсчета итоговой стоимости
function calculateTotal() {
    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasAnySelection = selectedDishes.soup || selectedDishes.main || 
                           selectedDishes.salad || selectedDishes.drink || 
                           selectedDishes.dessert;
    
    if (!hasAnySelection) {
        return 0;
    }
    
    // Если установлена фиксированная цена готового варианта - используем её
    if (readyVariantPrice !== null) {
        return readyVariantPrice;
    }
    
    // Вычисляем сумму цен всех выбранных блюд
    let total = 0;
    
    if (selectedDishes.soup) total += selectedDishes.soup.price;
    if (selectedDishes.main) total += selectedDishes.main.price;
    if (selectedDishes.salad) total += selectedDishes.salad.price;
    if (selectedDishes.drink) total += selectedDishes.drink.price;
    if (selectedDishes.dessert) total += selectedDishes.dessert.price;
    
    return total;
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
        return { isValid: false };
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
    
    return { isValid: false };
}

// Функция обновления панели перехода к оформлению
function updateCheckoutPanel() {
    const panel = document.getElementById('checkout-panel');
    if (!panel) return;
    
    const hasAnySelection = selectedDishes.soup || selectedDishes.main || 
                           selectedDishes.salad || selectedDishes.drink || 
                           selectedDishes.dessert;
    
    // Скрываем панель, если ничего не выбрано
    if (!hasAnySelection) {
        panel.classList.add('hidden');
        return;
    }
    
    // Показываем панель
    panel.classList.remove('hidden');
    
    // Обновляем стоимость
    const totalPriceElement = panel.querySelector('.total-price');
    if (totalPriceElement) {
        const total = calculateTotal();
        totalPriceElement.textContent = `${total}₽`;
    }
    
    // Проверяем валидность комбо и активируем/деактивируем ссылку
    const checkoutLink = panel.querySelector('.checkout-link');
    if (checkoutLink) {
        const validation = validateLunchCombo();
        if (validation.isValid) {
            checkoutLink.classList.remove('disabled');
            checkoutLink.removeAttribute('disabled');
        } else {
            checkoutLink.classList.add('disabled');
            checkoutLink.setAttribute('disabled', 'disabled');
        }
    }
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
        
        // Загружаем заказ из localStorage
        await loadOrder();
        
        // Отображаем блюда на странице
        renderDishes();
        
        // Инициализируем фильтры
        initFilters();
        
        // Инициализируем обработчики кликов на варианты ланча
        initLunchVariants();
        
        // Обновляем панель перехода
        updateCheckoutPanel();
        
        // Обновляем визуальное выделение карточек
        updateSelectedCards();
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        alert('Не удалось загрузить данные о блюдах. Пожалуйста, обновите страницу.');
    }
});

