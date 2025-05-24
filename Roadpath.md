# Road-Path

a file full of ideas, generel direction and goal for the project

## bare bones concept

It’s an app where you press one button, talk, and it figures out what you said and puts it in the right place — like a todo list, calendar, diary, or stat-tracker.
You don’t have to open different apps or type anything. Just speak and it handles it.

## Ideas

### intergration with different apps

it's super important that when building OneTap we remember that people already got other apps, that they already use daily. So they will wont want to switch these app over. This means that OneTap should be as good as possible to integrate with these apps

Definitly:

- Calender
  - Google calender
  - Outlook

Possibly:

- Task manegers
  - Notion
  - Trello
- Maps - for example to quickly getting directions to a saved spot
  - Google maps
- Fitness - for stat tracking
  - Strava?

## Visual identity

OneTap should be modern, slick and simple yet still have a unique bit that makes it stand out from the rest. Not just look like a v0 build app

Due to it being rather simple, and little user interactions, the interactions we do have should feel as snappy, smooth and satsifying as possible. To support this we should try to utilize the reanmiated library to create smooth and satisfying animations.

## Pages

### HomeScreen

What do we want to have for the homescreen?
It should give the user a overview over the most important things, especcielly in the near future, like things that need to be done today, or events happening today

### Diray

#### Rich text editor

For the diary we would optimally implement a rich text editor
Some possibles solutions for this would be:

- https://10play.github.io/10tap-editor/docs/intro.html#usage
- https://www.npmjs.com/package/react-native-pell-rich-editor
- DOM Components - aka. embed a html rich text editor using Web View

### Calender
