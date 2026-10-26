package com.quickbite.dsa;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Priority queue backed by a binary min-heap stored in an array.
 *
 * The "smallest" element by the comparator is always at index 0, so the most
 * urgent order is available in O(1). For a node at index i its children are at
 * 2i+1 and 2i+2 and its parent at (i-1)/2. Adding sifts the new element up;
 * removing the top moves the last element to the root and sifts it down.
 * Both are O(log n).
 *
 * QuickBite orders by priority (High before Normal) and then by arrival time,
 * so equally urgent orders are still served fairly, first come first served.
 */
public class PriorityOrderQueue<T> {

    private static final int INITIAL_CAPACITY = 16;

    private final Comparator<? super T> comparator;
    private Object[] heap = new Object[INITIAL_CAPACITY];
    private int size;

    public PriorityOrderQueue(Comparator<? super T> comparator) {
        this.comparator = comparator;
    }

    /** Inserts an element. O(log n). */
    public void add(T value) {
        if (size == heap.length) {
            heap = Arrays.copyOf(heap, size * 2);
        }
        heap[size] = value;
        siftUp(size);
        size++;
    }

    /** Returns the most urgent element without removing it, or null when empty. O(1). */
    public T peek() {
        return size == 0 ? null : at(0);
    }

    /** Removes and returns the most urgent element, or null when empty. O(log n). */
    public T poll() {
        if (size == 0) {
            return null;
        }
        T top = at(0);
        size--;
        heap[0] = heap[size];
        heap[size] = null;
        if (size > 0) {
            siftDown(0);
        }
        return top;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * All elements from most to least urgent, without changing this queue:
     * polls a copy of the heap. O(n log n).
     */
    public List<T> toSortedList() {
        PriorityOrderQueue<T> copy = new PriorityOrderQueue<>(comparator);
        copy.heap = Arrays.copyOf(heap, heap.length);
        copy.size = size;
        List<T> out = new ArrayList<>(size);
        while (!copy.isEmpty()) {
            out.add(copy.poll());
        }
        return out;
    }

    private void siftUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (comparator.compare(at(index), at(parent)) >= 0) {
                return;
            }
            swap(index, parent);
            index = parent;
        }
    }

    private void siftDown(int index) {
        while (true) {
            int left = 2 * index + 1;
            int right = left + 1;
            int smallest = index;
            if (left < size && comparator.compare(at(left), at(smallest)) < 0) {
                smallest = left;
            }
            if (right < size && comparator.compare(at(right), at(smallest)) < 0) {
                smallest = right;
            }
            if (smallest == index) {
                return;
            }
            swap(index, smallest);
            index = smallest;
        }
    }

    @SuppressWarnings("unchecked")
    private T at(int index) {
        return (T) heap[index];
    }

    private void swap(int a, int b) {
        Object tmp = heap[a];
        heap[a] = heap[b];
        heap[b] = tmp;
    }
}
