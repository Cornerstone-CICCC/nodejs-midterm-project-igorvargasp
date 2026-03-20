import { v4 as uuidv4 } from "uuid";

export interface ITag {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  userId: string;
}

const tags: ITag[] = [];

export const TagModel = {
  findByUser(userId: string): ITag[] {
    return tags.filter((t) => t.userId === userId);
  },

  findById(id: string): ITag | undefined {
    return tags.find((t) => t.id === id);
  },

  findByIdAndUser(id: string, userId: string): ITag | undefined {
    return tags.find((t) => t.id === id && t.userId === userId);
  },

  findByNameAndUser(name: string, userId: string): ITag | undefined {
    return tags.find((t) => t.name.toLowerCase() === name.toLowerCase() && t.userId === userId);
  },

  create(name: string, bgColor: string, textColor: string, userId: string): ITag {
    const tag: ITag = { id: uuidv4(), name, bgColor, textColor, userId };
    tags.push(tag);
    return tag;
  },

  update(id: string, userId: string, data: Partial<Pick<ITag, "name" | "bgColor" | "textColor">>): ITag | undefined {
    const tag = tags.find((t) => t.id === id && t.userId === userId);
    if (!tag) return undefined;
    if (data.name !== undefined) tag.name = data.name;
    if (data.bgColor !== undefined) tag.bgColor = data.bgColor;
    if (data.textColor !== undefined) tag.textColor = data.textColor;
    return tag;
  },

  delete(id: string, userId: string): boolean {
    const idx = tags.findIndex((t) => t.id === id && t.userId === userId);
    if (idx === -1) return false;
    tags.splice(idx, 1);
    return true;
  },
};
