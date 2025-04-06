import mongoose from "mongoose";

const EncryptedHashSchema = new mongoose.Schema({
    encryptedHash: { type: String, required: true }, // The encrypted IPFS hash
    timestamp: { type: Date, default: Date.now } // Automatically stores the time of insertion
});

export default mongoose.models.EncryptedHash || mongoose.model("EncryptedHash", EncryptedHashSchema);
