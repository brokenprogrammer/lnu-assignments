# Software Architecture
Software Architecture is a concept that has been around for about 30 years. 
The background of it is that systems grew too big for a smaller group of people to develop. Which meant that
more people had to be thrown at the project and a threshhold was hit where the teams became too large and had to be
divided into smaller teams that work independently.

## Lecture 1 - Introduction
During development we will face design decisions such as which sorting algorithm to use, what signature of methods to use etc.
Those decisions doesn't need to have a big impact on the whole system, they are very local design decisions. But if we would want to divide
work up among people in a group we would have to agree on things as a group that we all depend upon. Before we branch out we should agree on things
that we depend upon. 

Examples could be: What protocol stack for communication that we would use, that would affect not only one team but many teams. If we would
decide for a way to authenticate users, that would also affect a large part of the system. Those decisions are more strategical decisions.
Because when the teams should merge their work it wouldn't work without those strategical decisions.

When we talk about requirements and decisions we think about functionality and quality. Theese two things blend. Quality is also functionality and quality
cannot be achieved without some functionality. Thus we will need to be able to communicate and document those decisions and thus we will need sufficient tooling
to be able to discuss and reason about those complex matters.

### Architecture - Decomposition
If we have a complex problem we try to divide it up to smaller problems and then address the subproblems. This is done untill
we reach a problem that we can deal with.
When it comes to functionality, an example in programming language we have things such as classes, functions, methods as tools to
divide problems into subproblems which we can combine to solve a larger problem.

But if we think about a problem like Google docs, class is not a suitable abstraction for a system of that size. We need something else, something with
a higher level of abstraction to deal with all the system wide decisions which is the **Architecture Level**.

So to decompose our systems we need to:
1. Finding the right sub systems. Finding the solutions to those subsystems.
2. Putting them together.

But if we are not carefull with our decisions we will end up in situations where pieces wont fit in step two.

### System Integrity
"The quality of being honest and fair", "The state of being complete or whole".
We want to strive for system integrity. It doesn't matter what quality we have in the different subsystems if the project as a whole doesn't work together.
Example if the system as a whole is not secure it doesn't matter if one subsystem is very secure.

We can not achieve this bottom up. We cannot have people work on 10 different parts and then put it together with the expectation to work. But if we 
make decisions beforehand it is more likely for them to be able to work together.

How is this achieved?
* Perform required trade offs during decomposition to make sure the system satisfies its goals.
* Define the architectural mechanisms that cross-cut the system and manage the systems characteristics, internal as well as external.

So software architecture is all about finding the right decomposition.
* How is the system divided into subsystems?
* Do we have all the parts?
* Will the parts fit together?

We will focus on the system concerns:
* Functionality
* System charasteristics and qualities.
* System quality trade-offs.

This class will explains some engineerics practices and principles of how to achieve and do this.

### Architecture Challenges - Resolve
What is important?
* Developement is not a "one guy show"
* Multiple concerns, multiple views.
* Organization of multi-faceted models
* All stakeholders must align their views
* Shared vision, shared goal
* Constrain design spaces

How is this achieved?
* Specification language, a way to express your architecture and your decisions.
* Elements and configurations
* Decision making support - a "process"

As a software architect its important to describe how the system will deal with different concerns.
Different stakeholders will have different concerns and we will have to communicate how we the concerns will be dealt with.

Different views can be applied depending on stakeholders, for example our concern is functionality and our stakeholder is a top level manager and the
propper view would be the UML use case model. If we would have the same concern but a different stakeholder who is a designer, here the view would still include 
use cases but also for example sequence diagrams. 

### An example - Study of an application that allows users to share documents.
You can start at this very abstract level and think about, what is the most important parts here?
Whats typically most important is:
* Requirements
* Concerns

In this example there would be some functional requirements such as, the system should be able to be able to share files. If that
requirement is not met noone would use the system.
There is also some quality requirements such as performance, security and reliability.

So even if we can share files then that doesnt mean that someone would use it because if its not secure or performant then noone would want to
share files if it took several minutes to upload or downloads.

For this specific system we have a team of developers:
* Peter - Front end
* Mary - Back end
* Paul - Manager, talks to customers


    Paul would like Peter and Mary to work independently on the Client and Server sides without too much daily coordination.

Some decisions have to happen before they can go and work independently. Those decisions are the architectural decisions.

First we need to agree upon which functionalities should be on the client side and which should be on the server side. (Functional Allocation)
If this is not discussed we might end up with a server and client that has overlapping functionality.

We also need to agree upon how to implement or achieve various qualities such as for example security.
In this case security has two parts, the client side needs to be secure and the server side needs to be secure and the communication in between.
This is something that cannot be managed independently and there has to be a system wide agreement on how to do this.

