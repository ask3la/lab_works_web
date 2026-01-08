
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

// Переменная для хранения текущего заказа для удаления
let currentDeleteOrderId = null;

// Переменная для хранения текущего заказа для редактирования
let currentEditOrderId = null;

// Загрузить все заказы
async function loadOrders() {
    try {
        const baseUrl = getApiBaseUrl();
        const apiUrl = `${baseUrl}/labs/api/orders?api_key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Для получения доступа к API необходимо пройти процедуру авторизации. Для этого нужно передать в запросе персональный API Key.');
            }
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        
        const orders = await response.json();
        
        // Сортируем по убыванию даты (сначала новые)
        orders.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB - dateA;
        });
        
        return orders;
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        throw error;
    }
}

// Загрузить данные конкретного заказа
async function loadOrderById(orderId) {
    try {
        const baseUrl = getApiBaseUrl();
        const apiUrl = `${baseUrl}/labs/api/orders/${orderId}?api_key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
        throw error;
    }
}

// Получить названия блюд для заказа
async function getDishNamesForOrder(order) {
    const dishNames = [];
    
    // Загружаем все блюда один раз
    if (typeof loadDishes === 'function') {
        await loadDishes();
    }
    
    const categoryMap = {
        soup_id: 'soup',
        main_course_id: 'main',
        salad_id: 'salad',
        drink_id: 'drink',
        dessert_id: 'dessert'
    };
    
    for (const [orderKey, category] of Object.entries(categoryMap)) {
        const dishId = order[orderKey];
        if (dishId) {
            try {
                const dish = await getDishById(dishId);
                if (dish) {
                    dishNames.push(dish.name);
                }
            } catch (error) {
                console.error(`Ошибка загрузки блюда ${dishId}:`, error);
            }
        }
    }
    
    return dishNames;
}

// Получить подробную информацию о блюдах заказа (с ценами)
async function getDishesDetailsForOrder(order) {
    const dishesDetails = [];
    
    // Проверяем, что getDishById доступна
    if (typeof getDishById !== 'function') {
        console.error('Функция getDishById не доступна!');
        return dishesDetails;
    }
    
    // Проверяем все возможные поля заказа
    const dishFields = [
        { field: 'soup_id', label: 'Суп' },
        { field: 'main_course_id', label: 'Основное блюдо' },
        { field: 'salad_id', label: 'Салат' },
        { field: 'drink_id', label: 'Напиток' },
        { field: 'dessert_id', label: 'Десерт' }
    ];
    
    // Загружаем блюда параллельно для ускорения
    const loadPromises = dishFields.map(async ({ field, label }) => {
        const dishId = order[field];
        if (!dishId) {
            console.log(`[getDishesDetailsForOrder] Поле ${field} пустое для заказа ${order.id}`);
            return null;
        }
        
        try {
            console.log(`[getDishesDetailsForOrder] Загружаю блюдо ID ${dishId} для поля ${field}...`);
            const dish = await getDishById(dishId);
            console.log(`[getDishesDetailsForOrder] Получено блюдо ID ${dishId}:`, dish);
            
            if (dish && dish.price !== undefined && dish.price !== null) {
                // Цена приходит как число из API
                const price = typeof dish.price === 'number' ? dish.price : parseInt(dish.price) || 0;
                console.log(`[getDishesDetailsForOrder] Цена блюда ${dishId}: ${price}₽ (тип: ${typeof dish.price})`);
                if (price > 0) {
                    return {
                        category: label,
                        name: dish.name || `Блюдо #${dishId}`,
                        price: price
                    };
                } else {
                    console.warn(`[getDishesDetailsForOrder] Цена блюда ${dishId} равна 0 или невалидна`);
                }
            } else {
                console.warn(`[getDishesDetailsForOrder] Блюдо ${dishId} не имеет цены:`, dish);
            }
        } catch (error) {
            console.error(`[getDishesDetailsForOrder] Ошибка загрузки блюда ${dishId} (${field}):`, error);
        }
        return null;
    });
    
    const results = await Promise.all(loadPromises);
    dishesDetails.push(...results.filter(item => item !== null));
    
    return dishesDetails;
}

// Форматировать дату
function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Форматировать дату и время
function formatDateTime(dateString) {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Форматировать время доставки
function formatDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time;
    }
    return 'Как можно скорее (с 7:00 до 23:00)';
}

