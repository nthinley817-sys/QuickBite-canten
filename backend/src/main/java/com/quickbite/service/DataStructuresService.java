package com.quickbite.service;

import com.quickbite.dsa.BinarySearch;
import com.quickbite.dsa.ChainedHashTable;
import com.quickbite.dsa.MergeSort;
import com.quickbite.dsa.OrderQueue;
import com.quickbite.dsa.PriorityOrderQueue;
import com.quickbite.dto.DsaResponses.HashLookup;
import com.quickbite.dto.DsaResponses.HashTableView;
import com.quickbite.dto.DsaResponses.HashView;
import com.quickbite.dto.DsaResponses.PriorityView;
import com.quickbite.dto.DsaResponses.ProcessNextView;
import com.quickbite.dto.DsaResponses.QueueView;
import com.quickbite.dto.DsaResponses.SearchView;
import com.quickbite.dto.DsaResponses.SortView;
import com.quickbite.dto.OrderDto;
import com.quickbite.model.MenuItem;
import com.quickbite.model.Order;
import com.quickbite.repository.MenuItemRepository;
import com.quickbite.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Runs QuickBite's own data structures and algorithms (package com.quickbite.dsa)
 * over a canteen's live orders and menu, for the staff demo pages:
 *   - OrderQueue          pending orders, first come first served
 *   - PriorityOrderQueue  pending orders, High priority first, then by arrival
 *   - ChainedHashTable    menu items and orders looked up by id
 *   - MergeSort           orders sorted by any field
 *   - BinarySearch        an order found by number in the sorted list
 */
@Service
public class DataStructuresService {

    /** Starting bucket count; the tables double (and rehash) past a 0.75 load factor. */
    private static final int INITIAL_BUCKETS = 8;

    /** Arrival order; orders saved before createdAt existed sort first. */
    static final Comparator<Order> BY_ARRIVAL =
            Comparator.comparing(Order::getCreatedAt, Comparator.nullsFirst(Comparator.<Instant>naturalOrder()));

    /** High priority first, and among equals, whoever ordered first. */
    static final Comparator<Order> BY_URGENCY =
            Comparator.comparingInt((Order o) -> "High".equals(o.getPriority()) ? 0 : 1).thenComparing(BY_ARRIVAL);

    /** "QB-1042" -> 1042, so QB-999 sorts before QB-1000 (a plain string compare would not). */
    static long orderNumber(String id) {
        if (id == null) return Long.MAX_VALUE;
        String digits = id.replaceAll("\\D", "");
        if (digits.isEmpty()) return Long.MAX_VALUE;
        try {
            return Long.parseLong(digits);
        } catch (NumberFormatException e) {
            return Long.MAX_VALUE;
        }
    }

    private static final Map<String, Comparator<Order>> SORT_FIELDS = Map.of(
            "Order Number", Comparator.comparingLong(o -> orderNumber(o.getId())),
            "Time", BY_ARRIVAL,
            "Total", Comparator.comparingInt(Order::getTotal),
            "Priority", BY_URGENCY,
            "Status", Comparator.comparing(Order::getStatus, Comparator.nullsLast(Comparator.<String>naturalOrder()))
    );

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuRepository;
    private final OrderService orderService;

    public DataStructuresService(OrderRepository orderRepository, MenuItemRepository menuRepository,
                                 OrderService orderService) {
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
        this.orderService = orderService;
    }

    private List<Order> pendingOrders(String canteenId) {
        return orderRepository.findByCanteenId(canteenId).stream()
                .filter(o -> "Pending".equals(o.getStatus()))
                .toList();
    }

    private List<OrderDto> dto(List<Order> orders) {
        return orders.stream().map(orderService::toDto).toList();
    }

    private OrderDto dto(Order order) {
        return order == null ? null : orderService.toDto(order);
    }

    private OrderQueue<Order> buildQueue(String canteenId) {
        OrderQueue<Order> queue = new OrderQueue<>();
        for (Order o : MergeSort.sort(pendingOrders(canteenId), BY_ARRIVAL)) {
            queue.enqueue(o);
        }
        return queue;
    }

    private QueueView view(OrderQueue<Order> queue) {
        return new QueueView("OrderQueue (singly linked list, FIFO)", queue.size(), dto(queue.peek()), dto(queue.toList()));
    }

    /** Pending orders enqueued in arrival order; the front is served next. */
    public QueueView queue(String canteenId) {
        return view(buildQueue(canteenId));
    }

    /**
     * dequeue(): takes the order at the front of the queue and starts preparing
     * it (Pending -> Processing), exactly as if staff had tapped Start Preparing.
     */
    public ProcessNextView processNext(String canteenId) {
        OrderQueue<Order> queue = buildQueue(canteenId);
        if (queue.isEmpty()) {
            throw new IllegalArgumentException("The queue is empty: there are no pending orders.");
        }
        Order next = queue.dequeue();
        OrderDto processed = orderService.updateStatus(next.getId(), "Processing", canteenId);
        return new ProcessNextView(processed, view(queue));
    }

