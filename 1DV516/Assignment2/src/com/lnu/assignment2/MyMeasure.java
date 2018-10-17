package com.lnu.assignment2;

public class MyMeasure implements A2Measure{

	@Override
	public boolean isSameCollection(int[] array1, int[] array2) {
		if (array1.length != array2.length) {
			return false;
		}
		
		BinaryHeap h1 = new BinaryHeap(array1);
		BinaryHeap h2 = new BinaryHeap(array2);
		
		for (int i = 0; i < array1.length; i++) {
			if (h1.removeMin() != h2.removeMin()) {
				return false;
			}
		}
		
		return true;
	}

	@Override
	public int minDifferences(int[] array1, int[] array2) {
		if (array1.length != array2.length) {
			throw new IllegalArgumentException();
		}
		
		int sum = 0;
		BinaryHeap h1 = new BinaryHeap(array1);
		BinaryHeap h2 = new BinaryHeap(array2);
		
		for (int i = 0; i < array1.length; i++) {
			int x = h2.removeMin();
			int y = h1.removeMin();
			sum += ((x - y) * (x - y));
		}
		
		return sum;
	}

	@Override
	public int[] getPercentileRange(int[] arr, int lower, int upper) {
		if (lower > upper) {
			throw new IllegalArgumentException();
		}
		
		int lowerIndex = (int) (arr.length * (lower / 100.0 ));
		int upperIndex = (int) (arr.length * (upper / 100.0 ));
		int[] res = new int[upperIndex - lowerIndex];
		
		int[] sorted = sort(arr);
		
		int index = 0;
		for(int i = lowerIndex; i < upperIndex; i++) {
			res[index++] = sorted[i];
		}
		
		
		return res;
	}
	
	private int[] merge(int[] left, int[] right) {
		int[] arr = new int[left.length + right.length];
		
		int leftIndex = 0;
		int rightIndex = 0;
		for (int i = 0; i < arr.length; i++) {
			if (leftIndex >= left.length) {
				arr[i] = right[rightIndex++];
			} else if (rightIndex >= right.length) {
				arr[i] = left[leftIndex++];
			} else if (left[leftIndex] <= right[rightIndex]) {
				arr[i] = left[leftIndex++];
			} else {
				arr[i] = right[rightIndex++];
			}
		}
		
		return arr;
	}
	
	public int[] sort(int[] arr) {
		if (arr.length <= 1) {
			return arr;
		}
		
		int mid = arr.length / 2;
		int[] left = new int[mid];
		int[] right = new int[arr.length-mid];
		
		for (int i = 0; i < left.length; i++) {
			left[i] = arr[i];
		}
		for (int i = 0; i < right.length; i++) {
			right[i] = arr[i + mid];
		}
		
		return merge(sort(left), sort(right));
	}
	
	public class BinaryHeap {
	
		private static final int DEFAULT_SIZE = 10;
		private int[] array;
		private int size;
		
		public BinaryHeap() {
			this.array = new int[DEFAULT_SIZE];
			this.size = 0;
		}
		
		public BinaryHeap(int[] elements) {
			this.size = elements.length;
			this.array = new int[(elements.length + 2) * 2];
			
			int j = 1;
			for (int i = 0; i < elements.length; i++, j++) {
				this.array[j] = elements[i];
			}
			
			buildHeap();
		}
		
		private void buildHeap() {
			for(int i = this.size / 2; i > 0; i--) {
				percDown(i);
			}
		}
		
		public void resize() {
			int[] old = this.array;
			
			this.array = new int[old.length * 2 + 1];
			
			for (int i = 0; i < old.length; i++) {
				this.array[i] = old[i];
			}
		}
		
		public void insert(int x) {
			if (this.size == this.array.length - 1) {
				resize();
			}
			
			int pos = ++this.size;
			for (this.array[0] = x; this.array[pos/2] > x; pos/=2) {
				this.array[pos] = this.array[pos/2];
			}
			this.array[pos] = x;
		}
		
		public void percDown(int pos) {
			int c;
			int temp = this.array[pos];
			
			while (pos*2 <= this.size) {
				c = pos*2;
				if (c != this.size && array[c+1] < this.array[c]) {
					c++;
				}
				
				if (this.array[c] < temp) {
					this.array[pos] = this.array[c];
				} else {
					break;
				}
				
				pos = c;
			}
			
			this.array[pos] = temp;
		}
		
		public int removeMin() {
			if (this.size == 0) {
				throw new ArrayIndexOutOfBoundsException();
			}
			
			int root = this.array[1];
			this.array[1] = this.array[this.size--];
			percDown(1);
			
			return root;
		}
	}
}
