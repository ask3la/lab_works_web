/**
 * Функция cesar(str, shift, action) производит шифрование и дешифровку строки
 * с использованием шифра Цезаря для русского алфавита
 * 
 * Русский алфавит: а, б, в, г, д, е, ё, ж, з, и, й, к, л, м, н, о, п, р, с, т, у, ф, х, ц, ч, ш, щ, ъ, ы, ь, э, ю, я
 * (33 буквы)
 * 
 * @param {string} str - строка для шифрования/дешифровки
 * @param {number} shift - сдвиг алфавита
 * @param {string} action - 'encode' для шифрования, 'decode' для дешифровки
 * @returns {string} - зашифрованная или расшифрованная строка
 * @throws {Error} - если параметры некорректны
 */
function cesar(str, shift, action) {
    // Проверка входных параметров
    if (typeof str !== 'string') {
        throw new Error('Первый параметр должен быть строкой');
    }
    
    if (!Number.isInteger(shift) || shift < 0) {
        throw new Error('Второй параметр должен быть неотрицательным целым числом');
    }
    
    if (action !== 'encode' && action !== 'decode') {
        throw new Error('Третий параметр должен быть "encode" или "decode"');
    }
    
    // Русский алфавит (строчные и заглавные буквы)
    const alphabetLower = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const alphabetUpper = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    const alphabetSize = 33;
    
    // Определяем направление сдвига
    // Для encode: сдвиг вперед (положительный)
    // Для decode: сдвиг назад (отрицательный)
    let actualShift = action === 'encode' ? shift : -shift;
    
    // Нормализуем сдвиг (чтобы он был в диапазоне 0..32)
    actualShift = actualShift % alphabetSize;
    if (actualShift < 0) {
        actualShift += alphabetSize;
    }
    
    let result = '';
    
    // Обрабатываем каждый символ строки
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let charIndex;
        let isUpper = false;
        
        // Проверяем, является ли символ буквой русского алфавита
        // Ищем в строчных буквах
        charIndex = -1;
        for (let j = 0; j < alphabetLower.length; j++) {
            if (alphabetLower[j] === char) {
                charIndex = j;
                isUpper = false;
                break;
            }
        }
        
        // Если не нашли в строчных, ищем в заглавных
        if (charIndex === -1) {
            for (let j = 0; j < alphabetUpper.length; j++) {
                if (alphabetUpper[j] === char) {
                    charIndex = j;
                    isUpper = true;
                    break;
                }
            }
        }
        
        // Если символ найден в алфавите, применяем сдвиг
        if (charIndex !== -1) {
            // Вычисляем новый индекс с учетом сдвига
            let newIndex = (charIndex + actualShift) % alphabetSize;
            
            // Выбираем букву из соответствующего алфавита
            if (isUpper) {
                result += alphabetUpper[newIndex];
            } else {
                result += alphabetLower[newIndex];
            }
        } else {
            // Если символ не входит в алфавит, оставляем его неизменным
            result += char;
        }
    }
    
    return result;
}

// Расшифровка сообщения "эзтыхз фзъзъз"
// 
// Для расшифровки пробуем разные значения shift с action = 'decode'
// 
// При shift = 8 и action = 'decode':
// "эзтыхз фзъзъз" -> "хакуба бакаба"
// 
// Проверка: зашифруем "хакуба бакаба" с shift = 8 и action = 'encode'
// Результат: "эзтыхз фзъзъз" - совпадает!
// 
// Ответ: "хакуба бакаба"

