export type Metadata = {
    author: string;
    created_at: number;
  }


  export type JournalEntry = {
    updateEntry(updatedEntry: JournalEntry): unknown;
    id: number;
    title: string;
    date: Date;
    body: string;
    metadata: Record<string, any>;
  }

  class EntryNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'EntryNotFoundError';
      this.message = message;
    }
  }


export class JournalDataAccess {
  entries: JournalEntry[];

  constructor() {
    this.entries = [];
  }

  async addEntry(entry: JournalEntry): Promise<void> {
    this.entries.push(entry);
    await this.saveEntries();
  }

  async getEntries(): Promise<JournalEntry[]> {
    return [...this.entries];
  }

  async getEntryById(id: number): Promise<JournalEntry | undefined> {
    return this.entries.find(entry => entry.id === id);
  }

  async updateEntry(entryId: number, updatedEntry: JournalEntry): Promise<void> {
    const existingEntry = this.entries.find((entry) => entry.id === entryId);
    if (!existingEntry) {
      throw new EntryNotFoundError(`Entry with id ${entryId} not found`);
    }
    else {
      this.deleteEntry(entryId);
      this.addEntry(updatedEntry);
    }
  }

  async deleteEntry(id: number): Promise<void> {
    const existingEntry = this.entries.find((entry) => entry.id === id);
    if (!existingEntry) {
      throw new EntryNotFoundError(`Entry with id ${id} not found`);
    }
    else {
      this.entries = this.entries.filter(entry => entry.id !== id);
    }
  }

  private async saveEntries(): Promise<void> {
    // Implement saving mechanism (e.g., file storage, database)
  }
}
