import { Request, Response } from "express";
import { TagModel } from "../models/Tag";
import { NoteModel } from "../models/Note";

export const tagController = {
  browse(req: Request, res: Response): void {
    const userId = req.session!.userId;
    const tags = TagModel.findByUser(userId);
    const tagsWithCount = tags.map((tag) => ({
      ...tag,
      noteCount: NoteModel.countByTag(tag.id, userId),
    }));
    res.json({ tags: tagsWithCount });
  },

  read(req: Request, res: Response): void {
    const tag = TagModel.findByIdAndUser(req.params.id as string, req.session!.userId);
    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }
    res.json({ tag });
  },

  add(req: Request, res: Response): void {
    const { name, bgColor, textColor } = req.body;
    if (!name) {
      res.status(400).json({ error: "Tag name is required" });
      return;
    }
    if (TagModel.findByNameAndUser(name, req.session!.userId)) {
      res.status(409).json({ error: "A tag with that name already exists" });
      return;
    }
    const tag = TagModel.create(
      name,
      bgColor || "#F3F4F6",
      textColor || "#4B5563",
      req.session!.userId
    );
    res.status(201).json({ tag });
  },

  edit(req: Request, res: Response): void {
    const tag = TagModel.update(req.params.id as string, req.session!.userId, req.body);
    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }
    res.json({ tag });
  },

  destroy(req: Request, res: Response): void {
    const deleted = TagModel.delete(req.params.id as string, req.session!.userId);
    if (!deleted) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }
    res.json({ message: "Tag deleted" });
  },
};
