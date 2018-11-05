package com.lnu.assign3;

import java.util.List;

public class MyUndirectedGraph implements A3Graph {

	MyArrayList<MyArrayList<Integer>> adjacencyList;
	
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
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public boolean hasEulerPath() {
	// TODO Auto-generated method stub
	return A3Graph.super.hasEulerPath();
    }

    @Override
    public List<Integer> eulerPath() {
	// TODO Auto-generated method stub
	return A3Graph.super.eulerPath();
    }
    
    

}
