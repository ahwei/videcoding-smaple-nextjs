export interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  calories: number;
  category: "popular" | "breakfast" | "dinner";
}

export const drinks: Drink[] = [
  {
    id: "soy-milk",
    name: "Soy Milk",
    description: "Freshly made soy milk, served hot or cold. 250 cal.",
    price: 2.50,
    image: "https://www.kayawell.com/Data/UserContentImg/2018/5/87960995-8030-48bd-a77d-42958da68096.jpg",
    calories: 250,
    category: "breakfast",
  },
  {
    id: "dan-bing",
    name: "Dan Bing",
    description: "Egg crepe with a variety of fillings. 350 cal.",
    price: 4.00,
    image: "https://images.food52.com/IVnyfBKaeYLyieK6KRCHmg6fk2c=/03fe6058-4409-4179-aa55-bab1b1a1e962--13334208365_7e22513a8b_b.jpg?w=3840&q=75",
    calories: 350,
    category: "breakfast",
  },
  {
    id: "fan-tuan",
    name: "Fan Tuan",
    description: "Sticky rice roll with savory fillings. 450 cal.",
    price: 5.50,
    image: "https://woonheng.com/wp-content/uploads/2021/03/Fan-Tuan-Ci-Fan-4.jpg",
    calories: 450,
    category: "breakfast",
  },
  {
    id: "pearl-milk-tea",
    name: "Pearl Milk Tea",
    description: "Classic bubble tea with tapioca pearls.",
    price: 3.50,
    image: "https://assets.epicurious.com/photos/5953ca064919e41593325d97/1:1/w_2560%2Cc_limit/bubble_tea_recipe_062817.jpg",
    calories: 280,
    category: "popular",
  },
  {
    id: "oolong-tea",
    name: "Oolong Tea",
    description: "Traditional oolong tea, lightly brewed.",
    price: 2.00,
    image: "https://worldteadirectory.com/wp-content/uploads/2018/09/oolong-tea.jpg",
    calories: 0,
    category: "popular",
  },
  {
    id: "mango-smoothie",
    name: "Mango Smoothie",
    description: "Refreshing mango smoothie with fresh fruit.",
    price: 4.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHoyvOPtmGpaUXAv-2ubknk0JKG2WUaqmggw&s",
    calories: 320,
    category: "popular",
  },
];