// Рассчитать стоимость заказа на основе цен блюд из API
async function calculateOrderTotal(order) {
    // Если в заказе уже есть total_price и он больше 0, используем его
    if (order.total_price && order.total_price > 0) {
        return order.total_price;
    }
    
    // Иначе рассчитываем на основе цен блюд
    try {
        const dishesDetails = await getDishesDetailsForOrder(order);
        let total = 0;
        
        console.log(`[calculateOrderTotal] Заказ ${order.id}:`, {
            dishesDetailsCount: dishesDetails ? dishesDetails.length : 0,
            dishesDetails: dishesDetails
        });
        
        if (dishesDetails && dishesDetails.length > 0) {
            dishesDetails.forEach(dish => {
                if (dish && dish.price !== undefined && dish.price !== null) {
                    const price = typeof dish.price === 'number' ? dish.price : parseInt(dish.price) || 0;
                    total += price;
                    console.log(`[calculateOrderTotal] Добавлена цена: ${dish.name} = ${price}₽, итого: ${total}₽`);
                }
            });
        }
        
        console.log(`[calculateOrderTotal] Итоговая стоимость заказа ${order.id}: ${total}₽`);
        return total;
    } catch (error) {
        console.error('Ошибка при расчете стоимости заказа:', error);
        return 0;
    }
}

// Отобразить список заказов
async function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');
    
    if (!ordersList || !emptyOrders) return;
    
    try {
        const orders = await loadOrders();
        
        if (orders.length === 0) {
            ordersList.style.display = 'none';
            emptyOrders.style.display = 'block';
            return;
        }
        
        ordersList.style.display = 'block';
        emptyOrders.style.display = 'none';
        ordersList.innerHTML = '';
        
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            
            const dishNames = await getDishNamesForOrder(order);
            const dishNamesText = dishNames.length > 0 ? dishNames.join(', ') : 'Нет блюд';
            
            // Рассчитываем стоимость заказа на основе цен блюд из API
            const calculatedTotal = await calculateOrderTotal(order);
            
            // Убеждаемся, что стоимость отображается правильно
            const displayTotal = calculatedTotal > 0 ? calculatedTotal : 0;
            
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.innerHTML = `
                <div class="order-number">${i + 1}</div>
                <div class="order-info">
                    <div class="order-date">Дата оформления: ${formatDate(order.created_at)}</div>
                    <div class="order-dishes">Состав заказа: ${dishNamesText}</div>
                    <div class="order-price">Стоимость: ${displayTotal}₽</div>
                    <div class="order-delivery-time">Время доставки: ${formatDeliveryTime(order)}</div>
                </div>
                <div class="order-actions">
                    <button class="btn-action btn-details" onclick="showOrderDetails(${order.id})" title="Подробнее">
                        <i class="bi bi-info-circle"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="showEditOrder(${order.id})" title="Редактировать">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="showDeleteConfirmation(${order.id})" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            ordersList.appendChild(orderCard);
        }
    } catch (error) {
        showNotification(`Ошибка при загрузке заказов: ${error.message}`, 'error');
        ordersList.style.display = 'none';
        emptyOrders.style.display = 'block';
    }
}

// Показать детали заказа
async function showOrderDetails(orderId) {
    try {
        const order = await loadOrderById(orderId);
        const dishNames = await getDishNamesForOrder(order);
        const dishesDetails = await getDishesDetailsForOrder(order);
        
        const detailsContent = document.getElementById('order-details-content');
        if (!detailsContent) return;
        
        // Формируем подробный состав заказа с ценами
        let dishesDetailsHtml = '';
        if (dishesDetails.length > 0) {
            dishesDetailsHtml = '<div class="detail-item"><strong>Состав заказа:</strong><ul style="margin: 10px 0; padding-left: 20px;">';
            dishesDetails.forEach(dish => {
                dishesDetailsHtml += `<li>${dish.category}: ${dish.name} - ${dish.price}₽</li>`;
            });
            dishesDetailsHtml += '</ul></div>';
        } else {
            dishesDetailsHtml = '<div class="detail-item"><strong>Состав заказа:</strong> Нет блюд</div>';
        }
        
        // Рассчитываем стоимость заказа на основе цен блюд из API
        const calculatedTotal = await calculateOrderTotal(order);
        
        detailsContent.innerHTML = `
            <div class="detail-item">
                <strong>Номер заказа:</strong> ${order.id}
            </div>
            <div class="detail-item">
                <strong>Дата и время создания:</strong> ${formatDateTime(order.created_at)}
            </div>
            ${order.updated_at ? `<div class="detail-item"><strong>Дата и время обновления:</strong> ${formatDateTime(order.updated_at)}</div>` : ''}
            <div class="detail-item">
                <strong>Имя:</strong> ${order.full_name}
            </div>
            <div class="detail-item">
                <strong>Email:</strong> ${order.email}
            </div>
            <div class="detail-item">
                <strong>Телефон:</strong> ${order.phone}
            </div>
            <div class="detail-item">
                <strong>Адрес доставки:</strong> ${order.delivery_address}
            </div>
            <div class="detail-item">
                <strong>Тип доставки:</strong> ${order.delivery_type === 'now' ? 'Как можно скорее' : 'К указанному времени'}
            </div>
            <div class="detail-item">
                <strong>Время доставки:</strong> ${formatDeliveryTime(order)}
            </div>
            ${dishesDetailsHtml}
            <div class="detail-item">
                <strong>Итоговая стоимость:</strong> ${calculatedTotal}₽
            </div>
            ${order.comment ? `<div class="detail-item"><strong>Комментарий:</strong> ${order.comment}</div>` : '<div class="detail-item"><strong>Комментарий:</strong> Нет комментариев</div>'}
        `;
        
        document.getElementById('modal-details').style.display = 'flex';
    } catch (error) {
        showNotification(`Ошибка при загрузке заказа: ${error.message}`, 'error');
    }
}

// Показать форму редактирования
async function showEditOrder(orderId) {
    try {
        currentEditOrderId = orderId;
        const order = await loadOrderById(orderId);
        
        // Заполняем форму
        document.getElementById('edit-full_name').value = order.full_name || '';
        document.getElementById('edit-email').value = order.email || '';
        document.getElementById('edit-phone').value = order.phone || '';
        document.getElementById('edit-delivery_address').value = order.delivery_address || '';
        document.getElementById('edit-comment').value = order.comment || '';
        
        // Устанавливаем тип доставки
        if (order.delivery_type === 'by_time') {
            document.getElementById('edit-delivery-time-later').checked = true;
            document.getElementById('edit-delivery-time-group').style.display = 'block';
            document.getElementById('edit-delivery_time').value = order.delivery_time || '';
            document.getElementById('edit-delivery_time').required = true;
        } else {
            document.getElementById('edit-delivery-time-now').checked = true;
            document.getElementById('edit-delivery-time-group').style.display = 'none';
            document.getElementById('edit-delivery_time').required = false;
        }
        
        document.getElementById('modal-edit').style.display = 'flex';
    } catch (error) {
        showNotification(`Ошибка при загрузке заказа: ${error.message}`, 'error');
    }
}

// Показать подтверждение удаления
function showDeleteConfirmation(orderId) {
    currentDeleteOrderId = orderId;
    document.getElementById('modal-delete').style.display = 'flex';
}

// Подтвердить удаление
async function confirmDelete() {
    if (!currentDeleteOrderId) return;
    
    try {
        const baseUrl = getApiBaseUrl();
        const apiUrl = `${baseUrl}/labs/api/orders/${currentDeleteOrderId}?api_key=${API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }
        
        closeModal('modal-delete');
        showNotification('Заказ успешно удалён', 'success');
        
        // Обновляем список заказов
        await renderOrders();
        
        currentDeleteOrderId = null;
    } catch (error) {
        showNotification(`Ошибка при удалении заказа: ${error.message}`, 'error');
    }
}

