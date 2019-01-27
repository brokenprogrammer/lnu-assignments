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
![Image 1][image11]

Decomposition of functionality:
1. Identify subsystems and responsibilities
2. Identify subsystem interfaces

Decompositions of quality:
1. Identify architectural mechanisms
2. Allocate responsibilities to subsystems and interfaces

Depending on what structure you chose in you decomposition you make some concerns more challenging, you amplify some concerns but the goal is to balance the concerns.
![Image 2][image12]

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
Here we will talk about communication and documentation which is trying to support all different activities that may occurr
in a system's lifetime. This may be all the different stages from the new product development untill the decommissioning of the system.

The most important thing to communicate with your architecture documentation is the decisions. The architecture level decisions,
why have we decided to decompose the system in this way, why have we decided to use this authentication mechanism, why did we decide to allocate the
authentication responsibilities to those specific subsystems and why did we decide to use a specific protocol.

### Documentation
In the ISO documentation standard displayed last week and we focused on stakeholders and the systme concerns. We can see in the documentation standard that
the stakeholder has an interest in a system and the association class there is a system concern. Something very important when documenting is WHO you are 
communicating to. Who is the target of the documentation? 

For the stakeholders and the concerns what should we communicate? We should communicate the results of the design decisions.
If the stakeholder is directly involved in development, maintenance etc then it is more important that you document the rationale (Why you came up with the decision)
compared to if you show something to management, they could ask questions why but they are more interested in what.

What is an architectural design decision?
There is no exact rule here, the problem here is that all designs are hierarcical. Subsystems can contain subsystems and so on so it is difficult to say for example 
"at this level of abstraction its no longer architecture". 

We will spend more time to think about the impact of the decisions. Are they global or local? If they are global they are considered architectural decisions.
Architectural design is an intellectual creative process, you as a designer create the system that you envsision, the system that satisfies all the concerns from
your stakeholders.

As engineers we will gather experiences upon us for example we will work on projects that will fail and perhaps something happened during that project
that made you think that relational databases are bad. As engineers this is not what we want, we want to stay objective.. Perhaps for the new problem 
we are trying to solve relational databases are the perfect match.

Example of architectural design decisions:
* Technology, middle-wares, framework, programming languages
* Design decomposition(The decomposition of your system into subsystems)
* Mechanisms that are cross-cutting the subsystems, performance, security, scalability etc.. 

What's important is that we document the decision making not only the decisions themselves.

Some more specific architecture decisions examples but they're not "top-level":
* How are subsystems distributed, how are they deployed, are they deployed on different machines / servers?
* Different technology for different subsystems, example different programming languages for different parts of the system.

### Architecture - Complexity Aspirin
What you see in architecture documentation is primarily two strategies to reduce the complexity. 
The first one is Abstraction, we have structural and behavioral abstraction which is that we reduce the information to not talk about how subsystems are realised but instead
about responsibilities for the subsystems and what they provide to the outside. 

If a subsystems is responsible for maintaining information about customers, we do not care if they use a relational database or some other type of technology to make it work.
We are only interested in an interface that supports us with customer information and not how its stored.

But if we want to have one storage strategy for the entire system then its a decision that we have to make at the top level, because there will be many subsystems that will be affected by
that decision. So we create an abstraction so we can get rid of the "how", then we can encapsulate and hide information which is nice because the less information we have, the less complex 
something is to grasp.

### A decision's impact on a system - Locality
What is the impact of a decision on the system?
* Global - affects the entire or a large part of a system.
* Local - affects a single entity or a small parto f a system.

It can be difficult to define when a local decision becomes global and vice versa. 

Example of global (System wide decisions):
* Implementation technology (Prescribes an architecture structure)
* Decomposition into components
* Component organization (Architecture patterns)
* Principles for quality concerns such as security, authentication, session management, user management

Example of local decisions:
* Data structures
* Method implementations (Algorithms)
* Apply design patterns
* Apply implementation idioms

### Mary's challenge - Master complexity
Mary is the architect and she is responsible for taking the system and coming up with a decomposition that reduces the complexity
so that we can focus on the individual parts.

How does she do that? She can have clients, there can be mobile, other type of clients. There can be a backend with a set of servers or a single server
that provides some logic for the application and ofcourse there must be some connectivity between the clients and the back-end. 

Her first job here is to think of what functionality we should have within the system. The first step is then to connect which subsystem that will be
responsible for certain functionality. At the same time she has to consider all the quality requirements such as performance, usability, security etc.

The architects responsibility is to provide the decomposition where responsibilities are allocated to the subsystems. 

### Views and viewpoints - What to do?
We need to document our architecture, communicate our architecture in different ways.
If we remember our trio from last lecture, Peter, Paul and Mary.
Mary she has to communicate it in someway to Peter and in a different way to Paul.

Who are the stakeholders in that example?
The manager, The architect (Mary) and the programmer. All the three people are stakeholders.

What are the concerns for each of the stakeholders?

Once you know what to communicate and to who you can start thinking about how you should communicate it which in our case as software engineers is models.
Can be anything from a textual description to an UML model to a formal model etc, Anything that communicates something to the stakeholder.

It is important for every stakeholder that they get something that is tailored for their specific concern and their specific knowledge.

#### Peter - The Programmer
What is Peter interested in as a programmer?
He wants to think about how to organize the code, how to use interfaces to interact with components.
He should also be interested in a test view, for testing a system you need to add monitoring, test drivers, mocks etc. That is something that is 
complementary to the core functionality of the system but still something that deserves its own models / view.

#### Paul - The Manager
The manager is interested in the work plan and in work division, economics and quality. 
So what is the view for the manager? Use cases, a component decomposition where all the individual subsystems are identified.
A test view, perhaps not the same level as the programmers but since this stakeholder is interested in quality then we might want to create a specific view for that.

The message here is that not everything is architecture but you have to think about the stakeholders and their concerns when deciding if something should be in the documentation
or not.

#### The users
They can be interested in the functionality view, the hardware requirements. How the system will be installed (Deployment view), how the system would be maintained and / or
evolved.

#### Mary's challenge - Architecture Design
For Mary it is the decomposition but also all the decisions that leads up to all the different Tradeoffs. Her challenge is not to support only one single quality
but to find a balance between all qualities including functionality in the system which is not a straight forward task.
It might be the case that you might need to provide views that addresses more than one concern.

Finding a balance between requirements, example Performance and Cost.
If we're using high-end hardware we might get the performance we are looking for but that comes with a cost. Now if we want to cut down on the costs
we might cut back on our resources and choose lower end hardware but then performance might become an issue.
As an engineer we are looking for the "Good enough" to support both cost and performance, balancing the two.

The goal is always to provide something that is maximizing value for **ALL** stakeholders.

### How do I create a view?

1. Look for your stakeholders
2. Look for their concerns
3. Make a decision on what models to use in the views.

This is nothing that is carved in stone so if you find out that one stakeholder doesn't understand then you need to add something to make up for it.
Then it might be that another stakeholder understands but the goal is to communicate with **ALL** stakeholders.

Example views for system functionality:
* Use case diagram - Stakeholders: Managers
* Class diagram - Stakeholders: Programmers, Managers(Maybe), Architect, Tester
* Deployment diagram - Stakeholders: Architect, Testers

## Lecture 3 - ?

[image11]: https://github.com/brokenprogrammer/lnu-assignments/blob/master/KnowledgeBase/img/lecture11.png
[image12]: https://github.com/brokenprogrammer/lnu-assignments/blob/master/KnowledgeBase/img/lecture12.png