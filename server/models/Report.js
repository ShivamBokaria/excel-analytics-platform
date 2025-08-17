import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    dataset: { type: mongoose.Schema.Types.ObjectId, ref: "Dataset", required: true },
    name: { type: String, required: true },
    chartType: { type: String, enum: ["bar", "line", "pie", "scatter", "3d-bar", "3d-scatter", "3d-surface"], required: true },
    dimension: { type: String, enum: ["2D", "3D"], default: "2D" },
    xCol: { type: String, required: true },
    yCol: { type: String, required: true },
    zCol: { type: String },
    options: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;