// Закрыть модальное окно
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'modal-edit') {
        currentEditOrderId = null;
    }
    if (modalId === 'modal-delete') {
        currentDeleteOrderId = null;
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.style.display = 'flex';
}

// Закрыть уведомление
function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем и отображаем заказы
    await renderOrders();
    
    // Обработчик изменения типа доставки в форме редактирования
    const editDeliveryTypeInputs = document.querySelectorAll('#edit-order-form input[name="delivery_type"]');
    const editDeliveryTimeGroup = document.getElementById('edit-delivery-time-group');
    
    editDeliveryTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'by_time') {
                editDeliveryTimeGroup.style.display = 'block';
                document.getElementById('edit-delivery_time').required = true;
            } else {
                editDeliveryTimeGroup.style.display = 'none';
                document.getElementById('edit-delivery_time').required = false;
            }
        });
    });
    
    // Обработчик отправки формы редактирования
    const editForm = document.getElementById('edit-order-form');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!currentEditOrderId) return;
            
            // Собираем данные формы
            const formData = {
                full_name: document.getElementById('edit-full_name').value,
                email: document.getElementById('edit-email').value,
                phone: document.getElementById('edit-phone').value,
                delivery_address: document.getElementById('edit-delivery_address').value,
                delivery_type: document.querySelector('#edit-order-form input[name="delivery_type"]:checked').value,
                comment: document.getElementById('edit-comment').value || ''
            };
            
            // Добавляем время доставки, если выбрано "К указанному времени"
            if (formData.delivery_type === 'by_time') {
                const deliveryTime = document.getElementById('edit-delivery_time').value;
                if (!deliveryTime) {
                    showNotification('Укажите время доставки', 'error');
                    return;
                }
                formData.delivery_time = deliveryTime;
            }
            
            try {
                const baseUrl = getApiBaseUrl();
                const apiUrl = `${baseUrl}/labs/api/orders/${currentEditOrderId}?api_key=${API_KEY}`;
                
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
                }
                
                closeModal('modal-edit');
                showNotification('Заказ успешно изменён', 'success');
                
                // Обновляем список заказов
                await renderOrders();
                
                currentEditOrderId = null;
            } catch (error) {
                showNotification(`Ошибка при изменении заказа: ${error.message}`, 'error');
            }
        });
    }
    
    // Закрытие модальных окон при клике вне их
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
});

