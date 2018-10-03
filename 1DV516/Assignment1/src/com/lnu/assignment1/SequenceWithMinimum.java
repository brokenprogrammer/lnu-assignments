package com.lnu.assignment1;

/**
 * Our implementation of the described SequenceWithMinimum of assignment 1
 * in course 1DV516.
 * 
 * @author Oskar Mendel, Jesper Bergström
 * @version 0.00.00
 * @name SequenceWithMinimum.java
 */
public class SequenceWithMinimum implements A1SequenceWithMinimum {
	
	private Node first;
	private Node last;
	
	private int size;
	
	public SequenceWithMinimum() {
		this.first = null;
		this.last = null;
		this.size = 0;
	}
	
	public boolean isEmpty() {
		return first == null;
	}
	
	public int size() {
		return size;
	}
	
	@Override
	public void insertRight(Integer value) {
		Node newNode = new Node(value);
		
		if (isEmpty()) {
			first = newNode;
		} else {
			last.next = newNode;
			newNode.prev = last;
		}
		
		last = newNode;
		this.size++;
	}

	@Override
	public Integer removeRight() {
		if (isEmpty()) {
			throw new IndexOutOfBoundsException();
		}
		
		Node oldLast = last;
		
		if (first.next == null) {
			first = null;
			last = null;
		} else {
			last = last.prev;
			last.next = null;
		}
		
		this.size--;
		return oldLast != null ? oldLast.getValue() : null;
	}

	@Override
	public void insertLeft(Integer value) {
		Node newNode = new Node(value);
		
		if (isEmpty()) {
			last = newNode;
		} else {
			first.prev = newNode;
			newNode.next = first;
		}
		
		first = newNode;
		this.size++;
	}

	@Override
	public Integer removeLeft() {
		if (isEmpty()) {
			throw new IndexOutOfBoundsException();
		}
		
		Node oldFirst = first;
		
		if (first.next == null) {
			first = null;
			last = null;
		} else {
			first = first.next;
			first.prev = null;
		}
		
		this.size--;
		return oldFirst != null ? oldFirst.getValue() : null;
	}

	@Override
	public Integer findMinimum() {
		if (isEmpty()) {
			throw new IndexOutOfBoundsException();
		}
		
		Integer foundMin = Integer.MAX_VALUE;
		
		Node node = first;
		while (node != null) {
			if (node.getValue() < foundMin) {
				foundMin = node.getValue();
			}
			
			node = node.next;
		}
		
		return foundMin;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("{");
		
		Node node = first;
		while (node.next != null) {
			sb.append(node.getValue());
			sb.append(", ");
			node = node.next;
		}
		
		sb.append(node.getValue());
		sb.append("}");
		return sb.toString();
	}

	private class Node {
		private Integer value;
		private Node prev;
		private Node next;
		
		public Node (Integer value) {
			this.value = value;
			this.prev = null;
			this.next = null;
		}
		
		public Integer getValue() {
			return this.value;
		}
	}
}
