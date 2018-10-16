package com.lnu.assignment2;

/**
 * 
 * @author Oskar Mendel
 * @author Jesper Bergström
 */
public class MyItinerary implements A2Itinerary<A2Direction> {
	
	private A2Direction[] directions;
	private Coordinate[] positions;
	private int width;
	private int height;
	
	public MyItinerary(A2Direction[] directions) {
		this.directions = directions;
		this.positions = new Coordinate[this.directions.length+1];
		this.width = 0;
		this.height = 0;
		
		int x = 0;
		int y = 0;
		
		int minx = 0;
		int maxx = 0;
		int miny = 0;
		int maxy = 0;
		
		this.positions[0] = new Coordinate(x, y); 
		
		for (int i = 0; i < this.directions.length; i++) {
			 switch(this.directions[i]) {
			 case UP:
				 y--;
				 break;
			 case RIGHT:
				 x++;
				 break;
			 case DOWN:
				 y++;
				 break;
			 case LEFT:
				 x--;
				 break;
			 }
			 
			 if (x < minx) {
				 minx = x;
			 }
			 if (x > maxx) {
				 maxx = x;
			 }
			 if (y < miny) {
				 miny = y;
			 }
			 if (y > maxy) {
				 maxy = y;
			 }
			 
			 this.positions[i+1] = new Coordinate(x, y);
		}
		
		this.width = abs(minx) + maxx;
		this.height = abs(miny) + maxy;
	}
	
	private int abs (int x) {
		return (x < 0) ? x *= -1 : x;
	}
	
	@Override
	public A2Direction[] rotateRight() {
		A2Direction[] rotated = new A2Direction[this.directions.length];
		
		for (int i = 0; i < rotated.length; i++) {
			int dir = this.directions[i].ordinal()+1;
			
			if (dir > 3) {
				dir = 0;
			}
			
			rotated[i] = A2Direction.values()[dir];
		}
		
		return rotated;
	}

	@Override
	public int widthOfItinerary() {
		return this.width;
	}

	@Override
	public int heightOfItinerary() {
		return this.height;
	}

	@Override
	public int[] getIntersections() {
		MyHashTable<Coordinate> table = new MyHashTable<Coordinate>(0.5);
		
		int[] intersections = new int[this.positions.length];
		int intersectionCount = 0;
		
		for (int i = 0; i < this.positions.length; i++) {
			if (table.contains(this.positions[i])) {
				intersections[intersectionCount] = i-1;
				intersectionCount++;
			} else {
				table.insert(this.positions[i]);
			}
		}
		
		
		int[] trimmedIntersections = new int[intersectionCount];
		for (int i = 0; i < intersectionCount; i++) {
			trimmedIntersections[i] = intersections[i];
		}
		return trimmedIntersections;
	}

	
	private class Coordinate {
		public int x;
		public int y;
		public Coordinate(int x, int y) {
			this.x = x;
			this.y = y;
		}
		
		@Override
		public int hashCode() {
			return 31 * this.x + this.y;
		}
		
		@Override 
		public boolean equals(Object o) {
			if (o instanceof Coordinate) {
				if (((Coordinate) o).x == this.x && ((Coordinate) o).y == this.y) {
					return true;
				}
			}
			return false;
			
		}
	}
}
