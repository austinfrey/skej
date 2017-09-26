![OpenFaaS](https://img.shields.io/badge/openfaas-v0.6.5-blue.svg)

## skej

#### a simple event schedular for OpenFaaS

Skej allows you to declaratively schedule events for OpenFaaS functions.

#### How To

###### Prerequisites
Redis should be running on port 6379. This is easy to do with docker
```
docker run -d -p 6379:6379 redis
```

###### Install
```
$ npm install skej
```

###### Import skej

```
const skej = require('skej')
```

###### Write the schedule
Declare your schedule as a JSON object.

There are two types of scheduled functions `single` and `pipe`.
One off and recurring functions would fall under `single` and can be
scheduled like so.
```
const schedule = {
	single: [
		{
			name: 'func_nodeinfo',
			data: null,
			json: false,
			initialRun: 5,
			onFinished: x => console.log(x.body)
		},
		{
			name: 'func_echoit',
			data: 'hello world',
			json: false,
			initialRun: 2,
			recurring: 10,
			onFinished: x => console.log(x.body)
		},
	],
}
```
Notice that the `func_echoit` function has an addition property,
`recurring`. If the function should run more than once, at a regular
interval, set the recurring flag to the appropriate duration in seconds.
`skej` will handle the rest.

Adding a chain of functions requires grouping functions as `pipe`
functions. Give the 'pipeline' a name, include and initial data that
should be passed to the first function, and list the function names under
`pipeline`
```
  ...
	pipe: [
		{
			name: 'test',
			data: '',
			json: false,
			initialRun: 8,
			pipeline: [
				'func_nodeinfo',
				'func_wordcount'
			],
			onFinished: x => console.log(x.body)
		}
	]
}

// wrap schedule in the skej() function
skej(schedule)
```
See the `example.js` file for the completed description.

###### Launching
```
node index.js
```

###### Additional
Give it a try and please submit issues as you have them.

