export type Metadata = {
  author: string;
  created_at: number;
}


export type JournalEntry = {
    title: string;
    body: string;
    start: number;
    end?: number;
    metadata: Metadata;
  }
