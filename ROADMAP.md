# Juntbox roadmap

This file is a place to jot down ideas on what features to build into juntbox and how to architect it.

## Feature wishlist

- Sysadmin can toggle a newAccountMode setting between open and invitation.
  When open, a newcomer can create their own account with email verification.
  When invitation, people can only sign up after receiving an email invitation
  issued by a sysadmin.
- A user can create an organization at a paid subscription level via Stripe.
- A user can invite another user by email address to be a member on their
  organization. The invitee can create an account if they haven't already.
- A user can manage multiple organizations, both owned and shared.
- A user can transfer ownership of an organization to a team member, as long
  as the other team member accepts it.

## What is a junt?

The word comes from Brent Nelson, who would say stuff like "I need to get this
junt done".

The logo is kind of a square with a small triangle in it. It's light green. It
also kind of looks like a chat box. I might change the logo. Back in the day,
I used an emoji representing junt that was a truck carrying several differently
sized rectangles.

In this app, a junt doesn't have to be completely tangible. It's meant to be
a stand-in for whatever product actually gets displayed in the real app based
off of the juntbox project. For example, if we were to build a dropbox clone,
a junt would be replaced with a file, which means we'd want a folder
organization system built around junts. If we were to build a budgeting app,
perhaps a junt would be replaced by a transaction. If we were to build
interview software, perhaps a junt would be replaced by an interview. If we
were to build an online store, a junt could be replaced by a sale item, which
would have attributes such as a price, picture, title, description, and
perhaps reviews. Of course, an online store would also have a shopping cart,
placed orders, and several other complex objects all working together.

A junt needs to be relatively simple and barebones in its structure,
but it also needs to showcase some features common in many apps. What are
common things we do with interviews, transactions, and files in a file system?
One thing is we might share certain levels of access with different team
members. They would have names/titles, a way to edit them, and be displayed in
paginated lists. We want to be able to bulk create, bulk edit, and bulk delete
junts.

So is a junt just some record in a database table with a few generic columns
of data? Should a junt be able to do something, like run a background task?
Should a junt be a more complex object that involves multiple database tables?

I feel like it should be fairly simple but also have a bit of personality,
and almost feel like it could be a real product. Something fun to play around
with in a demo. Maybe something along the theme of a junt being a task to
complete.

Alright. I've decided that a junt will somewhat resemble a task on a task
board, similar to apps like Trello, Jira, Asana, and Shortcut. I don't think
I'll create separate boards, though. I'll just use labels, since those are
more generic and could be applied to lots of products. Here is what makes
up a junt:

- id
- createdAt
- updatedAt
- assignee (maybe)
- state (refining, implementing, reviewing, done, rejected, postponed)
- title
- images (maybe, or maybe just one image)
- description
- comments

## UI library

The app will come prepackaged with a basic UI library. This includes baseline
css, primitive and semantic colors, links, buttons, dropdowns, modals,
breakpoints, icons, toggles, checkboxes, tables, and more. The library will be
showcased in storybook as a page in the app.
