'use strict';

const FaaS = require('openfaas');
const Redular = require('redular');
const BbPromise = require('bluebird')

const skej = schedule => {
	const {single, pipe} = schedule;

	const options = {
		autoconfig: true,
		redis: {
			port: 6379,
			host: 'localhost'
		}
	};

	const {invoke, compose} = FaaS('http://localhost:8080');
	const redular = new Redular(options);

	const invokeFuncs = (list) => {
		return new BbPromise.each(list, func => {
		  const date = new Date()
			var noop

			func.hasOwnProperty('recurring')
				? noop = () => {
						const newDate = new Date()
						newDate.setSeconds(newDate.getSeconds() + func.recurring);
						redular.scheduleEvent(func.name, newDate);
				}
				: noop = () => {}

			redular.defineHandler(func.name, () => {
				invoke(func.name, func.data)
					.then(func.onFinished)
					.then(noop)
					.catch(err => console.log(err));
			});

			redular.scheduleEvent(
				func.name,
				date.setSeconds(date.getSeconds() + func.initialRun)
			);
		})
	}

	const scheduleOneOff = list => {
		invokeFuncs(list)
			.then(() => console.log('scheduled'))
			.catch(err => console.log(err))
	};

	const scheduleRecurring = list => {
		invokeFuncs(list)
	};

	const schedulePipes = list => {
		const date = new Date();

		list.forEach(pipe => {
			redular.defineHandler(pipe.name, () => {
				compose(pipe.data, pipe.pipeline)
					.then(pipe.onFinished)
					.catch(err => console.log(err));
			});

			redular.scheduleEvent(
				pipe.name,
				date.setSeconds(date.getSeconds() + pipe.initialRun)
			);
		});
	};

	scheduleOneOff(single);
	schedulePipes(pipe);

	console.log('starting');
};


module.exports = skej;
