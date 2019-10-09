# GiLA

GiLA is a visualization tool aiming to analyze the labels used in GitHub projects.

Labels are a simple yet effective way to add additional information (e.g., metadata) to project issues. A label can give any user an immediate clue about what sort of topic the issue is about, what development task the issue is related to, or what priority the issue has. Each development team uses labels in their own particular way, many times going beyond the set of default labels GitHub provides. 

Therefore, we believe analyzing how labels are used in a project gives useful information about the *vocabulary* of the project and how it is organized/managed. 

GiLA includes three different kinds of label visualizations:

### Label usage visualization

**Motivation:**   Having an overview of the most relevant labels defined and their distribution among issues is important for different reasons. First, it provides some insights about the relevance of specific topics in the project community. Second, since an issue in GitHub can be marked with one or more labels, it allows identifying relations between topics.

**Target:** Visualize the labels used, their frequency and how they relate to each other.

**Visualization:**  A graph-based visualization showing the relations between labels and the impact of each tag in the project. Nodes represent labels and edges represent a relation between labels . We say that labels *L1* and *L2* are related if there is at least one issue marked with *L1* and *L2*. The strength of a relation between *L1* and *L2* is measured in terms of the number of issues marked with both labels and is visualized by the thickness of the edge connecting them. Finally, the size of each node indicates the number of issues marked with that label. 

### User involvement visualization

**Motivation:**   Visualizing the people involved in the issues marked with a given label can quickly unveil active administrators and users for each topic. In particular, it can help identifying the administrators that most frequently take decisions (e.g., accepting or rejecting issues, etc.) with regards to a given topic. Furthermore, it allows discovering those users collaborating actively on a specific label , thus pointing out possible knowledgeable developers on a given topic.

**Target:** Discover the most active users and contributors per label: who opens them? who closes them?

**Visualization:**   A graph-like visualization that highlights the contribution of users for a given label. Users are represented as boxes while labels are represented as circles. The box size is proportional to the number of times such user has contributed to the label. In particular, the box width and height are proportional to the number of created and closed issues, respectively. Additionally, box colors allows you to distinguish between admins (i.e., orange boxes) and users (i.e., purple boxes). Edges connect users with labels, the thicker they are the more number of comments the users have contributed in such a label.

### Label timeline visualization

**Motivation:**   Analyzing how issues in each tag evolve over time allows assessing the main priorities and interests in a project (e.g., studying which tags are usually solved quickly)

**Target:** Understand the typical evolution of issues under each label: when are they discussed?, solved?, etc.

**Visualization:**  A tree-like visualization that shows the average time for some important events in the evolution of the issues for a given label. The tree has a main path which includes two events: (1) the average time for the first comment and (2) the average time for the first comment from a collaborator of the project. This path then forks into three subpaths to represent (1) the percentage of issues closed (and the average time to be closed), (2) the percentage of issues merged (and the average time to be merged) and (3) the percentage of issues still open (and their average age).

## Dataset

GiLA uses [GHTorrent](http://ghtorrent.org) a scalable, queriable, offline mirror of data offered through the Github REST API. 

## Using the tool

The tool development has been dsicontinued and is no longer available online. We recommend you to download the code and deploy the tool in your our premises. 

## Who is behind this project?

* [Belen Rolandi](http://github.com/belenrolandi/ "Belen Rolandi")
* [Javier Canovas](http://github.com/jlcanovas/ "Javier Canovas")
* [Valerio Cosentino](http://github.com/valeriocos/ "Valerio Cosentino")
* [Jordi Cabot](http://github.com/jcabot/ "Jordi Cabot")
