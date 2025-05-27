# Road-Path

A file full of ideas, general direction and goals for the project

## Bare bones concept

It's an app where you press one button, talk, and it figures out what you said and puts it in the right place — like a todo list, calendar, diary, or stat-tracker.
You don't have to open different apps or type anything. Just speak and it handles it.

## Ideas

### Shared todos

Create a project on OneTap and share it with a friend, coworker or family member. Work together to complete the todos.
For example the grocery list with the family, or tasks for a project with your coworkers.

Here it would again be super handy to integrate with things like Notion

#### Notifications

It could even be nice if the other people get notified when a person completes a task.

### General ideology behind social features

Generally we want social features to be designed in a way that gets more people to know about OneTap, but NOT in a way that _forces_ them to use OneTap. They should basically still be able to interact with everyone that uses OneTap without having it themselves.

Examples:

- Task sharing - should (if possible) integrate with other apps, like Notion etc. so they don't have to switch as well
- Spot sharing - when sharing a spot, it should just share a URL that shows the spot / collection of spots, so people without OneTap can access it nearly just as easily

Why? We believe that it's always good if more people know about OneTap, but getting people to actually use the app should be due to the value in the app itself - not forced due to others using it.

### Integration with different apps

It's super important that when building OneTap we remember that people already have other apps that they already use daily. So they won't want to switch these apps over. This means that OneTap should be as good as possible to integrate with these apps

Definitely:

- Calendar
  - Google Calendar
  - Outlook

Possibly:

- Task managers
  - Notion
  - Trello
- Maps - for example to quickly get directions to a saved spot
  - Google Maps
- Fitness - for stat tracking
  - Strava?

### Categories / Collections

As i continue to develop on OneTap, it becomes more and more obvious that a big part of it will end up having to be some sort of "Collections"

These should divide the users small bits and pieces of information into clean, simple to retrieve categories

Examples:

- Spots
- Ideas
- Timeevents
  - Appointments
  - Sport
  - Due dates
  - Birthdates
- Quotes
- Recomendations
- People
- Morning tasks - aka. things to remmeber for the day

_Not to be confused with differend collections of todos - also a important feature_

### Fun, funky streak notifications

Track any repeating task, and if we notice a streak make AI generate a fun streak message, like: "🎉 Trash Master Extraordinaire! 🗑️ You've taken out the trash 10 weeks in a row! Keep up the stinky work! 💪"

Just to add some fun into it all (:

## Visual identity

OneTap should be modern, slick and simple yet still have a unique bit that makes it stand out from the rest. Not just look like a v0 build app

Due to it being rather simple, with few user interactions, the interactions we do have should feel as snappy, smooth and satisfying as possible. To support this we should try to utilize the reanimated library to create smooth and satisfying animations.

## Pages

### HomeScreen

What do we want to have for the homescreen?
It should give the user an overview of the most important things, especially in the near future, like things that need to be done today, or events happening today

### Diary

#### Rich text editor

For the diary we would optimally implement a rich text editor
Some possible solutions for this would be:

- https://10play.github.io/10tap-editor/docs/intro.html#usage - current solution
- https://www.npmjs.com/package/react-native-pell-rich-editor
- DOM Components - aka. embed an HTML rich text editor using Web View

### Calendar

## Test Cases:

- [ ] "ooo, i really like this spot"
- [ ] "This would be really nice spot to have a picnic"
- [ ] "Tims birthday is tommorow"
- [ ] "This cake is better eaten with a spoon - quote of the day"
- [ ] "This super sweet guy i met just recommended this resturant to me"
- [ ] "John said that the new Star Wars movie should be super good"
- [ ] "Wow, Ant Man 3 looks like a sick movie"
- [ ] "I gotta call Natalie 9 in the morning Tomorrow"
- [ ] "Okay, i got this pretty sick idea, what if we build..."
- [ ] "Really gotta remember to bring my charger tommorow"
- [ ] "I got volleyball at 8 pm on thursday"
- [ ] "My geo report has to be finished till on sunday"
- [ ] "We are out of eggs again"
- [ ] "Remind me to take out the trash on Thursday night."
- [ ] "Went hiking with Maya and the weather was perfect."
- [ ] "App idea: something that tracks how often I interrupt people."
- [ ] "I need to cancel my Netflex subscription before the 5th May"
- [ ] "I should try to catch up with jake every week or two"
- [ ] "I gotta walk the dog twice every second day"

### Results

"I should try to catch up with jake every week or two"

```ts
title: 'Catch up wit jake';
type: 'todo';
startDate: date(today);
due: null;
remindAt: null;
repeat: null;
softRepeat: {
  weeks: 2;
} // Will try to make you do it every 14 days, but can be done before
emoji: '👋';
```

"I need to cancel my Netflex subscription before the 5th May"

```ts
title: "Cancel Netflex"
type: 'todo';
startDate: null;
due: Date(5th May);
remindAt: Date(5th may); // This should only remind if it hasnt been ticked off
repeat: null;
softRepeat: null;
emoji: '📺';
```

"We are out of eggs again"

```ts
title: 'Eggs';
type: 'todo';
startDate: null;
due: null;
remindAt: null;
repeat: null;
softRepeat: null;
category: 'Groceries';
emoji: '🥚';
```

"Remind me to take out the trash on Thursday night."

```ts
title: 'Take thrash out';
type: 'todo';
startDate: null;
due: Date('Thursday 6:00 pm');
remindAt: null; // Soft remind should happen anyway like half an hour before
repeat: {
  weeks: 1;
} // Weekly repeat
softRepeat: null;
category: 'Groceries';
emoji: '🗑️';
```

"I gotta walk the dog twice every second day"

```ts
title: 'Walk the dog';
type: 'todo';
startDate: Date(Today); // it starts today, i cant just walk the dog the day before (important for repeat)
due: Date(Today); // Make sure it doesnt just continue until next time. I have to do it in twice in 1 day
remindAt: null;
repeat: {
  days: 2;
}
amount: 2;
softRepeat: null;
emoji: '🐕';
```

"I want to try to solve 3 mathquizzes in under 7 days"

soft but with reminder

```ts
title: 'Mathquizzes';
type: 'todo';
startDate: null; // Not needded
due: null; // Just a personal challenge so doenst need a hard due.
softDue: Date(Today + 7 days)
remindAt: Date(Today + 7 days, morning);
amount: 3;
softRepeat: null;
emoji: '🐕';
```

Possibly also with message: "Okay, you have till monday evening!"
