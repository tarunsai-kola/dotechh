
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    popularity: { type: Number, default: 0 },
    tagline: { type: String }, // e.g. "JavaScript library for building user interfaces"
    category: { type: String }, // e.g. "Frontend", "Backend", "Database"
    createdAt: { type: Date, default: Date.now }
});

// Index for search
SkillSchema.index({ name: 'text', slug: 'text' });
SkillSchema.index({ popularity: -1 });

module.exports = mongoose.model('Skill', SkillSchema);
