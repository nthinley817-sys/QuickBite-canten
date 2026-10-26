package com.quickbite.dsa;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Top-down merge sort.
 *
 * Splits the list in half, sorts each half recursively, then merges the two
 * sorted halves by repeatedly taking the smaller front element. Always
 * O(n log n) comparisons, uses O(n) extra space, and is stable: elements that
 * compare equal keep their original order (so orders with the same total stay
 * in arrival order).
 */
public final class MergeSort {

    private MergeSort() {
    }

    /** The sorted list plus how many comparisons it took. */
    public record Result<T>(List<T> sorted, long comparisons) {
    }

    /** Returns a new sorted list; the input is not changed. */
    public static <T> List<T> sort(List<T> input, Comparator<? super T> comparator) {
        return sortWithStats(input, comparator).sorted();
    }

    public static <T> Result<T> sortWithStats(List<T> input, Comparator<? super T> comparator) {
        List<T> work = new ArrayList<>(input);
        List<T> buffer = new ArrayList<>(work);
        long[] comparisons = {0};
        sort(work, buffer, 0, work.size(), comparator, comparisons);
        return new Result<>(work, comparisons[0]);
    }

    /** Sorts work[from, to). */
    private static <T> void sort(List<T> work, List<T> buffer, int from, int to,
                                 Comparator<? super T> comparator, long[] comparisons) {
        if (to - from < 2) {
            return;
        }
        int mid = (from + to) >>> 1;
        sort(work, buffer, from, mid, comparator, comparisons);
        sort(work, buffer, mid, to, comparator, comparisons);
        merge(work, buffer, from, mid, to, comparator, comparisons);
    }

    private static <T> void merge(List<T> work, List<T> buffer, int from, int mid, int to,
                                  Comparator<? super T> comparator, long[] comparisons) {
        for (int i = from; i < to; i++) {
            buffer.set(i, work.get(i));
        }
        int left = from;
        int right = mid;
        for (int out = from; out < to; out++) {
            if (left >= mid) {
                work.set(out, buffer.get(right++));
            } else if (right >= to) {
                work.set(out, buffer.get(left++));
            } else {
                comparisons[0]++;
                // "<=" takes from the left on ties, which is what keeps the sort stable.
                if (comparator.compare(buffer.get(left), buffer.get(right)) <= 0) {
                    work.set(out, buffer.get(left++));
                } else {
                    work.set(out, buffer.get(right++));
                }
            }
        }
    }
}
