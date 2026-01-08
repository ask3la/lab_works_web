// Объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Переменная для хранения фиксированной цены готового варианта ланча
let readyVariantPrice = null;

// API Key (нужно получить из СДО)
// ВАЖНО: Замените 'YOUR_API_KEY_HERE' на ваш реальный API ключ из СДО Московского Политеха

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

// Функция проверки, является ли строка URL
function isUrl(str) {
    if (!str || typeof str !== 'string') {
        return false;
    }
    return str.startsWith('http://') || str.startsWith('https://');
}

// Функция создания карточки блюда для страницы оформления заказа
function createCheckoutDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish-id', dish.id);
    
    // Создаем изображение только если есть image
    if (dish.image) {
        const img = document.createElement('img');
        img.alt = dish.name;
        
        if (isUrl(dish.image)) {
            img.src = dish.image;
        } else {
            img.src = `images/${dish.image}`;
        }
        
        img.onerror = function() {
            this.style.display = 'none';
        };
        
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
    
    // Кнопка удаления
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Удалить';
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeDishFromOrder(dish);
    });
    
    // Добавляем элементы в карточку
    card.appendChild(price);
    card.appendChild(name);
    card.appendChild(weight);
    card.appendChild(removeBtn);
    
    return card;
}

// Функция загрузки заказа из localStorage и отображения блюд
async function loadAndDisplayOrder() {
    // Проверяем, что есть в localStorage
    const rawStorage = localStorage.getItem('lunch_order');
    console.log('Сырые данные из localStorage:', rawStorage);
    
    const storedOrder = loadOrderFromStorage();
    console.log('Загружен заказ из localStorage:', storedOrder);
    
    if (!storedOrder) {
        // Нет заказа в localStorage
        const emptyCart = document.getElementById('empty-cart');
        const compositionContainer = document.getElementById('order-composition');
        if (emptyCart) emptyCart.style.display = 'block';
        if (compositionContainer) compositionContainer.style.display = 'none';
        console.log('Нет заказа в localStorage');
        return;
    }
    
    // Проверяем, есть ли хотя бы одно блюдо
    const hasAnyDishId = storedOrder.soup_id || storedOrder.main_id || 
                         storedOrder.salad_id || storedOrder.drink_id || 
                         storedOrder.dessert_id;
    
    if (!hasAnyDishId) {
        const emptyCart = document.getElementById('empty-cart');
        const compositionContainer = document.getElementById('order-composition');
        if (emptyCart) emptyCart.style.display = 'block';
        if (compositionContainer) compositionContainer.style.display = 'none';
        console.log('В localStorage нет ID блюд');
        return;
    }
    
    console.log('Найдены ID блюд:', {
        soup_id: storedOrder.soup_id,
        main_id: storedOrder.main_id,
        salad_id: storedOrder.salad_id,
        drink_id: storedOrder.drink_id,
        dessert_id: storedOrder.dessert_id
    });
    
    // Загружаем блюда по ID из localStorage
    const categoryMap = {
        soup_id: 'soup',
        main_id: 'main',
        salad_id: 'salad',
        drink_id: 'drink',
        dessert_id: 'dessert'
    };
    
    const compositionContainer = document.getElementById('order-composition');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!compositionContainer || !emptyCart) {
        console.error('Не найдены необходимые элементы DOM');
        return;
    }
    
    compositionContainer.innerHTML = '';
    
    let hasAnyDish = false;
    
    // Загружаем блюда параллельно для ускорения
    const loadPromises = [];
    
    for (const [storageKey, category] of Object.entries(categoryMap)) {
        const dishId = storedOrder[storageKey];
        if (dishId) {
            const loadPromise = (async () => {
                try {
                    console.log(`Загружаю блюдо ${dishId} для категории ${category}`);
                    const dish = await getDishById(dishId);
                    if (dish) {
                        // Преобразуем категорию main-course в main, если нужно
                        if (dish.category === 'main-course') {
                            dish.category = 'main';
                        }
                        selectedDishes[category] = dish;
                        const card = createCheckoutDishCard(dish);
                        compositionContainer.appendChild(card);
                        console.log(`Блюдо ${dish.name} добавлено в заказ`);
                        return true;
                    }
                } catch (error) {
                    console.error(`Ошибка загрузки блюда ${dishId}:`, error);
                }
                return false;
            })();
            loadPromises.push(loadPromise);
        }
    }
    
    // Ждем загрузки всех блюд
    const results = await Promise.all(loadPromises);
    hasAnyDish = results.some(result => result === true);
    
    // Восстанавливаем фиксированную цену, если есть
    if (storedOrder.ready_variant_price !== null && storedOrder.ready_variant_price !== undefined) {
        readyVariantPrice = storedOrder.ready_variant_price;
    }
    
    if (!hasAnyDish) {
        emptyCart.style.display = 'block';
        compositionContainer.style.display = 'none';
        console.log('Нет блюд в заказе');
    } else {
        emptyCart.style.display = 'none';
        // Убеждаемся, что контейнер виден
        compositionContainer.style.display = 'grid';
        compositionContainer.style.visibility = 'visible';
        compositionContainer.style.opacity = '1';
        const loadedCount = Object.values(selectedDishes).filter(d => d !== null).length;
        console.log(`Загружено блюд: ${loadedCount}`);
        console.log('Контейнер должен быть виден:', compositionContainer.style.display);
        console.log('Количество карточек в контейнере:', compositionContainer.children.length);
    }
    
    // Обновляем форму
    updateOrderForm();
}

