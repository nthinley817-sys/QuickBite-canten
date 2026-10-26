package com.quickbite.dsa;

import java.util.ArrayList;
import java.util.List;

/**
 * Hash table that resolves collisions by separate chaining.
 *
 * The key is hashed to a number, and that number modulo the bucket count picks
 * a bucket. Each bucket holds a linked list (a "chain") of entries whose keys
 * landed there. Lookups only walk one chain, so with a good spread they take
 * O(1) on average; in the worst case (every key in one bucket) O(n).
 *
 * The bucket count is fixed so the staff page can show the same 10 buckets
 * every time; a production table would grow and rehash past a load factor.
 */
public class ChainedHashTable<K, V> {

    private static final class Entry<K, V> {
        final K key;
        V value;
        Entry<K, V> next;

        Entry(K key, V value, Entry<K, V> next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    /** Result of a lookup, with how much work it took. */
    public record Lookup<V>(V value, int bucket, int comparisons) {
        public boolean found() {
            return value != null;
        }
    }

    private final Entry<K, V>[] buckets;
    private int size;

    @SuppressWarnings("unchecked")
    public ChainedHashTable(int bucketCount) {
        if (bucketCount < 1) {
            throw new IllegalArgumentException("bucketCount must be at least 1");
        }
        this.buckets = (Entry<K, V>[]) new Entry[bucketCount];
    }

    /**
     * Polynomial rolling hash for strings: h = 31*h + c for each character,
     * which spreads similar keys like "QB-1011" and "QB-1012" apart. Other key
     * types use their own hashCode().
     */
    static int hash(Object key) {
        if (key instanceof String s) {
            int h = 0;
            for (int i = 0; i < s.length(); i++) {
                h = 31 * h + s.charAt(i);
            }
            return h;
        }
        return key.hashCode();
    }

    /** Which bucket a key belongs in. floorMod keeps negative hashes in range. */
    public int bucketOf(K key) {
        return Math.floorMod(hash(key), buckets.length);
    }

    /** Inserts or replaces. Returns the previous value, or null. O(1) average. */
    public V put(K key, V value) {
        int b = bucketOf(key);
        for (Entry<K, V> e = buckets[b]; e != null; e = e.next) {
            if (e.key.equals(key)) {
                V old = e.value;
                e.value = value;
                return old;
            }
        }
        buckets[b] = new Entry<>(key, value, buckets[b]); // new entries go at the head of the chain
        size++;
        return null;
    }

    /** Returns the value for a key, or null. O(1) average. */
    public V get(K key) {
        return lookup(key).value();
    }

    /** Like get, but also reports the bucket and how many keys were compared. */
    public Lookup<V> lookup(K key) {
        int b = bucketOf(key);
        int comparisons = 0;
        for (Entry<K, V> e = buckets[b]; e != null; e = e.next) {
            comparisons++;
            if (e.key.equals(key)) {
                return new Lookup<>(e.value, b, comparisons);
            }
        }
        return new Lookup<>(null, b, comparisons);
    }

    public boolean containsKey(K key) {
        return lookup(key).found();
    }

    /** Removes a key. Returns its value, or null if it wasn't there. O(1) average. */
    public V remove(K key) {
        int b = bucketOf(key);
        Entry<K, V> prev = null;
        for (Entry<K, V> e = buckets[b]; e != null; prev = e, e = e.next) {
            if (e.key.equals(key)) {
                if (prev == null) {
                    buckets[b] = e.next;
                } else {
                    prev.next = e.next;
                }
                size--;
                return e.value;
            }
        }
        return null;
    }

    public int size() {
        return size;
    }

    public int bucketCount() {
        return buckets.length;
    }

    /** Stored entries per bucket. */
    public double loadFactor() {
        return (double) size / buckets.length;
    }

    /** The values in each bucket, chain order, for display. */
    public List<List<V>> bucketContents() {
        List<List<V>> out = new ArrayList<>(buckets.length);
        for (Entry<K, V> head : buckets) {
            List<V> chain = new ArrayList<>();
            for (Entry<K, V> e = head; e != null; e = e.next) {
                chain.add(e.value);
            }
            out.add(chain);
        }
        return out;
    }

    /** Entries that had to share a bucket with an earlier one. */
    public int collisions() {
        int total = 0;
        for (List<V> chain : bucketContents()) {
            total += Math.max(0, chain.size() - 1);
        }
        return total;
    }

    public int longestChain() {
        int longest = 0;
        for (List<V> chain : bucketContents()) {
            longest = Math.max(longest, chain.size());
        }
        return longest;
    }
}
