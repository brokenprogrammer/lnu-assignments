package com.lnu.assignment2;

/**
 * 
 * @author Oskar Mendel
 * @author Jesper Bergström
 *
 * @param <AnyType>
 */
public class MyHashTable<AnyType extends Object> implements A2HashTable<AnyType> 
{

	private static final int DEFAULT_SIZE = 13;
	
	private final double LOAD_LIMIT;
	private HashNode<AnyType>[] table;
	private int size;
	private double loadFactor;
	
	public MyHashTable(double loadLimit) 
	{
		this.LOAD_LIMIT = loadLimit;
		
		this.table = new HashNode[DEFAULT_SIZE];
		clear();
		
		this.size = 0;
		this.loadFactor = 0.0 / this.table.length;
	}
	
	private void resize(int prime) {
		for (int i = prime; ; i++) {
			if (isPrime(i)) {
				this.table = new HashNode[i];
				return;
			}
		}
	}
	
	private static boolean isPrime(int n) {
		if (n == 1) {
			return false;
		}
		
		if (n == 2) {
			return true;
		}
		
		double d = Math.sqrt(n);
		
		for (int i = 2; i <= d; i++) {
			if (n % i == 0) {
				return false;
			}
		}
		
		return true;
}
	
	public int size() {
		return this.size;
	}
	
	private void rehash() 
	{
		HashNode<AnyType>[] old = this.table;
		resize(this.table.length * 2);
		this.size = 0;
		
		for(int i = 0;
			i < old.length;
			i++) 
		{
			if (old[i] != null && old[i].deleted == false) {
				insert(old[i].content);
			}
		}
	}

	public int find(AnyType element) 
	{
		int currentPos = element.hashCode() % this.table.length;
		if (currentPos < 0) 
		{
			currentPos += this.table.length;
		}
		
		for (int i = 0; 
			this.table[currentPos] != null && 
			!this.table[currentPos].content.equals(element); 
			i++) 
		{
			currentPos = currentPos + (i*i);
			if (currentPos >= this.table.length) 
			{
				currentPos = currentPos % this.table.length;
				if (currentPos < 0) {
					currentPos += this.table.length;
				}
			}
		}
		
		return currentPos;
	}
	
	@Override
	public void insert(AnyType element) 
	{
		int pos = find(element);
		
		// Check if element already exists
		if (this.table[pos] != null && this.table[pos].deleted == false) 
		{
			return;
		}
		
		// Insert element into HashTable.
		this.table[pos] = new HashNode<AnyType>(element);
		this.size++;
		
		// NOTE: Since we will rehash in case the load factor is greater than 0.5 we will never face the
		//		 scenario where the table doesn't have an empty cell for the new element to insert we 
		//		 simply just need to rehash here.
		this.loadFactor = this.size / this.table.length;
		if (this.loadFactor > this.LOAD_LIMIT || this.loadFactor > 0.5) 
		{
			rehash();
		}
	}

	@Override
	public void delete(AnyType element) 
	{
		int pos = find(element);
		if (this.table[pos] != null && this.table[pos].deleted == false) {
			this.table[pos].deleted = true;
			this.size--;
		}
	}

	@Override
	public boolean contains(AnyType element) 
	{
		int pos = find(element);
		return this.table[pos] != null && this.table[pos].deleted == false;
	}
	
	public void clear() 
	{
		for (int i = 0;
			i < this.table.length; 
			i++) 
		{
			this.table[i] = null;
		}
	}
	
	private class HashNode<AnyType extends Object> 
	{
		public AnyType content;
		public boolean deleted;
		
		public HashNode(AnyType e) 
		{
			this.content = e;
			this.deleted = false;
		}
	}
}