    /** Pending orders in a binary heap keyed on urgency. */
    public PriorityView priority(String canteenId) {
        PriorityOrderQueue<Order> heap = new PriorityOrderQueue<>(BY_URGENCY);
        for (Order o : pendingOrders(canteenId)) {
            heap.add(o);
        }
        List<Order> serveOrder = heap.toSortedList();
        List<Order> high = serveOrder.stream().filter(o -> "High".equals(o.getPriority())).toList();
        List<Order> normal = serveOrder.stream().filter(o -> !"High".equals(o.getPriority())).toList();
        return new PriorityView("PriorityOrderQueue (binary min-heap)", heap.size(), dto(heap.peek()),
                dto(high), dto(normal), dto(serveOrder));
    }

    /** Menu items and orders stored in hash tables keyed by id, plus an optional lookup. */
    public HashView hash(String canteenId, String key) {
        ChainedHashTable<String, MenuItem> menuTable = new ChainedHashTable<>(INITIAL_BUCKETS);
        for (MenuItem m : menuRepository.findByCanteenId(canteenId)) {
            menuTable.put(m.getId(), m);
        }
        ChainedHashTable<String, Order> orderTable = new ChainedHashTable<>(INITIAL_BUCKETS);
        for (Order o : orderRepository.findByCanteenId(canteenId)) {
            orderTable.put(o.getId(), o);
        }

        HashLookup lookup = null;
        if (key != null && !key.isBlank()) {
            String k = key.trim();
            String orderKey = k.toUpperCase().startsWith("QB-") ? k.toUpperCase() : k;
            ChainedHashTable.Lookup<Order> inOrders = orderTable.lookup(orderKey);
            if (inOrders.found()) {
                lookup = new HashLookup(orderKey, true, "OrderHashTable", inOrders.bucket(), inOrders.comparisons(),
                        "Order " + inOrders.value().getId() + " · Table " + inOrders.value().getTableNumber());
            } else {
                ChainedHashTable.Lookup<MenuItem> inMenu = menuTable.lookup(k);
                lookup = inMenu.found()
                        ? new HashLookup(k, true, "MenuHashTable", inMenu.bucket(), inMenu.comparisons(), inMenu.value().getName())
                        : new HashLookup(k, false, "OrderHashTable", inOrders.bucket(), inOrders.comparisons(), null);
            }
        }

        return new HashView(
                view("MenuHashTable", "Item ID", menuTable, MenuItem::getName),
                view("OrderHashTable", "Order ID", orderTable, Order::getId),
                lookup);
    }

    private static <V> HashTableView view(String name, String keyField, ChainedHashTable<String, V> table,
                                          Function<V, String> label) {
        List<List<String>> buckets = table.bucketContents().stream()
                .map(chain -> chain.stream().map(label).toList())
                .toList();
        return new HashTableView(name, keyField, table.bucketCount(), table.initialBucketCount(), table.resizes(),
                table.maxLoadFactor(), table.size(),
                Math.round(table.loadFactor() * 100) / 100.0, table.collisions(), table.longestChain(), buckets);
    }

    /** All the canteen's orders, merge sorted by the chosen field. */
    public SortView sort(String canteenId, String by, String direction) {
        Comparator<Order> comparator = SORT_FIELDS.get(by);
        if (comparator == null) {
            throw new IllegalArgumentException("Sort by must be one of " + SORT_FIELDS.keySet());
        }
        boolean descending = "Descending".equalsIgnoreCase(direction);
        MergeSort.Result<Order> result = MergeSort.sortWithStats(orderRepository.findByCanteenId(canteenId),
                descending ? comparator.reversed() : comparator);
        return new SortView("Merge sort", by, descending ? "Descending" : "Ascending", result.comparisons(),
                dto(result.sorted()));
    }

    /** Finds an order by number: merge sort by order number, then binary search. */
    public SearchView search(String canteenId, String query) {
        String q = query == null ? "" : query.trim();
        long wanted = orderNumber(q);
        List<Order> sorted = MergeSort.sort(orderRepository.findByCanteenId(canteenId),
                Comparator.comparingLong(o -> orderNumber(o.getId())));
        BinarySearch.Result<Order> result = wanted == Long.MAX_VALUE
                ? new BinarySearch.Result<>(-1, null, 0)
                : BinarySearch.search(sorted, wanted, o -> orderNumber(o.getId()), Comparator.<Long>naturalOrder());
        return new SearchView("Binary search", q, result.found(), dto(result.element()), result.steps(), sorted.size());
    }
}
