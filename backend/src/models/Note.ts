import { v4 as uuidv4 } from "uuid";

export interface INote {
  id: string;
  title: string;
  content: string; // markdown content (can include code blocks/snippets)
  tagIds: string[];
  userId: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const notes: INote[] = [];

export const NoteModel = {
  findByUser(userId: string): INote[] {
    return notes
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  findById(id: string): INote | undefined {
    return notes.find((n) => n.id === id);
  },

  findByIdAndUser(id: string, userId: string): INote | undefined {
    return notes.find((n) => n.id === id && n.userId === userId);
  },

  create(title: string, content: string, tagIds: string[], userId: string): INote {
    const now = new Date().toISOString();
    const note: INote = {
      id: uuidv4(),
      title,
      content,
      tagIds,
      userId,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
    return note;
  },

  update(id: string, userId: string, data: Partial<Pick<INote, "title" | "content" | "tagIds" | "isFavorite">>): INote | undefined {
    const note = notes.find((n) => n.id === id && n.userId === userId);
    if (!note) return undefined;
    if (data.title !== undefined) note.title = data.title;
    if (data.content !== undefined) note.content = data.content;
    if (data.tagIds !== undefined) note.tagIds = data.tagIds;
    if (data.isFavorite !== undefined) note.isFavorite = data.isFavorite;
    note.updatedAt = new Date().toISOString();
    return note;
  },

  delete(id: string, userId: string): boolean {
    const idx = notes.findIndex((n) => n.id === id && n.userId === userId);
    if (idx === -1) return false;
    notes.splice(idx, 1);
    return true;
  },

  countByTag(tagId: string, userId: string): number {
    return notes.filter((n) => n.userId === userId && n.tagIds.includes(tagId)).length;
  },
};
