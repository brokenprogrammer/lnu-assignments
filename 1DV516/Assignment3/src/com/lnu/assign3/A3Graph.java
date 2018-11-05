package com.lnu.assign3;

import java.util.List;

public interface A3Graph {
	
	public void addVertex(int vertex);
	public void addEdge(int sourceVertex,  int targetVertex);
	
	
	public boolean isConnected();
	public boolean isAcyclic();	
	
	public List<List<Integer>> connectedComponents();
	
	default public boolean hasEulerPath() {
	    System.out.println("Not implemented");
	    return false;
	}
	
	default public List<Integer> eulerPath(){
	    System.out.println("Not implemented");
	    return null;
	}
	
}