// Функция удаления блюда из заказа
function removeDishFromOrder(dish) {
    // Находим категорию блюда
    const category = dish.category === 'main-course' ? 'main' : dish.category;
    
    // Удаляем блюдо из selectedDishes
    selectedDishes[category] = null;
    
    // Сохраняем в localStorage
    saveOrderToStorage(selectedDishes);
    
    // Удаляем карточку из DOM
    const card = document.querySelector(`[data-dish-id="${dish.id}"]`);
    if (card) {
        card.remove();
    }
    
    // Проверяем, остались ли блюда
    const hasAnyDish = selectedDishes.soup || selectedDishes.main || 
                       selectedDishes.salad || selectedDishes.drink || 
                       selectedDishes.dessert;
    
    if (!hasAnyDish) {
        document.getElementById('empty-cart').style.display = 'block';
        document.getElementById('order-composition').style.display = 'none';
    }
    
    // Обновляем форму
    updateOrderForm();
}

// Функция обновления формы заказа
function updateOrderForm() {
    // Обновляем каждую категорию
    updateCategory('soup', 'soup-name', 'soup-price', 'Не выбран');
    updateCategory('main', 'main-name', 'main-price', 'Не выбрано');
    updateCategory('salad', 'salad-name', 'salad-price', 'Не выбран');
    updateCategory('drink', 'drink-name', 'drink-price', 'Не выбран');
    updateCategory('dessert', 'dessert-name', 'dessert-price', 'Не выбран');
    
    // Обновляем итоговую стоимость
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        const total = calculateTotal();
        totalPriceElement.textContent = `${total}₽`;
    }
}

// Функция обновления категории в форме
function updateCategory(categoryKey, nameElementId, priceElementId, emptyText) {
    const nameElement = document.getElementById(nameElementId);
    const priceElement = document.getElementById(priceElementId);
    
    if (!nameElement || !priceElement) return;
    
    const selectedDish = selectedDishes[categoryKey];
    
    if (selectedDish) {
        nameElement.textContent = selectedDish.name;
        priceElement.textContent = `${selectedDish.price}₽`;
    } else {
        nameElement.textContent = emptyText;
        priceElement.textContent = '';
    }
}

// Функция подсчета итоговой стоимости
function calculateTotal() {
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
        return {
            isValid: false,
            message: 'Ничего не выбрано. Выберите блюда для заказа'
        };
    }
    
    // Проверяем соответствие одному из 5 вариантов ланча
    const variant1 = hasSoup && hasMain && hasSalad && hasDrink;
    const variant2 = hasSoup && hasMain && hasDrink && !hasSalad;
    const variant3 = hasSoup && hasSalad && hasDrink && !hasMain;
    const variant4 = hasMain && hasSalad && hasDrink && !hasSoup;
    const variant5 = hasMain && hasDrink && !hasSoup && !hasSalad;
    
    // Если соответствует одному из вариантов - валидно (десерт можно добавлять к любому)
    if (variant1 || variant2 || variant3 || variant4 || variant5) {
        return { isValid: true };
    }
    
    return {
        isValid: false,
        message: 'Выбранные блюда не соответствуют ни одному варианту ланча'
    };
}

// Функция отправки заказа на сервер
async function submitOrder(formData) {
    try {
        const baseUrl = getApiBaseUrl();
        const apiUrl = `${baseUrl}/labs/api/orders?api_key=${API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        throw error;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Загружаем и отображаем заказ
        await loadAndDisplayOrder();
        
        // Обработчик изменения типа доставки
        const deliveryTypeInputs = document.querySelectorAll('input[name="delivery_type"]');
        const deliveryTimeGroup = document.getElementById('delivery-time-group');
        
        deliveryTypeInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value === 'by_time') {
                    deliveryTimeGroup.style.display = 'block';
                    document.getElementById('delivery_time').required = true;
                } else {
                    deliveryTimeGroup.style.display = 'none';
                    document.getElementById('delivery_time').required = false;
                }
            });
        });
        
        // Обработчик отправки формы
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Проверяем состав ланча
                const validation = validateLunchCombo();
                
                if (!validation.isValid) {
                    alert(validation.message);
                    return;
                }
                
                // Собираем данные формы
                const formData = {
                    full_name: document.getElementById('full_name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    delivery_address: document.getElementById('delivery_address').value,
                    delivery_type: document.querySelector('input[name="delivery_type"]:checked').value,
                    subscribe: document.getElementById('subscribe').checked ? 1 : 0,
                    comment: document.getElementById('comment').value || ''
                };
                
                // Добавляем время доставки, если выбрано "К указанному времени"
                if (formData.delivery_type === 'by_time') {
                    const deliveryTime = document.getElementById('delivery_time').value;
                    if (!deliveryTime) {
                        alert('Укажите время доставки');
                        return;
                    }
                    formData.delivery_time = deliveryTime;
                }
                
                // Добавляем ID блюд
                if (selectedDishes.soup) formData.soup_id = selectedDishes.soup.id;
                if (selectedDishes.main) formData.main_course_id = selectedDishes.main.id;
                if (selectedDishes.salad) formData.salad_id = selectedDishes.salad.id;
                if (selectedDishes.drink) formData.drink_id = selectedDishes.drink.id;
                if (selectedDishes.dessert) formData.dessert_id = selectedDishes.dessert.id;
                
                try {
                    // Отправляем заказ на сервер
                    await submitOrder(formData);
                    
                    // Успешно отправлено - очищаем localStorage
                    clearOrderFromStorage();
                    
                    // Показываем сообщение об успехе
                    alert('Заказ успешно оформлен!');
                    
                    // Перенаправляем на страницу заказов или главную
                    window.location.href = 'orders.html';
                } catch (error) {
                    // Ошибка при отправке - показываем сообщение, но не очищаем localStorage
                    alert(`Ошибка при оформлении заказа: ${error.message}`);
                }
            });
        }
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        alert('Не удалось загрузить данные о заказе. Пожалуйста, обновите страницу.');
    }
});

