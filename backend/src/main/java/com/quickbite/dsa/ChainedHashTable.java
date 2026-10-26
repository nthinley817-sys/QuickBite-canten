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
 * To keep chains short the table grows: once the load factor (entries per
 * bucket) passes the maximum, the bucket array doubles and every entry is
 * rehashed into its new bucket. Each resize is O(n), but it happens rarely
 * enough that put() stays O(1) amortised.
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

    /** Grow once entries per bucket go past this, the same default java.util.HashMap uses. */
    public static final double DEFAULT_MAX_LOAD_FACTOR = 0.75;

    private Entry<K, V>[] buckets;
    private final int initialBucketCount;
    private final double maxLoadFactor;
    private int size;
    private int resizes;

    public ChainedHashTable(int initialBucketCount) {
        this(initialBucketCount, DEFAULT_MAX_LOAD_FACTOR);
    }

    /** Pass Double.POSITIVE_INFINITY as maxLoadFactor for a table that never grows. */
    public ChainedHashTable(int initialBucketCount, double maxLoadFactor) {
        if (initialBucketCount < 1) {
            throw new IllegalArgumentException("initialBucketCount must be at least 1");
        }
        if (!(maxLoadFactor > 0)) {
            throw new IllegalArgumentException("maxLoadFactor must be positive");
        }
        this.initialBucketCount = initialBucketCount;
        this.maxLoadFactor = maxLoadFactor;
        this.buckets = newBuckets(initialBucketCount);
    }

    @SuppressWarnings("unchecked")
    private static <K, V> Entry<K, V>[] newBuckets(int count) {
        return (Entry<K, V>[]) new Entry[count];
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
        if (loadFactor() > maxLoadFactor) {
            resize(buckets.length * 2);
        }
        return null;
    }

    /** Moves every entry into a bucket array of the new size. O(n). */
    private void resize(int newBucketCount) {
        Entry<K, V>[] old = buckets;
        buckets = newBuckets(newBucketCount);
        for (Entry<K, V> head : old) {
            for (Entry<K, V> e = head; e != null; e = e.next) {
                int b = bucketOf(e.key); // same key, new bucket count, so usually a new bucket
                buckets[b] = new Entry<>(e.key, e.value, buckets[b]);
            }
        }
        resizes++;
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

    public int initialBucketCount() {
        return initialBucketCount;
    }

    /** How many times the bucket array has doubled. */
    public int resizes() {
        return resizes;
    }

    public double maxLoadFactor() {
        return maxLoadFactor;
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
