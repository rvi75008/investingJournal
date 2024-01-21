import * as express from 'express';
import { IncomingMessage } from "http";
import { JournalEntry } from './types/investingJournal';



const app = express();
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});

app.get('/journal', async (req: IncomingMessage, res: express.Response) => {
  const entries: JournalEntry[] = [
    {
      title: 'Téléperformance',
      start: Date.now(),
      end: undefined,
      body: 'Sous-évaluée',
      metadata: {author: 'Rapha', created_at: Date.now()},
    },
  ];

  res.status(200).send(entries);
});
