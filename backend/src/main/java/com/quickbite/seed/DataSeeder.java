package com.quickbite.seed;

import com.quickbite.model.Canteen;
import com.quickbite.model.MenuItem;
import com.quickbite.model.Order;
import com.quickbite.model.OrderItem;
import com.quickbite.model.Staff;
import com.quickbite.repository.CanteenRepository;
import com.quickbite.repository.MenuItemRepository;
import com.quickbite.repository.OrderRepository;
import com.quickbite.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Populates MySQL with the same demo data the frontend used to hold in
 * data/menu.js, data/canteens.js and data/orders.js, so the app behaves
 * identically the first time it's pointed at this backend. Only runs when
 * the relevant table is empty, so it never overwrites real data.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    private final MenuItemRepository menuRepo;
    private final CanteenRepository canteenRepo;
    private final OrderRepository orderRepo;
    private final StaffRepository staffRepo;

    public DataSeeder(MenuItemRepository menuRepo, CanteenRepository canteenRepo,
                       OrderRepository orderRepo, StaffRepository staffRepo) {
        this.menuRepo = menuRepo;
        this.canteenRepo = canteenRepo;
        this.orderRepo = orderRepo;
        this.staffRepo = staffRepo;
    }

    @Override
    public void run(String... args) {
        seedCanteens();
        seedMenu();
        seedOrders();
        seedStaff();
    }

    private void seedCanteens() {
        if (canteenRepo.count() > 0) return;
        canteenRepo.saveAll(List.of(
                new Canteen("upper", "Upper Canteen", "Dragon Block",
                        "The go-to spot for quick rice bowls, momo, and hot tea between lectures.",
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80&auto=format&fit=crop"),
                new Canteen("lower", "Lower Canteen", "Dragon Block",
                        "A relaxed courtyard canteen known for noodles, sandwiches and fresh juice.",
                        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80&auto=format&fit=crop")
        ));
    }

    private void seedMenu() {
        if (menuRepo.count() > 0) return;
        menuRepo.saveAll(List.of(
                new MenuItem("M001", "Momo", "Snacks", 50,
                        "Steamed dumplings filled with delicious seasoned filling, served with tomato achar.",
                        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M002", "Chicken Momo", "Snacks", 70,
                        "Juicy minced chicken dumplings, steamed fresh and served with spicy chutney.",
                        "https://images.unsplash.com/photo-1738681336104-608b4e7dc3b0?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M003", "Fried Rice", "Rice", 80,
                        "Wok-tossed rice with garden vegetables, egg and a touch of soy.",
                        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M004", "Chicken Fried Rice", "Rice", 90,
                        "Classic fried rice loaded with tender chicken pieces and spring onion.",
                        "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M005", "Egg Fried Rice", "Rice", 75,
                        "Simple and comforting fried rice tossed with scrambled egg.",
                        "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M006", "Vegetable Chowmein", "Noodles", 60,
                        "Stir-fried noodles with crisp seasonal vegetables and a savoury sauce.",
                        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M007", "Chicken Chowmein", "Noodles", 80,
                        "Stir-fried noodles tossed with chicken, cabbage and carrots.",
                        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M008", "Thukpa", "Noodles", 70,
                        "A warm, hearty noodle soup simmered with vegetables and mild spices.",
                        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M009", "Burger", "Main Meals", 90,
                        "A grilled patty stacked with fresh lettuce, tomato and house sauce.",
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M010", "Chicken Sandwich", "Main Meals", 70,
                        "Grilled chicken layered between toasted bread with a light mayo spread.",
                        "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M011", "Egg Sandwich", "Main Meals", 60,
                        "Toasted bread filled with fluffy scrambled egg and fresh greens.",
                        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M020", "Veg Sandwich", "Main Meals", 55,
                        "Toasted bread packed with crunchy cucumber, tomato and cheese.",
                        "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M012", "Spring Rolls", "Snacks", 45,
                        "Crispy golden rolls filled with seasoned vegetables.",
                        "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M013", "French Fries", "Snacks", 40,
                        "Golden, crispy fries salted just right, served hot.",
                        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M014", "Tea", "Tea & Coffee", 20,
                        "Freshly brewed milk tea, the campus favourite between classes.",
                        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M015", "Milk Coffee", "Tea & Coffee", 40,
                        "Smooth, creamy coffee brewed fresh and served hot.",
                        "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M016", "Black Coffee", "Tea & Coffee", 35,
                        "Bold and simple, no milk, no fuss.",
                        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M019", "Butter Tea", "Tea & Coffee", 25,
                        "Traditional salted butter tea, currently unavailable.",
                        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80&auto=format&fit=crop", false),
                new MenuItem("M017", "Orange Juice", "Drinks", 50,
                        "Freshly squeezed orange juice, chilled and refreshing.",
                        "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80&auto=format&fit=crop", true),
                new MenuItem("M018", "Mineral Water", "Drinks", 20,
                        "Chilled bottled water, always on hand.",
                        "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&q=80&auto=format&fit=crop", true)
        ));
    }

    private void seedOrders() {
        if (orderRepo.count() > 0) return;
        orderRepo.saveAll(List.of(
                order("QB-1001", "Upper Canteen", 120, "Completed", "Normal", 210,
                        item("Momo", 2), item("Tea", 1)),
                order("QB-1002", "Lower Canteen", 130, "Completed", "Normal", 195,
                        item("Chicken Chowmein", 1), item("Juice", 1)),
                order("QB-1003", "Upper Canteen", 80, "Completed", "High", 180,
                        item("Fried Rice", 1)),
                order("QB-1004", "Upper Canteen", 110, "Completed", "Normal", 160,
                        item("Chicken Sandwich", 1), item("Coffee", 1)),
                order("QB-1005", "Lower Canteen", 90, "Completed", "Normal", 140,
                        item("Thukpa", 1), item("Tea", 1)),
                order("QB-1035", "Upper Canteen", 90, "Completed", "Normal", 95,
                        item("Momo", 1), item("Coffee", 1)),
                order("QB-1006", "Upper Canteen", 140, "Processing", "High", 38,
                        item("Burger", 1), item("Juice", 1)),
                order("QB-1039", "Lower Canteen", 100, "Processing", "Normal", 26,
                        item("Chicken Chowmein", 1), item("Tea", 1)),
                order("QB-1007", "Lower Canteen", 140, "Processing", "Normal", 20,
                        item("Chicken Momo", 2)),
                order("QB-1008", "Upper Canteen", 95, "Pending", "Normal", 12,
                        item("Egg Fried Rice", 1), item("Tea", 1)),
                order("QB-1048", "Upper Canteen", 90, "Pending", "High", 9,
                        item("Chicken Fried Rice", 1)),
                order("QB-1049", "Lower Canteen", 95, "Pending", "Normal", 7,
                        item("Veg Sandwich", 1), item("Milk Coffee", 1)),
                order("QB-1009", "Lower Canteen", 140, "Pending", "Normal", 4,
                        item("Spring Rolls", 2), item("Juice", 1)),
                order("QB-1010", "Upper Canteen", 75, "Pending", "Normal", 2,
                        item("French Fries", 1), item("Black Coffee", 1))
        ));
    }

    private void seedStaff() {
        if (staffRepo.count() > 0) return;
        String hash = new BCryptPasswordEncoder().encode("staff123");
        staffRepo.save(new Staff("staff", hash));
    }

    private OrderItem item(String name, int qty) {
        return new OrderItem(name, qty);
    }

    private Order order(String id, String canteen, int total, String status, String priority,
                         int minutesAgo, OrderItem... items) {
        Order o = new Order();
        o.setId(id);
        o.setCanteen(canteen);
        o.setTotal(total);
        o.setStatus(status);
        o.setPriority(priority);
        LocalDateTime placedAt = LocalDateTime.now().minusMinutes(minutesAgo);
        o.setTime(TIME_FORMAT.format(placedAt));
        o.setCreatedAt(Instant.now().minusSeconds(minutesAgo * 60L));
        for (OrderItem it : items) {
            it.setOrder(o);
        }
        o.setItems(List.of(items));
        return o;
    }
}
