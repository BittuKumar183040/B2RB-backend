import express from "express";
import { z } from "zod/v4";
import db from "../db/knex/knex.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const templates = [
  { id: "minimal", name: "Minimal", description: "A clean, ATS-friendly single-column layout.", accent: "slate", category: "Classic" },
  { id: "modern", name: "Modern", description: "A polished contemporary layout with clear section hierarchy.", accent: "blue", category: "Professional" },
  { id: "sharp", name: "Sharp", description: "Strong typography and confident section headings.", accent: "violet", category: "Professional" },
  { id: "compact", name: "Compact", description: "Space-efficient formatting for detailed career histories.", accent: "amber", category: "Compact" },
];
const contentSchema = z.object({
  header: z.record(z.string(), z.unknown()),
  experiences: z.array(z.unknown()),
  projects: z.array(z.unknown()),
  skills: z.array(z.unknown()),
  education: z.array(z.unknown()),
  certifications: z.array(z.unknown()),
}).strict();
const resumeSchema = z.object({
  title: z.string().trim().min(1).max(160),
  template: z.string().trim().min(1).max(80),
  content: contentSchema,
}).strict();

router.get("/templates", (_req, res) => res.json({ templates }));
router.use(verifyToken);
router.get("/", async (req, res, next) => {
  try {
    const resumes = await db("resumes").select("id", "title", "template", "created_at", "updated_at").where({ user_email: req.user.email }).orderBy("updated_at", "desc");
    res.json({ resumes });
  }
  catch (error) { next(error); }
});
router.post("/", async (req, res, next) => {
  try {
    const parsed = resumeSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid resume data", errors: parsed.error.issues });
    if (!templates.some(item => item.id === parsed.data.template))
      return res.status(400).json({ message: "Unknown resume template" });
    const [resume] = await db("resumes").insert({ ...parsed.data, user_email: req.user.email }).returning(["id", "title", "template", "content", "created_at", "updated_at"]);
    return res.status(201).json({ resume });
  }
  catch (error) { return next(error); }
});
router.get("/:id", async (req, res, next) => {
  try {
    const resume = await db("resumes").where({ id: req.params.id, user_email: req.user.email }).first(["id", "title", "template", "content", "created_at", "updated_at"]);
    if (!resume)
      return res.status(404).json({ message: "Resume not found" });
    return res.json({ resume });
  }
  catch (error) { return next(error); }
});
router.put("/:id", async (req, res, next) => {
  try {
    const parsed = resumeSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid resume data", errors: parsed.error.issues });
    if (!templates.some(item => item.id === parsed.data.template))
      return res.status(400).json({ message: "Unknown resume template" });
    const [resume] = await db("resumes").where({ id: req.params.id, user_email: req.user.email }).update({ ...parsed.data, updated_at: db.raw("EXTRACT(EPOCH FROM NOW())::INTEGER") }).returning(["id", "title", "template", "content", "created_at", "updated_at"]);
    if (!resume)
      return res.status(404).json({ message: "Resume not found" });
    return res.json({ resume });
  }
  catch (error) { return next(error); }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await db("resumes").where({ id: req.params.id, user_email: req.user.email }).del();
    if (!deleted)
      return res.status(404).json({ message: "Resume not found" });
    return res.status(204).end();
  }
  catch (error) { return next(error); }
});

export default router;
