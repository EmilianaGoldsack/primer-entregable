import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }]
});

export default mongoose.model('Cart', cartSchema);
