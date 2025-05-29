const Style = require('../models/Style');
const { createStyleDto, updateStyleDto } = require('../dto/styleDto');

// Create Style
exports.createStyle = async (req, res) => {
  try {
    const { error } = createStyleDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const style = new Style(req.body);
    await style.save();
    res.status(201).json({ message: 'Style created successfully', style });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Styles (paginated)
exports.getAllStyles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    let query = {};
    if (search) {
      query.styleName = { $regex: search, $options: 'i' };
    }
    const total = await Style.countDocuments(query);
    const styles = await Style.find(query).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);
    res.json({
      totalCount: total,
      styles,
      currentPage: page,
      totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Style by ID
exports.getStyleById = async (req, res) => {
  try {
    const style = await Style.findById(req.query.id);
    if (!style) return res.status(404).json({ message: 'Style not found' });
    res.json(style);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Style
exports.updateStyle = async (req, res) => {
  try {
    const { error } = updateStyleDto.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const style = await Style.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!style) return res.status(404).json({ message: 'Style not found' });
    res.json({ message: 'Style updated successfully', style });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Style
exports.deleteStyle = async (req, res) => {
  try {
    const style = await Style.findByIdAndDelete(req.query.id);
    if (!style) return res.status(404).json({ message: 'Style not found' });
    res.json({ message: 'Style deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 