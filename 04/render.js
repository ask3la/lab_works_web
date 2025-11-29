// Отображение блюд на странице
function renderDishes() {
    const categoryMap = {
        'soup': 'soup-container',
        'main': 'main-container',
        'drink': 'drink-container',
        'dessert': 'dessert-container'
    };

    // Группируем блюда по категориям
    const dishesByCategory = {};
    dishes.forEach(dish => {
        if (!dishesByCategory[dish.category]) {
            dishesByCategory[dish.category] = [];
        }
        dishesByCategory[dish.category].push(dish);
    });

    // Сортируем блюда в каждой категории и выводим
    Object.keys(dishesByCategory).forEach(category => {
        // Сортировка по названию (name) в алфавитном порядке
        dishesByCategory[category].sort((a, b) => {
            return a.name.localeCompare(b.name, 'ru');
        });

        const containerId = categoryMap[category];
        const container = document.getElementById(containerId);

        dishesByCategory[category].forEach(dish => {
            const dishCard = createDishCard(dish);
            container.appendChild(dishCard);
        });
    });
}

// Создание карточки блюда
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.dataset.dish = dish.keyword;

    card.innerHTML = `
        <img src="${dish.image}.jpg" alt="${dish.name}" class="dish-image">
        <h4>${dish.name}</h4>
        <p class="count">${dish.count}</p>
        <p class="price">${dish.price} ₽</p>
    `;

    card.addEventListener('click', () => selectDish(dish));

    return card;
}

// Объект для хранения выбранных блюд
const selectedDishes = {
    soup: null,
    main: null,
    drink: null,
    dessert: null
};

// Выбор блюда при клике
function selectDish(dish) {
    selectedDishes[dish.category] = dish;
    updateOrder();
}

// Обновление раздела "Ваш заказ"
function updateOrder() {
    const emptyMessage = document.getElementById('empty-message');
    const orderCategories = document.getElementById('order-categories');
    const totalCostBlock = document.getElementById('total-cost-block');

    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasSelected = Object.values(selectedDishes).some(dish => dish !== null);

    if (!hasSelected) {
        // Ничего не выбрано
        emptyMessage.style.display = 'block';
        orderCategories.style.display = 'none';
        totalCostBlock.style.display = 'none';
        return;
    }

    // Показываем категории и скрываем пустое сообщение
    emptyMessage.style.display = 'none';
    orderCategories.style.display = 'block';

    // Обновляем каждую категорию
    updateCategoryDisplay('soup');
    updateCategoryDisplay('main');
    updateCategoryDisplay('drink');
    updateCategoryDisplay('dessert');

    // Обновляем и показываем итоговую стоимость
    updateTotalCost();
    totalCostBlock.style.display = 'block';
}

// Обновление отображения категории
function updateCategoryDisplay(category) {
    const dish = selectedDishes[category];
    const orderElement = document.getElementById(`${category}-order`);
    const priceElement = document.getElementById(`${category}-price`);

    if (dish) {
        orderElement.textContent = dish.name;
        priceElement.textContent = `${dish.price} ₽`;
    } else {
        // Определяем текст для разных категорий
        if (category === 'drink') {
            orderElement.textContent = 'Напиток не выбран';
        } else {
            orderElement.textContent = 'Блюдо не выбрано';
        }
        priceElement.textContent = '';
    }
}

// Подсчет итоговой стоимости
function updateTotalCost() {
    let totalPrice = 0;

    Object.values(selectedDishes).forEach(dish => {
        if (dish) {
            totalPrice += dish.price;
        }
    });

    const totalCostElement = document.getElementById('total-cost');
    totalCostElement.textContent = `${totalPrice} ₽`;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderDishes();

    // Обработка отправки формы
    document.querySelector('.order-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        // Проверяем, выбрано ли хотя бы одно блюдо
        const hasSelected = Object.values(selectedDishes).some(dish => dish !== null);

        if (!hasSelected) {
            alert('Пожалуйста, выберите хотя бы одно блюдо!');
            return;
        }

        // Выводим информацию о заказе в консоль (в реальном приложении - отправка на сервер)
        console.log('Заказ:', {
            name,
            phone,
            address,
            dishes: selectedDishes
        });

        alert(`Спасибо за заказ, ${name}! Заказ оформлен.`);
        
        // Очистка формы
        document.querySelector('.order-form').reset();
        selectedDishes.soup = null;
        selectedDishes.main = null;
        selectedDishes.drink = null;
        selectedDishes.dessert = null;
        updateOrder();
    });
});
