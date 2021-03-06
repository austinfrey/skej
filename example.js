'use strict';

const skej = require('./index');

skej({

	single: [
		{
			name: 'func_nodeinfo',
			initialRun: 5,
			onFinished: x => console.log(x.body)
		},
		{
			name: 'func_echoit',
			data: 'hello world',
			initialRun: 2,
			recurring: 1,
			onFinished: x => console.log(x.body)
		},
		{
			name: 'yolo',
			json: true,
			initialRun: 1,
			recurring: 10,
			onFinished: x => console.log(x.body)
		}
	],

	pipe: [
		{
			name: 'test',
			data: '',
			initialRun: 8,
			pipeline: [
				'func_nodeinfo',
				'func_wordcount'
			],
			onFinished: x => console.log(x.body)
		},
	]

});

