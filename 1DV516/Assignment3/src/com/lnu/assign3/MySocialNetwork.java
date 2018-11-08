package com.lnu.assign3;

import java.util.ArrayList;
import java.util.List;

/**
 * NOTE: This class is dependant on vertices starting from 0 and not being added in different order
 * for example: addVertex(0); addVertex(5); will break the ordering within the graph structure.
 * 
 * @author Oskar Mendel
 * @author Jesper Bergström
 */
public class MySocialNetwork extends MyUndirectedGraph implements A3SocialNetwork {

	public MySocialNetwork() {
		super();
	}
	
	private void getVerticesAtDistance(int vertex, int[] vertexDistance, boolean[] visited, int distance) {
		if (visited[vertex] == false) {
			visited[vertex] = true;
			vertexDistance[vertex] = distance;
			MyArrayList<Integer> edges = this.adjacencyList.get(vertex);
			for (int edge = 0; edge < edges.size(); ++edge) {
				getVerticesAtDistance(edges.get(edge), vertexDistance, visited, distance+1);
			}
		} else {
			if (vertexDistance[vertex] > distance) {
				vertexDistance[vertex] = distance;
				MyArrayList<Integer> edges = this.adjacencyList.get(vertex);
				for (int edge = 0; edge < edges.size(); ++edge) {
					getVerticesAtDistance(edges.get(edge), vertexDistance, visited, distance+1);
				}
			}
		}
	}
	
    @Override
    public int numberOfPeopleAtFriendshipDistance(int vertexIndex, int distance) {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	int vertexDistance[] = new int[this.adjacencyList.size()];
    	
    	for (int i = 0; i < this.adjacencyList.size(); i++) {
    		vertexDistance[i] = Integer.MAX_VALUE;
    	}    	
    	vertexDistance[vertexIndex] = 0;
    	
    	getVerticesAtDistance(vertexIndex, vertexDistance, visited, 0);
    	
    	int found = 0;
    	for (int i : vertexDistance) {
    		if (i == distance) {
    			found++;
    		}
    	}
    	
    	return found;
    }

    @Override
    public int furthestDistanceInFriendshipRelationships(int vertexIndex) {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	int vertexDistance[] = new int[this.adjacencyList.size()];
    	
    	for (int i = 0; i < this.adjacencyList.size(); i++) {
    		vertexDistance[i] = Integer.MAX_VALUE;
    	}    	
    	vertexDistance[vertexIndex] = 0;
    	
    	getVerticesAtDistance(vertexIndex, vertexDistance, visited, 0);
    	
    	int found = 0;
    	for (int i : vertexDistance) {
    		if (i > found) {
    			found = i;
    		}
    	}
    	
    	return found;
    }

    @Override
    public List<Integer> possibleFriends(int vertexIndex) {
    	boolean visited[] = new boolean[this.adjacencyList.size()];
    	int vertexDistance[] = new int[this.adjacencyList.size()];
    	MyArrayList<Integer> vertexEdges = this.adjacencyList.get(vertexIndex);
    	
    	for (int i = 0; i < this.adjacencyList.size(); i++) {
    		vertexDistance[i] = Integer.MAX_VALUE;
    	}    	
    	vertexDistance[vertexIndex] = 0;
    	
    	getVerticesAtDistance(vertexIndex, vertexDistance, visited, 0);
    	
    	MyArrayList<Integer> list = new MyArrayList<Integer>();    	
    	for (int i = 0; i < vertexDistance.length; i++) {
    		if (vertexDistance[i] == 2) {
    			MyArrayList<Integer> edges = this.adjacencyList.get(i);
    	    	if (edges.size() >= 3) {
    	    		
    	    		int commonFriends = 0;
    	    		for (int friend = 0; friend < edges.size(); friend++) {
    	    			if (vertexEdges.indexOf(edges.get(friend)) != -1) {
    	    				commonFriends++;
    	    			}
    	    		}
    	    		
    	    		if (commonFriends >= 3) {
    	    			list.add(i);
    	    		}
    	    	}
    		}
    	}
    	
    	// Converts to ArrayList to meet the return parameter.
    	ArrayList<Integer> result = new ArrayList<Integer>();
    	for (int i = 0; i < list.size(); i++) {
    		result.add(list.get(i));
    	}
    	
		return result;
    }

}
