import { IMG } from "./images.js";

export const CATEGORIES = ["All", "Main Meals", "Rice", "Noodles", "Snacks", "Drinks", "Tea & Coffee"];

// Mock menu data — replace with a real API response later via services/api.js
export const MENU_SEED = [
  { id: "M001", name: "Momo", category: "Snacks", price: 50, desc: "Steamed dumplings filled with delicious seasoned filling, served with tomato achar.", image: IMG.momo, available: true },
  { id: "M002", name: "Chicken Momo", category: "Snacks", price: 70, desc: "Juicy minced chicken dumplings, steamed fresh and served with spicy chutney.", image: IMG.chickenMomo, available: true },
  { id: "M003", name: "Fried Rice", category: "Rice", price: 80, desc: "Wok-tossed rice with garden vegetables, egg and a touch of soy.", image: IMG.friedRice, available: true },
  { id: "M004", name: "Chicken Fried Rice", category: "Rice", price: 90, desc: "Classic fried rice loaded with tender chicken pieces and spring onion.", image: IMG.chickenFriedRice, available: true },
  { id: "M005", name: "Egg Fried Rice", category: "Rice", price: 75, desc: "Simple and comforting fried rice tossed with scrambled egg.", image: IMG.eggFriedRice, available: true },
  { id: "M006", name: "Vegetable Chowmein", category: "Noodles", price: 60, desc: "Stir-fried noodles with crisp seasonal vegetables and a savoury sauce.", image: IMG.vegChowmein, available: true },
  { id: "M007", name: "Chicken Chowmein", category: "Noodles", price: 80, desc: "Stir-fried noodles tossed with chicken, cabbage and carrots.", image: IMG.chickenChowmein, available: true },
  { id: "M008", name: "Thukpa", category: "Noodles", price: 70, desc: "A warm, hearty noodle soup simmered with vegetables and mild spices.", image: IMG.thukpa, available: true },
  { id: "M009", name: "Burger", category: "Main Meals", price: 90, desc: "A grilled patty stacked with fresh lettuce, tomato and house sauce.", image: IMG.burger, available: true },
  { id: "M010", name: "Chicken Sandwich", category: "Main Meals", price: 70, desc: "Grilled chicken layered between toasted bread with a light mayo spread.", image: IMG.chickenSandwich, available: true },
  { id: "M011", name: "Egg Sandwich", category: "Main Meals", price: 60, desc: "Toasted bread filled with fluffy scrambled egg and fresh greens.", image: IMG.eggSandwich, available: true },
  { id: "M020", name: "Veg Sandwich", category: "Main Meals", price: 55, desc: "Toasted bread packed with crunchy cucumber, tomato and cheese.", image: IMG.vegSandwich, available: true },
  { id: "M012", name: "Spring Rolls", category: "Snacks", price: 45, desc: "Crispy golden rolls filled with seasoned vegetables.", image: IMG.springRolls, available: true },
  { id: "M013", name: "French Fries", category: "Snacks", price: 40, desc: "Golden, crispy fries salted just right, served hot.", image: IMG.fries, available: true },
  { id: "M014", name: "Tea", category: "Tea & Coffee", price: 20, desc: "Freshly brewed milk tea, the campus favourite between classes.", image: IMG.tea, available: true },
  { id: "M015", name: "Milk Coffee", category: "Tea & Coffee", price: 40, desc: "Smooth, creamy coffee brewed fresh and served hot.", image: IMG.milkCoffee, available: true },
  { id: "M016", name: "Black Coffee", category: "Tea & Coffee", price: 35, desc: "Bold and simple, no milk, no fuss.", image: IMG.blackCoffee, available: true },
  { id: "M019", name: "Butter Tea", category: "Tea & Coffee", price: 25, desc: "Traditional salted butter tea, currently unavailable.", image: IMG.butterTea, available: false },
  { id: "M017", name: "Orange Juice", category: "Drinks", price: 50, desc: "Freshly squeezed orange juice, chilled and refreshing.", image: IMG.juice, available: true },
  { id: "M018", name: "Mineral Water", category: "Drinks", price: 20, desc: "Chilled bottled water, always on hand.", image: IMG.water, available: true },
];
