const Testimonial = require('../models/Testimonial');

// Get all testimonials with pagination and search by name
exports.getAllTestimonials = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const totalCount = await Testimonial.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      testimonials,
      totalCount,
      totalPages,
      currentPage: page,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Add a new testimonial
exports.addTestimonial = async (req, res) => {
  try {
    const { name, designation, company, rating, message } = req.body;
    const testimonial = new Testimonial({ name, designation, company, rating, message });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add testimonial' });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, designation, company, rating, message } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, designation, company, rating, message },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.status(200).json(testimonial);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update testimonial' });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.query;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete testimonial' });
  }
}; 