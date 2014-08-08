# GiLA

GiLA is a visualization tool which analyzes the labels used in GitHub projects. The tool provides three simple yet powerful visualizations.

Labels are a simple and effective way to add additional information (e.g., metadata) to project issues. A lable can give any user an immediate clue about what sort of topic the issue is about, what development task the issue is related to, or what priority the issue has. 

GitHub provides issue-tracking capabilities, which allows developers to manage issues regarding the development of the software. As a way to categorize or group issues, they can be labeled, thus facilitating their management. Curiously enough, developers use issue labels in a pretty particular way. While GitHub provides a set of default labels (i.e., bug, duplicate, enhacenment, invalid, questions and wontfix) it turns out that they fall short in most cases. 

We believe that custom labels actually become a sort of *vocabulary* of the project and  making it explicit can help developers to understand how it is managed.

### Label usage visualization

**Motivation:**   Having an overview of the most relevant labels defined and their distribution among issues is important for different reasons. First, it provides some insights about the relevance of specific topics in the project community. Second, since an issue in GitHub can be marked with one or more labels, it allows identifying relations between topics.

**Target:** Visualize the labels used, their frequency and how they relate to each other.

**Visualization:**  A graph-based visualization showing the relations between labels and the impact of each tag in the project. Nodes represent labels and edges represent a relation between labels . We say that labels *L1* and *L2* are related if there is at least one issue marked with *L1* and *L2*. The strength of a relation between *L1* and *L2* is measured in terms of the number of issues marked with both labels and is visualized by the thickness of the edge connecting them. Finally, the size of each node indicates the number of issues marked with that label. 

### User involvement visualization

**Motivation:**   Visualizing the people involved in the issues marked with a given label can quickly unveil active administrators and users for each topic. In particular, it can help identifying the administrators that most frequently take decisions (e.g., accepting or rejecting issues, etc.) with regards to a given topic. Furthermore, it allows discovering those users collaborating actively on a specific label , thus pointing out possible knowledgeable developers on a given topic.

**Target:** Discover the most active users and contributors per label: who opens them? who closes them?

**Visualization:**   A graph-like visualization that highlights the contribution of users for a given label. Users are represented as boxes while labels are represented as circles. The box size is proportional to the number of times such user has contributed to the label. In particular, the box height and width are proportional to the number of created and closed issues, respectively. Additionally, box colors range from gray to red indicating the number of comments made by the users (the more red it is the more comments the user has made). Edges connect users with labels, the thicker they are the more number of issues the users have contributed.

### Label timeline visualization

**Motivation:**   Analyzing how issues in each tag evolve over time allows assessing the main priorities and interests in a project (e.g., studying which tags are usually solved quickly)

**Target:** Understand the typical evolution of issues under each label: when are they discussed?, solved?, etc.

**Visualization:**  A tree-like visualization that shows the average time for some important events in the evolution of the issues for a given label. The tree has a main path which includes two events: (1) the average time for the first comment from an external user and (2) the average  time for the first comment from a collaborator of the project. This path then forks into thre subpaths to represent (1) the percentage of issues closed (and the average time to be closed), (2) the percentage of issues merged (and the average time to be merged) and (3) the percentage of issues still open (and their average age).

## Dataset

GiLA uses [GHTorrent](http://ghtorrent.org) a scalable, queriable, offline mirror of data offered through the Github REST API. 

## Using the tool

The tool is available at [http://atlanmod.github.io/gila](http://atlanmod.github.io/gila).

You can also access **directly to the results webpage** by calling the URL:

`http://atlanmod.github.io/gila/project.html?projectName=USER/REPO`

where

* *USER* is the GitHub login of the user owing the repository
* *REPO* is the name of the repository

or if you know the **identifier of your project**, you can even call:

`http://atlanmod.github.io/gila/project.html?projectId=ID`

where

* *ID* is the GitHub identifier of your project

## What is comming next?

We are exploring other ways to mine the information behind the labels of your project. We would like to study other appealing visualizations to help developers to manage projects.

If you have any recommendation, just contact us.

## Who is behind this project?

* [Belen Rolandi](http://github.com/belenrolandi/ "Belen Rolandi")
* [Javier Canovas](http://github.com/jlcanovas/ "Javier Canovas")
* [Valerio Cosentino](http://github.com/valeriocos/ "Valerio Cosentino")
* [Jordi Cabot](http://github.com/jcabot/ "Jordi Cabot")

Javier and Jordi work in [Atlanmod](http://www.emn.fr/z-info/atlanmod), a research team of Inria.