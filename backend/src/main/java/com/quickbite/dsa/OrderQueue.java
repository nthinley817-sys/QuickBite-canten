package com.quickbite.dsa;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * First-in, first-out queue built on a singly linked list.
 *
 * Pending orders are served in the order they arrived: new orders join at the
 * rear (enqueue) and the kitchen takes the next one from the front (dequeue).
 * Keeping both a head and a tail pointer makes both operations O(1).
 *
 *   FRONT  [QB-1011] -> [QB-1012] -> [QB-1013]  REAR
 *           head                       tail
 */
public class OrderQueue<T> implements Iterable<T> {

    private static final class Node<T> {
        final T value;
        Node<T> next;

        Node(T value) {
            this.value = value;
        }
    }

    private Node<T> head; // front: next to be served
    private Node<T> tail; // rear: most recently added
    private int size;

    /** Adds to the rear. O(1). */
    public void enqueue(T value) {
        Node<T> node = new Node<>(value);
        if (tail == null) {
            head = node;
        } else {
            tail.next = node;
        }
        tail = node;
        size++;
    }

    /** Removes and returns the front element. O(1). */
    public T dequeue() {
        if (head == null) {
            throw new NoSuchElementException("Queue is empty");
        }
        T value = head.value;
        head = head.next;
        if (head == null) {
            tail = null;
        }
        size--;
        return value;
    }

    /** Returns the front element without removing it, or null when empty. O(1). */
    public T peek() {
        return head == null ? null : head.value;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    /** Front-to-rear copy of the contents. O(n). */
    public List<T> toList() {
        List<T> out = new ArrayList<>(size);
        for (T value : this) {
            out.add(value);
        }
        return out;
    }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<>() {
            private Node<T> current = head;

            @Override
            public boolean hasNext() {
                return current != null;
            }

            @Override
            public T next() {
                if (current == null) {
                    throw new NoSuchElementException();
                }
                T value = current.value;
                current = current.next;
                return value;
            }
        };
    }
}
