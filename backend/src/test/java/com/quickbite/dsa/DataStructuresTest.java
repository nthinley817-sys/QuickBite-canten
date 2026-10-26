package com.quickbite.dsa;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Plain unit tests for com.quickbite.dsa: no Spring context or database needed. */
class DataStructuresTest {

    @Test
    void orderQueueIsFirstInFirstOut() {
        OrderQueue<String> q = new OrderQueue<>();
        assertTrue(q.isEmpty());
        assertNull(q.peek());
        q.enqueue("QB-1");
        q.enqueue("QB-2");
        q.enqueue("QB-3");
        assertEquals(3, q.size());
        assertEquals("QB-1", q.peek());
        assertEquals(List.of("QB-1", "QB-2", "QB-3"), q.toList());
        assertEquals("QB-1", q.dequeue());
        assertEquals("QB-2", q.dequeue());
        q.enqueue("QB-4");
        assertEquals("QB-3", q.dequeue());
        assertEquals("QB-4", q.dequeue());
        assertTrue(q.isEmpty());
        assertThrows(NoSuchElementException.class, q::dequeue);
        q.enqueue("QB-5"); // tail must have been reset when the queue emptied
        assertEquals(List.of("QB-5"), q.toList());
    }

    @Test
    void priorityQueuePollsSmallestFirstAndGrows() {
        PriorityOrderQueue<Integer> pq = new PriorityOrderQueue<>(Comparator.naturalOrder());
        List<Integer> values = new ArrayList<>();
        Random rnd = new Random(42);
        for (int i = 0; i < 200; i++) values.add(rnd.nextInt(1000)); // more than the initial capacity of 16
        values.forEach(pq::add);
        List<Integer> expected = new ArrayList<>(values);
        Collections.sort(expected);
        assertEquals(expected.get(0), pq.peek());
        assertEquals(expected, pq.toSortedList());
        assertEquals(200, pq.size()); // toSortedList must not consume the queue
        List<Integer> polled = new ArrayList<>();
        while (!pq.isEmpty()) polled.add(pq.poll());
        assertEquals(expected, polled);
        assertNull(pq.poll());
    }

    @Test
    void priorityQueueBreaksTiesByArrival() {
        record O(String id, boolean high, int arrived) { }
        Comparator<O> urgency = Comparator.comparingInt((O o) -> o.high() ? 0 : 1).thenComparingInt(O::arrived);
        PriorityOrderQueue<O> pq = new PriorityOrderQueue<>(urgency);
        pq.add(new O("normal-early", false, 1));
        pq.add(new O("high-late", true, 5));
        pq.add(new O("normal-late", false, 6));
        pq.add(new O("high-early", true, 2));
        assertEquals(List.of("high-early", "high-late", "normal-early", "normal-late"),
                pq.toSortedList().stream().map(O::id).toList());
    }

    @Test
    void hashTablePutGetReplaceRemove() {
        ChainedHashTable<String, String> t = new ChainedHashTable<>(10);
        assertNull(t.put("upper-M001", "Momo"));
        t.put("upper-M002", "Chicken Momo");
        assertEquals("Momo", t.get("upper-M001"));
        assertEquals("Momo", t.put("upper-M001", "Veg Momo")); // replace returns old value
        assertEquals(2, t.size());
        assertEquals("Veg Momo", t.remove("upper-M001"));
        assertFalse(t.containsKey("upper-M001"));
        assertNull(t.remove("missing"));
        assertEquals(1, t.size());
    }

    @Test
    void hashTableChainsCollisionsInOneBucket() {
        ChainedHashTable<String, String> t = new ChainedHashTable<>(1); // every key collides
        t.put("a", "A");
        t.put("b", "B");
        t.put("c", "C");
        assertEquals(2, t.collisions());
        assertEquals(3, t.longestChain());
        assertEquals("A", t.get("a"));
        ChainedHashTable.Lookup<String> l = t.lookup("a");
        assertEquals(3, l.comparisons()); // newest at the head, so "a" is last in the chain
        t.remove("b"); // remove from the middle of a chain
        assertEquals(List.of(List.of("C", "A")), t.bucketContents());
    }

    @Test
    void hashOfStringMatchesPolynomialFormula() {
        assertEquals("QB-1042".hashCode(), ChainedHashTable.hash("QB-1042"));
        ChainedHashTable<String, String> t = new ChainedHashTable<>(10);
        int b = t.bucketOf("QB-1042");
        assertTrue(b >= 0 && b < 10);
    }

    @Test
    void mergeSortSortsAndIsStable() {
        record O(String id, int total) { }
        List<O> input = List.of(new O("a", 50), new O("b", 20), new O("c", 50), new O("d", 10), new O("e", 20));
        MergeSort.Result<O> r = MergeSort.sortWithStats(input, Comparator.comparingInt(O::total));
        // equal totals keep their original order: b before e, a before c
        assertEquals(List.of("d", "b", "e", "a", "c"), r.sorted().stream().map(O::id).toList());
        assertTrue(r.comparisons() > 0);
        assertEquals("a", input.get(0).id()); // input untouched

        Random rnd = new Random(7);
        List<Integer> big = new ArrayList<>();
        for (int i = 0; i < 500; i++) big.add(rnd.nextInt());
        List<Integer> expected = new ArrayList<>(big);
        Collections.sort(expected);
        assertEquals(expected, MergeSort.sort(big, Comparator.naturalOrder()));
        assertEquals(List.of(), MergeSort.sort(List.<Integer>of(), Comparator.naturalOrder()));
    }

    @Test
    void binarySearchFindsInLogSteps() {
        List<Integer> sorted = new ArrayList<>();
        for (int i = 0; i < 1000; i++) sorted.add(i * 2); // 0, 2, 4, ... 1998
        BinarySearch.Result<Integer> hit = BinarySearch.search(sorted, 1042, Function.identity(), Comparator.naturalOrder());
        assertTrue(hit.found());
        assertEquals(521, hit.index());
        assertTrue(hit.steps() <= 10, "1000 items should need at most 10 steps, took " + hit.steps());

        BinarySearch.Result<Integer> miss = BinarySearch.search(sorted, 1043, Function.identity(), Comparator.naturalOrder());
        assertFalse(miss.found());
        assertEquals(-1, miss.index());

        assertFalse(BinarySearch.search(List.<Integer>of(), 1, Function.identity(), Comparator.naturalOrder()).found());
    }
}
