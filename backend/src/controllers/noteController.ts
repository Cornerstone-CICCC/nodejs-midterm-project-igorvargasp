import { Request, Response } from "express";
import { NoteModel } from "../models/Note";

export const noteController = {
  browse(req: Request, res: Response): void {
    const userId = req.session!.userId;
    const notes = NoteModel.findByUser(userId);

    // Optional filters
    const { tagId, favorite } = req.query;
    let filtered = notes;
    if (tagId && typeof tagId === "string") {
      filtered = filtered.filter((n) => n.tagIds.includes(tagId));
    }
    if (favorite === "true") {
      filtered = filtered.filter((n) => n.isFavorite);
    }

    res.json({ notes: filtered });
  },

  read(req: Request, res: Response): void {
    const note = NoteModel.findByIdAndUser(req.params.id as string, req.session!.userId);
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json({ note });
  },

  add(req: Request, res: Response): void {
    const { title, content, tagIds } = req.body;
    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }
    const note = NoteModel.create(
      title,
      content || "",
      tagIds || [],
      req.session!.userId
    );
    res.status(201).json({ note });
  },

  edit(req: Request, res: Response): void {
    const note = NoteModel.update(req.params.id as string, req.session!.userId, req.body);
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json({ note });
  },

  destroy(req: Request, res: Response): void {
    const deleted = NoteModel.delete(req.params.id as string, req.session!.userId);
    if (!deleted) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json({ message: "Note deleted" });
  },
};
