import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique budget per category and month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

export const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
