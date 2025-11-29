/**
 * Функция getSortedArray(array, key) сортирует массив объектов
 * по значению указанного ключа в порядке возрастания
 * 
 * @param {Array} array - массив объектов для сортировки
 * @param {string} key - ключ, по значению которого производится сортировка
 * @returns {Array} - новый отсортированный массив объектов
 * @throws {Error} - если параметры некорректны
 */
function getSortedArray(array, key) {
    // Проверка входных параметров
    if (!Array.isArray(array)) {
        throw new Error('Первый параметр должен быть массивом');
    }
    
    if (typeof key !== 'string') {
        throw new Error('Второй параметр должен быть строкой');
    }
    
    // Если массив пустой или содержит один элемент, возвращаем копию массива
    if (array.length <= 1) {
        // Создаем копию массива без использования встроенных функций
        let copy = [];
        for (let i = 0; i < array.length; i++) {
            copy[i] = array[i];
        }
        return copy;
    }
    
    // Создаем копию массива для сортировки (чтобы не изменять исходный массив)
    let sortedArray = [];
    for (let i = 0; i < array.length; i++) {
        sortedArray[i] = array[i];
    }
    
    // Функция сравнения двух значений
    // Возвращает: отрицательное число, если a < b; положительное, если a > b; 0, если равны
    function compare(a, b) {
        let valueA = a[key];
        let valueB = b[key];
        
        // Если оба значения - числа, сравниваем как числа
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            if (valueA < valueB) {
                return -1;
            } else if (valueA > valueB) {
                return 1;
            } else {
                return 0;
            }
        }
        
        // Если оба значения - строки, сравниваем лексикографически
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            // Сравниваем строки посимвольно
            let lenA = valueA.length;
            let lenB = valueB.length;
            let minLen = lenA < lenB ? lenA : lenB;
            
            for (let i = 0; i < minLen; i++) {
                let charA = valueA[i];
                let charB = valueB[i];
                
                if (charA < charB) {
                    return -1;
                } else if (charA > charB) {
                    return 1;
                }
            }
            
            // Если все символы до minLen равны, сравниваем по длине
            if (lenA < lenB) {
                return -1;
            } else if (lenA > lenB) {
                return 1;
            } else {
                return 0;
            }
        }
        
        // Если типы разные, сравниваем как числа (приводим строки к числам через парсинг)
        // Но так как в задании сказано, что значения могут быть числом ИЛИ строкой,
        // предполагаем, что в массиве все значения одного типа
        // Если типы разные, считаем числа меньше строк
        if (typeof valueA === 'number') {
            return -1;
        } else {
            return 1;
        }
    }
    
    // Сортировка выбором (Selection Sort)
    // Находим минимальный элемент и ставим его на текущую позицию
    for (let i = 0; i < sortedArray.length - 1; i++) {
        let minIndex = i;
        
        // Находим индекс минимального элемента в оставшейся части массива
        for (let j = i + 1; j < sortedArray.length; j++) {
            if (compare(sortedArray[j], sortedArray[minIndex]) < 0) {
                minIndex = j;
            }
        }
        
        // Если минимальный элемент не на текущей позиции, меняем их местами
        if (minIndex !== i) {
            let temp = sortedArray[i];
            sortedArray[i] = sortedArray[minIndex];
            sortedArray[minIndex] = temp;
        }
    }
    
    return sortedArray;
}

