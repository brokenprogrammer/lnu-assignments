# om222dq & jb223qe Final Project, Database Theory

## Installation
To install you first have to create a folder within the root directory of the application called "db" where the databases will be stored. Empty folders are not submitted through the github version control and we didn't want to add our own database into the submission so users will have to do that themselves.

Then to setup node you run `npm install` and to run the application you run `npm start`

## Class Diagrams
The type of diagram you want to make has to be specified at the very first line. To specify that you want to make a class diagram, write <class> in the first line.

There are 3 different types of classes you can include in your class diagram: Class, Enum and Interface. To add a class to the diagram, type the name of the type of class followed by a space and a variable name. The variable name will be considered to be the class name and will be displayed at the top of the class.

Example:

Class Car

Enum FuelType

Interface Vehicle

(note: Each command must be separated by a new line)
Add a package to the diagram

Adding a package works similarly to adding a class. You type "Package" followed by a space and a variable name. The name of the package is the name of the variable unless you manually set the text. This is done by typing the variable name followed by .text="your package name". To add classes to the package, type the package name followed by " add " and the variable name of the class you want to add.

Example:

Package package

package.text="vehicle"

package add Car

package add FuelType

Add dependency:

Vehicle-->Car

Add realization:

Vehicle--|>Car

Add inheritance (generalization):

Vehicle-|>Car

Add association:

Vehicle(0..*)-(1)Car

Add direct association:

Vehicle(1)->(1)Car

Add aggregation:

Vehicle(1..*)<>-(1)Car

Add Composition:

Vehicle(1)<#>-(1..*)Car

When clicking the "Draw" button, an algorithm will place the classes in the diagram as well as it can. You will probably want to change the placements on your own. This is simply done by dragging and dropping classes with the cursor. You can also change the appearance of the arrows by clicking them and creating new points. The arrow will then be drawn from point to point and create a path. These points can also be moved by dragging and dropping. To delete a point, simply right click on it.

## DFA / NFA Diagrams
The type of diagram you want to make has to be specified at the very first line. To specify that you want to make a DFA, write <dfa> in the first line and to make a NFA, write <nfa> in the first line.

There are three different objects that can be added to a DFA: start state, normal state and end state. Syntax for start state is ->State, normal state is State, end state is (State).
An object is initialized by typing the name of the object followed by a space and a variable name.
(Variable names can be of any length.)

Example:

->State s1

State s2

(State) s3


(note: Each command must be separated by a new line)
Draw an arrow between two states (or to itself)

The operator for drawing an arrow is [variable]->[variable]: [text].
[text] is any text you want to display next to the arrow.

Example:

->State s1

State s2

(State) s3

s1->s2: a

s1->s3: b

s2->s2: a,c

s2->s3: b


When clicking the "Draw" button, an algorithm will place the different objects in the diagram as well as it can. The algorithm will place all objects that are connected next to eachother and the distance between all objects will be big enough so no objects will overlap but you might want to change the placements on your own. This is simply done by dragging and dropping objects with the cursor.

You can bend arrows by clicking them to create new points that a curve will be drawn though. Move the points by clicking and dragging the red circle visible when hovering over the arrow. Arrows that go from and to the same object and looping arrows do not have this functionality. To remove the point and make the arrow staight again, simply right click on the red circle.