In this case following the ISO 42010 model.
Our concern here is allocation of functionality and our developers would be the stakeholders. They are both developers so the stakeholders are the same and they share a common concern which allows us to have the same view.

According to the ISO 42010:

    * Stakeholders of a system have concerns with respect to the system-of-interest considered in relation to its environment. (If you don't have a concern with the respect of the system you are not a stakeholder.)

    * Concerns arise throughout the life cycle from system needs and requirements, from design choices and from implementation and operating considerations. (Concerns can arise during deployment, after a system has been put into production. Its not something that we do upfront but something that has to be taken care of during the entire lifetime of a system.)

    * A concern could be manifest in many forms, such as in relation to one or more stakeholder needs, goals, expectations, responsibilities, requirements, design constraints, assumptions, dependencies, quality attributes, architecture decisions, risks or other issues pertaining to the system

We deal with this in views, according to the ISO 42010:

    * Architectural description is organized into one or more **constituents** called (architectural) **views**.

    * Each view **addresses** one or more of the **concerns** of the system stakeholders. A viewis a partial expression of a system’s architecture with respect to a particular __viewpoint__. 

    * A view may consist of one or more __architectural models__. Each such architectural model is developed using the methods established by its associated architectural viewpoint. An architectural model may participate in more than one view.

One view can address one or more concerns. It consists of models and the models can be more or less everything from a formal model such as a formal performance model down to a very informal drawing of boxes and lines drawn with pen and paper.

According to the standard there is a lot of different conerns. There is impossible to learn and enumerate all the different concerns. It spans from business goals down to functionality down to resource utilization.

Example of concerns:

    functionality, feasibility, usage, system purposes, system features, system properties, known limitations, structure, behavior, performance, resource utilization, reliability, security, information assurance, complexity, evolvability, openness, concurrency, autonomy, cost, schedule, quality of service, flexibility, agility, modifiability, modularity, control, inter-process communication, deadlock, state change, subsystem integration, data accessibility, privacy, compliance to regulation, assurance, business goals and strategies, customer experience, maintainability, affordability and disposability

In bigger projects you need a team of architects since everyone cannot be an expert of everything. 

#### Where to start? First level of decomposition
So going back to the example how would we decompose this system?

* Identify key subsystems
* Allocate responsibilities - start with core functionality

* Describe interfaces
    * Provides
    * Requires

* View
    * Simple boxes and lines
    * UML component diagrams

The first level of decomposition you first identify key subsystems and allocate responsibilities by starting with the core
functionality in the system.
You also need to know what subsystem communicates with which other subsystems. They do that by providing services to others or requiring services to others.
This is something you can easily sketch on a whiteboard or use some fancy UML notation. 

Sketch of the system that should be able to share the files:
TODO: LADDA UPP BILD HÄR

Decomposition of functionality:
1. Identify subsystems and responsibilities
2. Identify subsystem interfaces

Decompositions of quality:
1. Identify architectural mechanisms
2. Allocate responsibilities to subsystems and interfaces

Depending on what structure you chose in you decomposition you make some concerns more challenging, you amplify some concerns but the goal is to balance the concerns.
TODO: Ladda upp bild här

### Decision making - Architectural Reasoning
When we have more than one concern, reasoning about the trade-offs becomes important because if we cannot find the right balance between the concerns
we won't have happy customers or happy stakeholders. 

#### Quality - Architectural Mechanisms
So architectural mechanisms are cross cutting the system. Like the security example in the previous image. Which makes it much more challenging because cross cutting
means that we are putting integrity at risk.

A way to achieve quality in your system is to add functionality. In the architecture world that is called "Tactics". 
For example Availability which is about the probability that the system is available for the users at any given time. What can we do to guarantee availability?

For example in a single server client architecture you are making it easier when it comes to security but more challenging when it comes to reliability which is a threat to availability and scalability which is also a threat to availability. 
So we could for example introduce a load balancer. When it comes to failiure you could resort to recover from faults. Here you're not an expert so you would resort to the tactics which would explain how to go about recovering from faults.

### Software Architecture
* What
    * The infrastructure of an application
    * Functional allocation
    * Promotes quality, structuring principles and patterns
* Why
    * Reasining about system properties
    * Early design decisions, cross-cutting
* How
    * Processes
    * Documentation standards
* Who
    * Architect
    * Stakeholders

Many of the things we talk about on the architecture level is also important on the implementation level, for example design patterns, responsibilities for classes, 
functions etc.
But its also valid one level up at the organizational level, here we talk about enterprise architecture. No matter what level we are working on
we still have similar problems, similar principles and similar solutions.

## Lecture 2 - Architecture Documentation
