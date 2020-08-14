const imageUpload = require('../middleware/image-upload');

const CustomWebsite = require('../models/CustomWebsite');
const HttpError = require('../models/http-error');

exports.get = async (req, res, next) => {
    const { field } = req.params;

    let custom;
    try {
        custom = await CustomWebsite.findOne({ where: { field: field } });
        if (!custom) {
            const error = new HttpError(
                'Could not find any field',
                400,
            );
            return next(error);
        }

        return res
            .status(200)
            .json(custom);
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Error to find field - server error',
            500,
        );
        return next(error);
    }
};

exports.edit = async (req, res, next) => {
    const { field, text, image, obs } = req.body;
    let custom;
    let image_url = '';
    try {
        if (image) {
            image_url = await imageUpload(image, 'field-' + field)
        }
        console.log("image_url", image_url)
        custom = await CustomWebsite.findOne({ where: { field: field } });
        if (!custom) {
            custom = await CustomWebsite.create({ field, text, image_url, obs });
            return res
                .status(200)
                .json({ message: 'Field created!', custom: custom });
        }
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Error to find field - server error',
            500,
        );
        return next(error);
    }

    try {
        custom = await custom.update({
            text: text,
            image_url,
            obs: obs
        });
        return res
            .status(200)
            .json({ message: 'Field edited!', custom: custom });
    } catch (err) {
        console.error(err);
        const error = new HttpError('Unable to save the note', 500);
        return next(error);
    }
};
