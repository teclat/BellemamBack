const Gallery = require('../models/Gallery');
const HttpError = require('../models/http-error');
const imageUpload = require('../middleware/image-upload');

exports.imagesByEventId = async (req, res, next) => {
    const { event_id } = req.body;

    try {
        const images = await Gallery.findAll({ where: { event_id: event_id } });
        if (!images) {
            const error = new HttpError(
                'Could not find any image with the given event id',
                422,
            );
            return next(error);
        }
        return res.status(200).json(images);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Could not verify images', 500);
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    const { event_id, image } = req.body;

    try {
        const created = await Gallery.create({
            event_id
        });

        let image_url = await imageUpload(image, 'gallery-' + created.id)

        const withImage = await created.update({
            image_url
        });

        return res.status(200).json(withImage);
    } catch (err) {
        console.error(err);
        const error = new HttpError('Create image failed', 500);
        return next(error);
    }
};

exports.remove = async (req, res, next) => {
    const { id, event_id } = req.body;

    let image;
    try {
        image = await Gallery.findOne({
            where: {
                id: id, event_id: event_id
            }
        });
        if (!image) {
            const error = new HttpError(
                'Could not find any image for the id in this event',
                404,
            );
            return next(error);
        }
        await image.destroy();
        return res.status(200).json('Image deleted!');
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Unable to remove image - server error',
            500,
        );
        return next(error);
    }
};
