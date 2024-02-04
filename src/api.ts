
import * as express from 'express';
import { JournalDataAccess, JournalEntry } from './models';
import { entrySchema } from './schemaValidation';
import { Context } from './context'
import { PrismaClient, Prisma } from '@prisma/client'

const app = express();
const journalDataAccess = new JournalDataAccess();
const prisma = new PrismaClient()


app.post('/entries', async (req: express.Request, res: express.Response) => {
  const validatedEntry = entrySchema.parse(req.body);
  if (!validatedEntry) {
    res.status(400).send('Invalid request body');
    return;
  }

  await journalDataAccess.addEntry(validatedEntry, { prisma: prisma });
  res.status(201).send('Entry created successfully');
});

app.get('/entries', async (req: express.Request, res: express.Response) => {
  const entries: JournalEntry[] = await journalDataAccess.getEntries({prisma: prisma});
  res.send(entries);
});

app.get('/entries/:id', async (req: express.Request, res: express.Response) => {
  const entryId = parseInt(req.params.id, 10);

  // Check if entry exists
  const matchingEntry = await journalDataAccess.getEntryById(entryId, {prisma: prisma});
  if (!matchingEntry) {
    res.status(404).send(`Entry with ID ${entryId} not found`);
    return;
  }
  res.send(matchingEntry);
});

app.delete('/entries/:id', async (req: express.Request, res: express.Response) => {
  const entryId = parseInt(req.params.id, 10);

  const entry = await journalDataAccess.getEntryById(entryId, {prisma: prisma});
  if (!entry) {
    res.status(404).send(`Entry with ID ${entryId} not found`);
    return;
  }
  await journalDataAccess.deleteEntry(entryId, {prisma: prisma});
  res.send('Entry deleted successfully');
});

app.put('/entries/:id', async (req: express.Request, res: express.Response) => {
  try {
    const result = await journalDataAccess.updateEntry(
      parseInt(req.params.id, 10),
      { prisma: prisma },
      req.body,
    )
    res.send('Entry updated sccessfully');
  }
  catch(error) {
    res.status(404).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Investing journal API started on port 3000');
});
