// Centralized image URLs — swap these for local /assets paths whenever real
// photography is ready. Every <SafeImg> falls back gracefully if a URL fails.
export const IMG = {
  momo: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80&auto=format&fit=crop",
  chickenMomo: "https://images.unsplash.com/photo-1738681336104-608b4e7dc3b0?w=600&q=80&auto=format&fit=crop",
  friedRice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80&auto=format&fit=crop",
  chickenFriedRice: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80&auto=format&fit=crop",
  eggFriedRice: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80&auto=format&fit=crop",
  vegChowmein: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80&auto=format&fit=crop",
  chickenChowmein: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80&auto=format&fit=crop",
  thukpa: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&auto=format&fit=crop",
  chickenSandwich: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600&q=80&auto=format&fit=crop",
  eggSandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80&auto=format&fit=crop",
  vegSandwich: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80&auto=format&fit=crop",
  springRolls: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80&auto=format&fit=crop",
  tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop",
  milkCoffee: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80&auto=format&fit=crop",
  blackCoffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop",
  juice: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80&auto=format&fit=crop",
  water: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&q=80&auto=format&fit=crop",
  butterTea: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80&auto=format&fit=crop",
  hero: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80&auto=format&fit=crop",
  upperCanteen: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80&auto=format&fit=crop",
  lowerCanteen: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80&auto=format&fit=crop",
};

export const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#F5F3EE'/></svg>`
  );
