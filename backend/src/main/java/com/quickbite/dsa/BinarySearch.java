package com.quickbite.dsa;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

/**
 * Binary search over a list that is already sorted by the search key.
 *
 * Compares the key with the middle element and throws away the half that
 * cannot contain it, so each step halves what's left: O(log n). Finding one
 * order among 1,000 takes at most 10 steps, versus up to 1,000 for a linear
 * scan.
 */
public final class BinarySearch {

    private BinarySearch() {
    }

    /** index is -1 when not found; steps counts the comparisons made. */
    public record Result<T>(int index, T element, int steps) {
        public boolean found() {
            return index >= 0;
        }
    }

    public static <T, K> Result<T> search(List<T> sorted, K key, Function<? super T, ? extends K> keyOf,
                                          Comparator<? super K> comparator) {
        int low = 0;
        int high = sorted.size() - 1;
        int steps = 0;
        while (low <= high) {
            int mid = (low + high) >>> 1; // avoids overflow of (low + high) / 2
            steps++;
            int cmp = comparator.compare(keyOf.apply(sorted.get(mid)), key);
            if (cmp == 0) {
                return new Result<>(mid, sorted.get(mid), steps);
            }
            if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return new Result<>(-1, null, steps);
    }
}
