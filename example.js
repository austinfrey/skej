'use strict';

const skej = require('./index');

skej({

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
		{
			name: 'yolo',
			data: 'hello world',
			json: true,
			initialRun: 1,
			recurring: 1,
			onFinished: x => console.log(x.body)
		}
	],

	pipe: [
		{
			name: 'test',
			data: '',
			json: false,
			initialRun: 8,
			recurring: 60,
			pipeline: [
				'func_nodeinfo',
				'func_wordcount'
			],
			onFinished: x => console.log(x.body)
		}
	]

});

