import * as express from 'express';
import { JournalEntry } from './models'
import { JournalDataAccess } from './models';

const app = express();
const journalDataAccess = new JournalDataAccess();

app.post('/entries', async (req, res) => {
  const entry: JournalEntry = req.body;
  await journalDataAccess.addEntry(entry);
  res.status(201).send('Entry created successfully');
});

app.get('/entries', async (req, res) => {
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

  // Check if entry exists
  const matchingEntry = await journalDataAccess.getEntryById(entryId);
  if (!matchingEntry) {
    res.status(404).send(`Entry with ID ${entryId} not found`);
    return;
  }

  // Update the entry in the data store
  matchingEntry.updateEntry(updatedEntry);
  await journalDataAccess.saveEntries();

  // Send confirmation message
  res.send('Entry updated successfully');
});

app.listen(3000, () => {
  console.log('Investing journal API started on port 3000');
});