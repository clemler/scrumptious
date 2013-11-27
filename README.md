*scrum*ptious
===========

## Overview
*scrum*ptious is a Node.js/Express application which supports projects that follow the Scrum process. The ultimate goal is to develop an open source tool that suports the following:

* Administer users that can login, enter stories, be assigned stories etc.
* Define *Projects*. Each project will have its own backlog and sprints.
* Within a project, support entering stories
* Define sprints within a project, and assign stories to the sprint
* Track progress of the sprint
* Define epics, and associate stories with an epic

The plan is to build out the functinality over time - much like a real scrum project. The file backlog.md will track the planned stories until scrumptious itself can be used to track its own development.

## Design Notes

Collections

* team members / users - people that can access the stories, and accept tasks
* stories / epics - backlog of items. Could be issues, stories, or an epic ( which contains nested stories)
* sprint - a collection of stories and a duration (start, ends, capacity etc)