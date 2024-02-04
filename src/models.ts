import { PrismaClient } from '@prisma/client';
import { Context } from './context';

const prisma = new PrismaClient()



  export type JournalEntry = {
    id: number;
    title: string;
    date: Date;
    body: string;
  }

  class EntryNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'EntryNotFoundError';
      this.message = message;
    }
  }


export class JournalDataAccess {

  constructor() { }

  async addEntry(entry: JournalEntry, ctx: Context): Promise<void> {
    await ctx.prisma.journalEntry.create(
    { data: entry}
  );
  }

  async getEntries(ctx: Context): Promise<JournalEntry[]> {
    return await ctx.prisma.journalEntry.findMany()
  }
  async getEntryById(id: number, ctx: Context): Promise<JournalEntry | null> {
    return await ctx.prisma.journalEntry.findUnique({where: {id: id}}
    );
  }

  async updateEntry(entryId: number, ctx: Context, updatedEntry: JournalEntry): Promise<void> {
    try {
      const existingEntry = await ctx.prisma.journalEntry.findUnique({
        where: { id: entryId },
      });

      if (!existingEntry) {
        throw new EntryNotFoundError(`Entry with id ${entryId} not found`);
      }

      await ctx.prisma.journalEntry.update({
        where: { id: entryId },
        data: updatedEntry,
      });
    } catch (error) {
        console.error("Error updating entry:", error);
      throw error;
    }
  }

  async deleteEntry(id: number, ctx: Context): Promise<JournalEntry> {
    const deletedEntry = await ctx.prisma.journalEntry.delete({where: {id: id}});
    if (!deletedEntry) {
      throw new EntryNotFoundError(`Entry with id ${id} not found`);
    }
    else{
      return deletedEntry
    }
  }
}
