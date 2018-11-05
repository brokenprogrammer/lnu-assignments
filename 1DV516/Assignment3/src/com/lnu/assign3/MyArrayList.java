package com.lnu.assign3;

public class MyArrayList<T> {

	private static final int DEFAULT_ARRAY_SIZE = 4;
	
	private int size = 0;
	private Object[] array = new Object[DEFAULT_ARRAY_SIZE];
	
	public MyArrayList() {}
	
	public int size() {
		return this.size;
	}
	
	public boolean isEmpty() {
		return size == 0;
	}
	
	private void resize() {
		Object[] temp = new Object[2 * array.length];
		for (int i = 0; i < array.length; ++i) {
			temp[i] = array[i];
		}
		this.array = temp;
	}
	
	public void add(T element) {
		if (this.size >= this.array.length) {
			this.resize();
		}
		this.array[size++] = element;
	}

	public void addAt(T n, int index) throws IndexOutOfBoundsException {
		if ((index < 0 || index >= this.size)) {
			throw new IndexOutOfBoundsException();
		}
		
		this.size++;
		if (this.size >= this.array.length) {
			this.resize();
		}
		
		if (index == size()-1) {
			this.array[size] = n;
		} else {
			Object last = this.array[index];
			
			for (int x = index+1; x < size(); x++) {
				Object temp = this.array[x];
				this.array[x] = last;
				last = temp;
			}
			
			this.array[index] = n;
		}
		
	}

	public void remove(int index) throws IndexOutOfBoundsException {
		if ((index < 0 || index >= this.size)) {
			throw new IndexOutOfBoundsException();
		}
		
		if(index == size()-1) {
			this.array[--size] = 0;
		} else {
			
			Object last = this.array[size];
			for (int x = size()-1; x >= index; x--) {
				Object temp = this.array[x];
				this.array[x] = last;
				last = temp;
			}
			this.size--;
		}
	}

	public T get(int index) throws IndexOutOfBoundsException {
		if ((index < 0 || index >= this.size)) {
			throw new IndexOutOfBoundsException("Size: " + this.size + " Index: " + index);
		}
		
		T element = (T)array[index];
		
		return element;
	}

	public int indexOf(T element) {
		for(int x = 0; x < this.array.length; x++) {
			T target = (T)this.array[x];
			if (target.equals(element)) {
				return x;
			}
		}
		
		return -1;
	}

}
