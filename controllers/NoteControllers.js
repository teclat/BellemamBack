const Note = require('../models/Note');
const User = require('../models/User');
const HttpError = require('../models/http-error');

exports.index = async (req, res, next) => {
	try {
		const notes = await Note.findAll();
		if (!notes) {
			const error = new HttpError('Nenhuma Nota encontrada!', 404);
			return next(error);
		}
		return res.status(200).json(notes);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Erro no servidor.', 500);
		return next(error);
	}
};

exports.notesByUserId = async (req, res, next) => {
	const { user_id } = req.body;

	try {
		const note = await Note.findAll({ where: { user_id: user_id } });
		if (!note) {
			const error = new HttpError(
				'Could not find any note with the given user id',
				422,
			);
			return next(error);
		}
		return res.status(200).json(note);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not verify notes', 500);
		return next(error);
	}
};

exports.notesByEventId = async (req, res, next) => {
	const { event_id } = req.body;

	try {
		const note = await Note.findAll({
			where: { event_id: event_id },
			include: ['user'],
		});
		if (!note) {
			const error = new HttpError(
				'Could not find any note with the given event id',
				422,
			);
			return next(error);
		}
		return res.status(200).json(note);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Could not verify notes', 500);
		return next(error);
	}
};

exports.create = async (req, res, next) => {
	const { user_id, event_id, text } = req.body;

	try {
		const createdNote = await Note.create({
			text,
			user_id: user_id,
			event_id,
		});

		return res.status(200).json(createdNote);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Create note failed', 500);
		return next(error);
	}
};

exports.edit = async (req, res, next) => {
	const { user_id, event_id, text } = req.body;

	let note;
	try {
		note = await Note.findOne({
			where: { user_id: user_id, event_id: event_id },
		});
		if (!note) {
			const error = new HttpError(
				'Could not find any note for the user in this event',
				404,
			);
			return next(error);
		}
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to find any note - server error', 500);
		return next(error);
	}

	try {
		await note.update({
			text: text,
		});
		return res.status(200).json({ message: 'Note edited!', note: note });
	} catch (err) {
		console.error(err);
		const error = new HttpError('Unable to save the note', 500);
		return next(error);
	}
};
