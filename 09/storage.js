// Модуль для работы с localStorage
// Хранит только идентификаторы выбранных блюд

const STORAGE_KEY = 'lunch_order';

// Структура данных в localStorage:
// {
//   soup_id: 1,
//   main_id: 8,
//   salad_id: 16,
//   drink_id: 19,
//   dessert_id: null,
//   ready_variant_price: 750 (опционально)
// }

// Сохранить заказ в localStorage
function saveOrderToStorage(orderData) {
    try {
        // Проверяем наличие id у каждого блюда
        const storageData = {};
        
        // Суп
        if (orderData.soup && orderData.soup.id !== undefined && orderData.soup.id !== null) {
            storageData.soup_id = orderData.soup.id;
            console.log('Сохранен суп с ID:', orderData.soup.id, orderData.soup.name);
        } else {
            storageData.soup_id = null;
            if (orderData.soup) {
                console.warn('Суп не имеет ID:', orderData.soup);
            }
        }
        
        // Главное блюдо
        if (orderData.main && orderData.main.id !== undefined && orderData.main.id !== null) {
            storageData.main_id = orderData.main.id;
            console.log('Сохранено главное блюдо с ID:', orderData.main.id, orderData.main.name);
        } else {
            storageData.main_id = null;
            if (orderData.main) {
                console.warn('Главное блюдо не имеет ID:', orderData.main);
            }
        }
        
        // Салат
        if (orderData.salad && orderData.salad.id !== undefined && orderData.salad.id !== null) {
            storageData.salad_id = orderData.salad.id;
            console.log('Сохранен салат с ID:', orderData.salad.id, orderData.salad.name);
        } else {
            storageData.salad_id = null;
            if (orderData.salad) {
                console.warn('Салат не имеет ID:', orderData.salad);
            }
        }
        
        // Напиток
        if (orderData.drink && orderData.drink.id !== undefined && orderData.drink.id !== null) {
            storageData.drink_id = orderData.drink.id;
            console.log('Сохранен напиток с ID:', orderData.drink.id, orderData.drink.name);
        } else {
            storageData.drink_id = null;
            if (orderData.drink) {
                console.warn('Напиток не имеет ID:', orderData.drink);
            }
        }
        
        // Десерт
        if (orderData.dessert && orderData.dessert.id !== undefined && orderData.dessert.id !== null) {
            storageData.dessert_id = orderData.dessert.id;
            console.log('Сохранен десерт с ID:', orderData.dessert.id, orderData.dessert.name);
        } else {
            storageData.dessert_id = null;
            if (orderData.dessert) {
                console.warn('Десерт не имеет ID:', orderData.dessert);
            }
        }
        
        // Сохраняем фиксированную цену, если есть
        if (orderData.ready_variant_price !== null && orderData.ready_variant_price !== undefined) {
            storageData.ready_variant_price = orderData.ready_variant_price;
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        console.log('Заказ сохранен в localStorage:', storageData);
        console.log('Проверка localStorage:', localStorage.getItem(STORAGE_KEY));
        
        // Дополнительная проверка - читаем обратно
        const verify = localStorage.getItem(STORAGE_KEY);
        if (verify) {
            const parsed = JSON.parse(verify);
            console.log('Проверка чтения из localStorage:', parsed);
        }
        
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении заказа:', error);
        return false;
    }
}

// Загрузить заказ из localStorage
function loadOrderFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return null;
        }
        
        return JSON.parse(stored);
    } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
        return null;
    }
}

// Очистить заказ из localStorage
function clearOrderFromStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Ошибка при очистке заказа:', error);
        return false;
    }
}

// Проверить, есть ли заказ в localStorage
function hasOrderInStorage() {
    const order = loadOrderFromStorage();
    if (!order) {
        return false;
    }
    
    // Проверяем, есть ли хотя бы одно выбранное блюдо
    return !!(order.soup_id || order.main_id || order.salad_id || order.drink_id || order.dessert_id);
}

// Получить массив ID выбранных блюд
function getSelectedDishIds() {
    const order = loadOrderFromStorage();
    if (!order) {
        return [];
    }
    
    const ids = [];
    if (order.soup_id) ids.push(order.soup_id);
    if (order.main_id) ids.push(order.main_id);
    if (order.salad_id) ids.push(order.salad_id);
    if (order.drink_id) ids.push(order.drink_id);
    if (order.dessert_id) ids.push(order.dessert_id);
    
    return ids;
}

