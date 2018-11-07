package com.lnu.assign3;

import java.util.ArrayList;
import java.util.List;

/**
 
 *
 */
public class MyDirectedGraph implements A3Graph {

	private MyArrayList<MyArrayList<Integer>> adjacencyList;
	
	public MyDirectedGraph() {
		this.adjacencyList = new MyArrayList<MyArrayList<Integer>>();
		//this.addVertex(0);
	}
	
    @Override
    public void addVertex(int vertex) {
    	this.adjacencyList.add(new MyArrayList<Integer>());
    }

    @Override
    public void addEdge(int sourceVertex, int targetVertex) {
    	MyArrayList<Integer> sourceEdgeList = this.adjacencyList.get(sourceVertex);
    	sourceEdgeList.add(targetVertex);
    }

    @Override
    public boolean isConnected() {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	
    	for(int vertex = 0; vertex < this.adjacencyList.size(); ++vertex) {
    		checkConnectedEdges(vertex, visited);
    		for (int i = 0; i < this.adjacencyList.size(); ++i) {
    			if (visited[i] != true) {
    				return false;
    			}
    		}
			
    		visited = new boolean[this.adjacencyList.size()];
    	}
    	
    	
    	return true;
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
    
    boolean checkAsyclicEdges(int vertex, boolean[] visited) {
    	if (visited[vertex] == true) {
    		return true;
    	}
    	
    	visited[vertex] = true;
    	
    	MyArrayList<Integer> edges = this.adjacencyList.get(vertex);
    	for (int edge = 0; edge < edges.size(); ++edge) {
    		if (checkAsyclicEdges(edges.get(edge), visited)) {
    			return true;
    		} else {
    			visited[edges.get(edge)] = false;
    		}
    	}
    	
    	return false;
    }
    
    @Override
    public boolean isAcyclic() {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	
    	for(int vertex = 0; vertex < this.adjacencyList.size(); ++vertex) {
    		if (checkAsyclicEdges(vertex, visited)) {
    			return false;
    		} else {
    			visited = new boolean[this.adjacencyList.size()];
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
    			checkAsyclicEdges(vertex, v2);
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

}
