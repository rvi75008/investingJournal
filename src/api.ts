
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
  const entries: JournalEntry[] = await journalDataAccess.getEntries();
  res.send(entries);
});

app.get('/entries/:id', async (req, res) => {
  const entryId = parseInt(req.params.id, 10);

  // Check if entry exists
  const matchingEntry = await journalDataAccess.getEntryById(entryId);
  if (!matchingEntry) {
    res.status(404).send(`Entry with ID ${entryId} not found`);
    return;
  }

  // Send JSON response with the matching entry
  res.send(matchingEntry);
});

app.delete('/entries/:id', async (req, res) => {
  const entryId = parseInt(req.params.id, 10);

  // Check if entry exists
  const entry = await journalDataAccess.getEntryById(entryId);
  if (!entry) {
    res.status(404).send(`Entry with ID ${entryId} not found`);
    return;
  }

  // Remove the entry from the data store
  await journalDataAccess.deleteEntry(entryId);

  // Send confirmation message
  res.send('Entry deleted successfully');
});

app.put('/entries/:id', async (req, res) => {
  const entryId = parseInt(req.params.id, 10);
  const updatedEntry: JournalEntry = req.body;



  // Send confirmation message
  res.send('Entry updated successfully');
});

app.listen(3000, () => {
  console.log('Investing journal API started on port 3000');
});
