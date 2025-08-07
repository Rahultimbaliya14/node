const mongoose = require("mongoose");
const imageremover = require("@imgly/background-removal-node");



exports.removeBackground = async (req, res) => {
    try {
        const image_src = req.body.image;
        if (!image_src) {
            return res.status(400).json({
                success: false,
                message: 'Image is required in the request body'
            });
        }

        const blob = await imageremover.removeBackground(image_src);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const base64Image = buffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;

        res.json({
            success: true,
            data: dataUrl
        });
    } catch (error) {
        console.error('Background removal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing background from image'
        });
    }
}


