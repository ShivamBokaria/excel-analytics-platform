import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    originalName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    columns: { type: [String], default: [] },
    rowCount: { type: Number, default: 0 },
    // Store a capped sample of rows for quick previews. Full storage can be added later.
    dataSample: { type: [Object], default: [] },
  },
  { timestamps: true }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;


