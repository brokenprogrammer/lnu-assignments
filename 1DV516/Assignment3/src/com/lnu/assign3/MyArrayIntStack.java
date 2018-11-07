package com.lnu.assign3;

public class MyArrayIntStack {

	private static final int DEFAULT_ARRAY_SIZE = 4;
	
	private int size = 0;
	private int[] array = new int[DEFAULT_ARRAY_SIZE];
	
	public int size() {
		return this.size;
	}
	
	public boolean isEmpty() {
		return size == 0;
	}
	
	private void resize() {
		int[] temp = new int[2 * array.length];
		for (int i = 0; i < array.length; ++i) {
			temp[i] = array[i];
		}
		this.array = temp;
	}
	
	/**
	 * Add integer at top of stack.
	 */
	public void push(int n) {
		if (this.size >= this.array.length) {
			this.resize();
		}
		
		this.array[size++] = n;
	}

	/**
	 *  Returns and removes integer at top of stack.
	 */
	public int pop() throws IndexOutOfBoundsException {
		if (isEmpty()) {
			throw new IndexOutOfBoundsException();
		}
		int val = this.array[--size];
		this.array[size] = 0;
		return val;
	}

	/**
	 * Returns without removing integer at top of stack.
	 */
	public int peek() throws IndexOutOfBoundsException {
		if (isEmpty()) {
			throw new IndexOutOfBoundsException();
		}
		
		return this.array[size()-1];
	}

}
