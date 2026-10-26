package com.quickbite.dto;

import java.util.List;

/** JSON shapes returned by /api/dsa/*, the staff "Data Structures" and "Search & Sort" pages. */
public final class DsaResponses {

    private DsaResponses() {
    }

    /** Pending orders in an OrderQueue, front (next to serve) first. */
    public record QueueView(String structure, int size, OrderDto front, List<OrderDto> items) {
    }

    /** Pending orders in a PriorityOrderQueue (binary heap). serveOrder is the order they'd be polled in. */
    public record PriorityView(String structure, int size, OrderDto next, List<OrderDto> high,
                               List<OrderDto> normal, List<OrderDto> serveOrder) {
    }

    /** One ChainedHashTable: its stats and, per bucket, the labels of what's in its chain. */
    public record HashTableView(String name, String keyField, int bucketCount, int size, double loadFactor,
                                int collisions, int longestChain, List<List<String>> buckets) {
    }

    /** Result of looking a key up in the hash tables. */
    public record HashLookup(String key, boolean found, String table, int bucket, int comparisons, String label) {
    }

    public record HashView(HashTableView menu, HashTableView orders, HashLookup lookup) {
    }

    /** Orders after MergeSort, with how many comparisons it took. */
    public record SortView(String algorithm, String by, String direction, long comparisons, List<OrderDto> orders) {
    }

    /** Result of a BinarySearch for an order number. */
    public record SearchView(String algorithm, String query, boolean found, OrderDto order, int steps,
                             int searchedCount) {
    }
}
