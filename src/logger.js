export class Logger {
	_tags = {
		fail: '[FAIL] ',
		warn: '[WARN] ',
		info: '[INFO] ',
		debg: '[DEBG] '
	}

	get name() {
		return this._name;
	}

	get timestamp() {
		return this._timestamp;
	}

	constructor(name, timestamp = false) {
		this._name = name;
		this._timestamp = timestamp;
	}

	print(msg = '') {
		timestamp = '';
		if (this.timestamp) {
			this.timestamp = '[' + new Date(Date.now()).toISOString() + '] ';
		}

		name = '[' + this.name + '] ';

		console.log(timestamp + name + msg);
	}

	fail(msg = '') {
		print(this._tags.fail + msg);
	}
	warn(msg = '') {
		print(this._tags.warn + msg);
	}
	info(msg = '') {
		print(this._tags.info + msg);
	}
	debg(msg = '') {
		print(this._tags.debg + msg);
	}
}
