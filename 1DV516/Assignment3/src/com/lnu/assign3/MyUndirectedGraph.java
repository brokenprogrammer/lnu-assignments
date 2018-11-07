package com.lnu.assign3;

import java.util.ArrayList;
import java.util.List;

public class MyUndirectedGraph implements A3Graph {

	private MyArrayList<MyArrayList<Integer>> adjacencyList;
	
	public MyUndirectedGraph() {
		this.adjacencyList = new MyArrayList<MyArrayList<Integer>>();
	}
	
    @Override
    public void addVertex(int vertex) {
    	this.adjacencyList.add(new MyArrayList<Integer>());
    }

    @Override
    public void addEdge(int sourceVertex, int targetVertex) {
    	MyArrayList<Integer> sourceEdgeList = this.adjacencyList.get(sourceVertex);
    	MyArrayList<Integer> destEdgeList = this.adjacencyList.get(targetVertex);
    	
    	sourceEdgeList.add(targetVertex);
    	destEdgeList.add(sourceVertex);
    }

    void checkConnectedEdges(int vertex, boolean[] visited) {
    	if (visited[vertex]) {
    		return;
    	}
    	
    	visited[vertex] = true;
    	
    	MyArrayList<Integer> edges = this.adjacencyList.get(vertex);
    	for (int edge = 0; edge < edges.size(); ++edge) {
    		checkConnectedEdges(edges.get(edge), visited);
    	}
    }
    
    @Override
    public boolean isConnected() {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	
    	checkConnectedEdges(0, visited);
		for (int i = 0; i < this.adjacencyList.size(); ++i) {
			if (visited[i] != true) {
				return false;
			}
		}
		
    	return true;
    }

    boolean checkAsyclicEdges(int vertex, boolean[] visited, int parent) {
    	visited[vertex] = true;
    	
    	MyArrayList<Integer> edges = this.adjacencyList.get(vertex);
    	for (int edge = 0; edge < edges.size(); ++edge) {
    		if (!visited[edges.get(edge)]) {
    			if (checkAsyclicEdges(edges.get(edge), visited, vertex)) {
    				return true;
    			}
    		} else if (edges.get(edge) != parent) {
    			return true;
    		}
    	}
    	
    	return false;
    }
    
    @Override
    public boolean isAcyclic() {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	
    	for(int vertex = 0; vertex < this.adjacencyList.size(); ++vertex) {
    		if (!visited[vertex]) {
	    		if (checkAsyclicEdges(vertex, visited, -1)) {
	    			return false;
	    		}
    		}
    	}
    	
    	return true;
    }

    @Override
    public List<List<Integer>> connectedComponents() {
    	MyArrayList<MyArrayList<Integer>> connectedComponents = new MyArrayList<MyArrayList<Integer>>();
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	boolean v2[] = new boolean[this.adjacencyList.size()];
    	
    	for(int vertex = 0; vertex < this.adjacencyList.size(); ++vertex) {
    		if (visited[vertex] == false) {
    			checkConnectedEdges(vertex, v2);
    			MyArrayList<Integer> component = new MyArrayList<Integer>();

    			for (int i = 0; i < visited.length; ++i) {
    				if (v2[i]) {    					
    					visited[i] = v2[i];
    					component.add(i);
    				}
    			}
    			
    			connectedComponents.add(component);
    			v2 = new boolean[this.adjacencyList.size()];
    		}
    	}
    	
    	List<List<Integer>> result = new ArrayList<List<Integer>>();
    	
    	for (int i = 0; i < connectedComponents.size(); ++i) {
    		MyArrayList<Integer> target = connectedComponents.get(i);
    		ArrayList<Integer> destination = new ArrayList<Integer>();
    		
    		for (int j = 0; j < target.size(); ++j) {
    			destination.add(target.get(j));
    		}
    		result.add(destination);
    	}
		return result;
    }

    @Override
    public boolean hasEulerPath() {
    	if (isConnected() == false) {
    		return false;
    	}
    	
	    int verticesWithOddEdges = 0;
		for (int vertex = 0; vertex < this.adjacencyList.size(); ++vertex) {
	    	if (!(this.adjacencyList.get(vertex).size() % 2 == 0)) {
	    		verticesWithOddEdges++;
	    	}
	    }
	    	
		if (verticesWithOddEdges > 2) {
			return false;
		}
		
		return true;
    }

    private int processEulerEdge(int position, MyArrayIntStack stack, MyArrayList<Integer> path) {
    	if (this.adjacencyList.get(position).size() >= 1) {
			stack.push(position);
			position = this.adjacencyList.get(position).remove(0);
			for (int i = 0; i < this.adjacencyList.get(position).size(); i++) {
				if (this.adjacencyList.get(position).get(i) == stack.peek()) {
					this.adjacencyList.get(position).remove(i);
				}
			}
		} else {
			path.add(position);
			position = stack.pop();
		}
    	
    	return position;
    }
    
    @Override
    public List<Integer> eulerPath() {
    	if (!hasEulerPath()) {
    		return null;
    	}
    	
    	int verticesWithOddEdges = 0;
		int firstOddVertice = Integer.MIN_VALUE;
    	
		for (int vertex = 0; vertex < this.adjacencyList.size(); ++vertex) {
	    	if (!(this.adjacencyList.get(vertex).size() % 2 == 0)) {
	    		verticesWithOddEdges++;
	    		if (vertex > firstOddVertice) {
	    			firstOddVertice = vertex;
	    		}
	    	}
	    }
		
		MyArrayList<Integer> path = new MyArrayList<Integer>();
		MyArrayIntStack stack = new MyArrayIntStack();
		int position = 0;
		if (verticesWithOddEdges == 0) {
			position = 0;
		} else if (verticesWithOddEdges == 2) {
			position = firstOddVertice;
		}
		
		position = processEulerEdge(position, stack, path);
		
		while (!(stack.isEmpty())) {
			position = processEulerEdge(position, stack, path);	
		}
		path.add(position);
		
		List<Integer> result = new ArrayList<Integer>(); 
		for (int i = 0; i < path.size(); i++) {
			result.add(path.get(i));
		}
		
		return result;
    }

}
