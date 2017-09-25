'use strict';

const FaaS = require('openfaas');
const Redular = require('redular');

const skej = schedule => {
	const {oneOff, recurring, pipe} = schedule;

	const options = {
		autoconfig: true,
		redis: {
			port: 6379,
			host: 'localhost'
		}
	};

	const faas = FaaS('http://localhost:8080');
	const redular = new Redular(options);

	const scheduleOneOff = oneOffList => {
		const date = new Date();

		for (var func in oneOffList) {
			redular.defineHandler(oneOffList[func].key, () => {
				faas.invoke(oneOffList[func].key)
					.then(x => console.log(x.body))
					.catch(err => console.log(err));
			});

			redular.scheduleEvent(
				oneOffList[func].key,
				date.setSeconds(date.getSeconds() + oneOffList[func].initialRun)
			);
		}
	};

	const scheduleRecurring = recurringList => {
		const date = new Date();

		for (var func in recurringList) {
			redular.defineHandler(recurringList[func].key, () => {
				faas.invoke(recurringList[func].key, recurringList[func].data)
					.then(x => console.log(x.body))
					.then(() => {
						date.setSeconds(date.getSeconds() + recurringList[func].recurring);
						redular.scheduleEvent(recurringList[func].key, date);
					})
					.catch(err => console.log(err));
			});

			redular.scheduleEvent(
				recurringList[func].key,
				date.setSeconds(date.getSeconds() + recurringList[func].initialRun)
			);
		}
	};
	scheduleOneOff(oneOff);
	scheduleRecurring(recurring);

	console.log('starting');
};

module.exports = skej;
