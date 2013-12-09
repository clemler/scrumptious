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
    name: <project_name>,
    description: <project description>,
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
stories / epics - backlog of items. Could be issues, stories, or an epic ( which contains nested stories)

#### Sprints
A collection of stories and a duration (start, ends, capacity etc)


