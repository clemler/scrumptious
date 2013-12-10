*scrum*ptious
===========

## Overview
*scrum*ptious is a Node.js/Express application which supports projects that follow the Scrum process. The ultimate goal is to develop an open source tool that suports the following:

* Administer users that can login, enter stories, be accept stories etc.
* Define *Projects*. Each project will have its own backlog and sprints.
* Within a project, support entering stories
* Define sprints within a project, and assign stories to the sprint
* Track progress of the sprint
* Define epics, and associate stories with an epic
* Track sprint velocity, and individual velocity to guide capapcity planning for sprints

The plan is to build out the functinality over time - much like a real scrum project. The file backlog.md will track the planned stories until scrumptious itself can be used to track its own development.

## Design Notes

### MongoDB Document Collections

#### team members
Users that can access the stories, and accept tasks

#### Projects
Each project will contain its associated stories and sprints, as well as metrics like team velocity.

```javascript
{ 
    name: "Project name (<= 80 characters)",
    description: "Project description (<= 1024 characters)",
    stories: [
        {title, description, status, points, owner}
    ],
    closedStories: [
    ],
    sprints: [
    ]
}
```

#### Stories
Each story captures a single user facing feature. It is envisioned that a story will have the following lifecycle:

* Story is entered into the system, with initial status of `To Do`.
* The story is assigned to a sprint, and assigned an owner.
* When work on the story begins, it should be changed to the `In Progress` state.
* When work is complete, the story enters `In Review`. During this time code reviews, UI reviews etc. will take place.
* When all work is finished, the story is marked `Done`.
* The story is marked `Accepted` when the customer has seen the functionality and approved of the functionality.

Each story is modeled as follows:

```javascript
{
title: "Title of the story (<= 80 chars)",
description: "Detailed description of the story (<= 1024 chars)",
status: "[Todo, In Progress, In Review, Done, Accepted]",
points: 0, //"Whole number between 0 and 89"
owner: "Name of user that accepted the story",
sprint: "reference to the sprint the story is assigned to, or null"
}
```

#### Sprints
A collection of stories and a duration (start, ends, capacity etc)


