const db = require("./../models");
const Works = db.works;
const cloudinary = require("../cloudinaryConfig");
exports.findAll = async (req, res) => {
  const works = await Works.findAll({ include: "category" });
  return res.status(200).json(works);
};

exports.create = async (req, res) => {
  const title = req.body.title;
  const categoryId = req.body.category;
  const userId = req.auth.userId;

  try {
    // ✅ Upload de l'image sur Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "works",
    });

    const imageUrl = uploadResult.secure_url;

    // ✅ Création du work avec l'URL Cloudinary
    const work = await Works.create({
      title,
      imageUrl,
      categoryId,
      userId,
    });

    return res.status(201).json(work);
  } catch (err) {
    console.error("Erreur lors de l'upload Cloudinary :", err);
    return res.status(500).json({ error: "Échec de l'upload Cloudinary" });
  }
};

exports.delete = async (req, res) => {
  try {
    await Works.destroy({ where: { id: req.params.id } });
    return res.status(204).json({ message: "Work Deleted Successfully" });
  } catch (e) {
    return res.status(500).json({ error: new Error("Something went wrong") });
  }
};
