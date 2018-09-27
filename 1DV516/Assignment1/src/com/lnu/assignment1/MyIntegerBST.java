package com.lnu.assignment1;

import java.util.ArrayDeque;
import java.util.Queue;

/**
 * Our implementation of the described MyIntegerBST of assignment 1
 * in course 1DV516.
 * 
 * @author Oskar Mendel, Jesper Bergström
 * @version 0.00.00
 * @name MyIntegerBST.java
 */
public class MyIntegerBST implements A1Tree {

	private IntegerNode root = null;
	
	public MyIntegerBST() {
		root = null;
	}
	
	public MyIntegerBST(int value) {
		root = new IntegerNode(value);
	}
	
	@Override
	public void insert(Integer value) {
		root = insert(value, root);
	}
	
	private IntegerNode insert(int value, IntegerNode node) {
		if (node == null) {
			return new IntegerNode(value);
		}
		
		if (value < node.value) {
			node.left = insert(value, node.left);
		}
		else if (value > node.value) {
			node.right = insert(value, node.right);
		}
		
		return node;
	}

	@Override
	public Integer mostSimilarValue(Integer value) {
		return mostSimilarValue(value, root);
	}
	
	public Integer mostSimilarValue(Integer value, IntegerNode node) {
		if (node == null) {
			throw new IllegalStateException("The tree is empty, there is no similar values.");
		}
		
		int abs = Math.abs(node.value - value);
		if (abs == 0) {
			return node.value;
		}
		
		if (node.left != null && value < node.value) {
			int leftTree = mostSimilarValue(value, node.left);
			return (abs < Math.abs(leftTree - value)) ? node.value : leftTree;
		} else if (node.right != null && value > node.value) {
			int rightTree = mostSimilarValue(value, node.right);
			return (abs < Math.abs(rightTree - value)) ? node.value : rightTree;
		} else {
			return node.value;
		}
	}

	/**
	 * NOTE: Since depth is only relevant for this printing method we decided
	 * to implement a tuple storing the depth together with the node within the 
	 * queue.
	 */
	@Override
	public void printByLevels() {
		if (root == null) {
			throw new IllegalStateException("The tree is empty, there is no similar values.");
		}
		
		// NOTE: 
		// Using array dequeue because according to documentation at:
		// https://docs.oracle.com/javase/7/docs/api/java/util/ArrayDeque.html
		// "This class is likely to be faster than Stack when used as a stack, 
		//	and faster than LinkedList when used as a queue."
		int depth = 0;
		Queue<NodeDepthTuple> queue = new ArrayDeque<NodeDepthTuple>();
		queue.add(new NodeDepthTuple(root, 0));
		
		
		// Printing first level depth
		System.out.print("Depth " + 0 + ": ");
		
		while (!queue.isEmpty()) {
			NodeDepthTuple levelTuple = queue.poll();
			IntegerNode node = levelTuple.node;
			int nodeDepth = levelTuple.depth;
			
			if (depth < nodeDepth) {
				System.out.print("\n");
				System.out.print("Depth " + nodeDepth + ": ");
				depth = nodeDepth;
			}
			
			System.out.print(node.value + " ");
			
			if (node.left != null) {
				queue.add(new NodeDepthTuple(node.left, nodeDepth + 1));
			}
			
			if (node.right != null) {
				queue.add(new NodeDepthTuple(node.right, nodeDepth + 1));
			}
		}
	}
	
	private class NodeDepthTuple {
		public final IntegerNode node;
		public final int depth;
		public NodeDepthTuple(IntegerNode node, int depth ) {
			this.node = node;
			this.depth = depth;
		}
	}

	private class IntegerNode {
		int value;
		IntegerNode left;
		IntegerNode right;
		
		public IntegerNode(int value) {
			this.value = value;
			this.left = null;
			this.right = null;
		}
	}
}
