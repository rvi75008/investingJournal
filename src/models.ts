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


export class JournalDataAccess {
  private  entries: JournalEntry[] = [];

  constructor() {}

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

  async updateEntry(entry: JournalEntry): Promise<void> {
    for (var existingEntry of this.entries) {
      if (existingEntry.id === entry.id) {
        existingEntry = entry;
        break;
      }
    }
    await this.saveEntries();
  }

  async deleteEntry(id: number): Promise<void> {
    this.entries = this.entries.filter(entry => entry.id !== id);
    await this.saveEntries();
  }

  private async saveEntries(): Promise<void> {
    // Implement saving mechanism (e.g., file storage, database)
  }
}
