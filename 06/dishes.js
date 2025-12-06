// Массив блюд для меню
const dishes = [
    // Супы (6 блюд: 2 рыбных, 2 мясных, 2 вегетарианских)
    {
        keyword: 'gazpacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'https://cdn1.ozonusercontent.com/s3/club-storage/images/article_image_1632x1000/458/67ac93bb-bf0b-4687-8f44-1eaea9a63199.jpeg',
        kind: 'veg'
    },
    {
        keyword: 'mushroom-soup',
        name: 'Грибной суп-пюре',
        price: 185,
        category: 'soup',
        count: '330 г',
        image: 'https://img.povar.ru/mobile/6d/75/7b/6f/gribnoi_sup-piure-773618.jpg',
        kind: 'veg'
    },
    {
        keyword: 'norwegian-soup',
        name: 'Норвежский суп',
        price: 270,
        category: 'soup',
        count: '330 г',
        image: 'https://images.gastronom.ru/Ll3CVlAXzHqhSvL74Qx7pISA2jbv74IdvfTXaHHggiY/pr:similar-page-image/g:ce/rs:auto:0:0:0/L2dhc3Ryb25vbS9hbGwtaW1hZ2VzL2U4NWI5YjkyLWRkYmUtNDgwZS1iOTVhLWU1ZGExMjEwOWI2ZS5qcGc.webp',
        kind: 'fish'
    },
    {
        keyword: 'ramen',
        name: 'Рамен',
        price: 375,
        category: 'soup',
        count: '425 г',
        image: 'https://vkusnoff.com/img/recepty/1816/big.webp',
        kind: 'meat'
    },
    {
        keyword: 'tom-yam',
        name: 'Том ям с креветками',
        price: 650,
        category: 'soup',
        count: '500 г',
        image: 'https://vkusvill.ru/upload/resize/1046176/tom-yam_588x409x90_c.webp',
        kind: 'fish'
    },
    {
        keyword: 'chicken-soup',
        name: 'Куриный суп',
        price: 330,
        category: 'soup',
        count: '330 г',
        image: 'https://menunedeli.ru/wp-content/uploads/2020/04/Kuriniy-sup-za-15-minut-500x350.jpg',
        kind: 'meat'
    },
    
    // Основные блюда (6 блюд: 2 рыбных, 2 мясных, 2 вегетарианских)
    {
        keyword: 'potatoes-mushrooms',
        name: 'Жареная картошка с грибами',
        price: 150,
        category: 'main',
        count: '250 г',
        image: 'https://www.chefmarket.ru/blog/wp-content/uploads/2020/07/kartofel-e1594472951898.jpg',
        kind: 'veg'
    },
    {
        keyword: 'lasagna',
        name: 'Лазанья',
        price: 385,
        category: 'main',
        count: '310 г',
        image: 'https://gotovim-doma.ru/images/recipe/1/3f/13fd3c284599a98b14685af563f95b14.jpg',
        kind: 'meat'
    },
    {
        keyword: 'chicken-cutlets',
        name: 'Котлеты из курицы с картофельным пюре',
        price: 225,
        category: 'main',
        count: '280 г',
        image: 'https://resizer.mail.ru/p/caf46ed4-1253-52ec-abae-cb37001efe38/AAAFz3S1AgEWd81inno6YmCJMsdrUOsLHRRbNC6ZNTS6IyfVUnncJUScVJ4lwpRzybQetiXOrxu_RN1KezseFCPbrns.jpg',
        kind: 'meat'
    },
    {
        keyword: 'fish-cutlet',
        name: 'Рыбная котлета с рисом и спаржей',
        price: 320,
        category: 'main',
        count: '270 г',
        image: 'https://www.photorecept.ru/wp-content/uploads/2022/02/file-lososja-na-paru-2.jpg',
        kind: 'fish'
    },
    {
        keyword: 'margherita',
        name: 'Пицца Маргарита',
        price: 450,
        category: 'main',
        count: '470 г',
        image: 'https://www.chefmarket.ru/blog/wp-content/uploads/2020/10/pizza-margherita--2000x1200.jpg',
        kind: 'veg'
    },
    {
        keyword: 'pasta-shrimp',
        name: 'Паста с креветками',
        price: 340,
        category: 'main',
        count: '300 г',
        image: 'https://www.makfa.ru/upload/resize_cache/iblock/815/450_450_1/54vlbr637jruljs9cm6z2nxw9sobojle.jpg',
        kind: 'fish'
    },
    
    // Салаты и стартеры (6 блюд: 1 рыбный, 1 мясной, 4 вегетарианских)
    {
        keyword: 'royal-salad',
        name: 'Королевский салат с овощами и яйцом',
        price: 330,
        category: 'salad',
        count: '250 г',
        image: 'https://images.news.ru/2025/11/18/94fx0iB4xla4EiVVjEcxjtXKIwhWPxxBc6ZuhYTr_780.webp',
        kind: 'veg'
    },
    {
        keyword: 'caesar',
        name: 'Цезарь с цыпленком',
        price: 370,
        category: 'salad',
        count: '220 г',
        image: 'https://images.gastronom.ru/-UHzDgNx-m0MMa6OR0ilz2qP7MB0mKQeGceObc9jpck/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzVhNzFhZGY1LTM3MTYtNDlmMy04NDNlLTAwMTg4MGNiM2E0OS5qcGc.webp',
        kind: 'meat'
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'salad',
        count: '235 г',
        image: 'https://www.chefmarket.ru/blog/wp-content/uploads/2019/05/caprese-in-tomato-e1559078305709.jpg',
        kind: 'veg'
    },
    {
        keyword: 'tuna-salad',
        name: 'Салат с тунцом',
        price: 480,
        category: 'salad',
        count: '250 г',
        image: 'https://korfood.ru/upload/iblock/8f2/q7y8lnhn6rjc8jgc3qqib8j0o6u47tku/3_prostykh_retsepta_salatov_s_tuntsom.jpg',
        kind: 'fish'
    },
    {
        keyword: 'fries-caesar',
        name: 'Картофель фри с соусом Цезарь',
        price: 280,
        category: 'salad',
        count: '235 г',
        image: 'https://swlife.ru/image/cache/catalog/recipe/ff/bb/ffbb63c6e9a7f56203a990951bce8d84-0x0.webp',
        kind: 'veg'
    },
    {
        keyword: 'fries-ketchup',
        name: 'Картофель фри с кетчупом',
        price: 260,
        category: 'salad',
        count: '235 г',
        image: 'https://img.freepik.com/premium-photo/homemade-baked-french-fries-with-ketchup-rosemary-black-slate-board_652240-948.jpg',
        kind: 'veg'
    },
    
    // Напитки (6 блюд: 3 холодных, 3 горячих)
    {
        keyword: 'orange-juice',
        name: 'Апельсиновый сок',
        price: 120,
        category: 'drink',
        count: '300 мл',
        image: 'https://cdn.iz.ru/sites/default/files/styles/1920x1080/public/article-2024-06/20160507_gaf_rb34_008.jpg?itok=w2UDb-gm',
        kind: 'cold'
    },
    {
        keyword: 'apple-juice',
        name: 'Яблочный сок',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'https://planetsushi.ru/wa-data/public/shop/products/05/09/30905/images/10119482/10119482.900x616.jpg',
        kind: 'cold'
    },
    {
        keyword: 'carrot-juice',
        name: 'Морковный сок',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'https://legamed21.ru/assets/mgr/images/sliders/2018-07-20-9fnrgy7ni28.jpg',
        kind: 'cold'
    },
    {
        keyword: 'cappuccino',
        name: 'Капучино',
        price: 180,
        category: 'drink',
        count: '300 мл',
        image: 'https://i-coffee.me/wp-content/uploads/2022/02/Coffee_Cappuccino_Cream_Cup_Saucer_525045_2048x1152.jpg',
        kind: 'hot'
    },
    {
        keyword: 'green-tea',
        name: 'Зеленый чай',
        price: 100,
        category: 'drink',
        count: '300 мл',
        image: 'https://resizer.mail.ru/p/34a7321d-45e3-5a8e-9ea3-88a8ab828df7/AQAFIdYVI86wbiPwcM_zW3cQbHDO8zm_uFStqaCJU9JmwvjubnYMb1aouDjE6wMYeLYCCds-jYAjvLhOguIHTS4Iv8Y.jpg',
        kind: 'hot'
    },
    {
        keyword: 'black-tea',
        name: 'Черный чай',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'https://xn----8sbehgcimb3cfabqj3b.xn--p1ai/upload/iblock/042/2qgrd6tksvk1zm1t0tvshadic3xdze3h/-Kropotov-Lev-Fotobank-Lori-_1_.jpg',
        kind: 'hot'
    },
    
    // Десерты (6 блюд: 3 маленьких, 2 средних, 1 большая)
    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 220,
        category: 'dessert',
        count: '300 г',
        image: 'https://cdn1.ozonusercontent.com/s3/club-storage/images/article_image_1632x1000/914/de05b840-88ae-4979-9d0c-9fcf92131e76.jpeg',
        kind: 'small'
    },
    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'dessert',
        count: '125 г',
        image: 'https://www.russianfood.com/dycontent/images_upl/569/big_568313.jpg',
        kind: 'small'
    },
    {
        keyword: 'chocolate-cheesecake',
        name: 'Шоколадный чизкейк',
        price: 260,
        category: 'dessert',
        count: '125 г',
        image: 'https://onetable.ru/wp-content/uploads/2025/04/gotovyy-shokoladnyy-chizkeyk.jpg',
        kind: 'small'
    },
    {
        keyword: 'chocolate-cake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'dessert',
        count: '160 г',
        image: 'https://n1s1.hsmedia.ru/ae/d2/ec/aed2ecfde65b702070787c74794f109b/1706x1280_0xxc0jt2Ks_9272380379954763853.jpg',
        kind: 'medium'
    },
    {
        keyword: 'donuts-3',
        name: 'Пончики (3 штуки)',
        price: 410,
        category: 'dessert',
        count: '350 г',
        image: 'https://scdn.chibbis.ru/live/products/51b673976f91571a090549142f783d24.jpeg',
        kind: 'medium'
    },
    {
        keyword: 'donuts-6',
        name: 'Пончики (6 штук)',
        price: 850,
        category: 'dessert',
        count: '700 г',
        image: 'https://cheese-cake.ru/DesertImg/ponchiki-mini-assorti-iz-treh-vidov-2-2-2.jpg',
        kind: 'large'
    }
];

