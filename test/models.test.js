const models = require('../src/models');
const context = require('../src/context');

beforeEach(() => {
  mockCtx = context.createMockContext();
});

describe('JournalDataAccess', () => {
  let jDA;
  const testEntry = {
    title: 'foo',
    date: new Date().toISOString(),
    body: 'bar',
  };

  beforeEach(() => {
    jDA = new models.JournalDataAccess();
  });

  test('should add an entry to the entries array', async () => {
    mockCtx.prisma.journalEntry.create.mockResolvedValue(undefined);
    await expect(jDA.addEntry(testEntry, mockCtx)).resolves.toEqual(undefined);
  });

  test('should return all entries', async () => {
    mockCtx.prisma.journalEntry.findMany.mockResolvedValue([testEntry]);
    await expect(jDA.getEntries(mockCtx)).resolves.toHaveLength(1);
  });

  test('should return one entry', async () => {
    mockCtx.prisma.journalEntry.findUnique.mockResolvedValue(testEntry);
    await expect(jDA.getEntryById(1, mockCtx)).resolves.toMatchObject(
      testEntry,
    );
  });

  test('should throw when deleting unexisting entry', async () => {
    mockCtx.prisma.journalEntry.delete.mockResolvedValue(undefined);
    try {
      await jDA.deleteEntry(13, mockCtx);
    } catch (error) {
      expect(error.message).toMatch('Entry with id 13 not found');
    }
  });

  test('should remove an existing entry', async () => {
    mockCtx.prisma.journalEntry.delete.mockResolvedValue(testEntry);
    await expect(jDA.deleteEntry(1, mockCtx)).resolves.toMatchObject(testEntry);
  });

  test('should update existing entry', async () => {
    mockCtx.prisma.journalEntry.findUnique.mockResolvedValue(testEntry);
    mockCtx.prisma.journalEntry.update.mockResolvedValue();

    editedEntry = {
      id: 1,
      title: 'bar',
      body: 'foo',
      date: Date.now(),
      body: 'bar',
      metadata: { author: 'Doe' },
    };
    await jDA.updateEntry(1, mockCtx, editedEntry);
  });

  test('should throw if updating unknown entry', async () => {
    mockCtx.prisma.journalEntry.findUnique.mockResolvedValue(undefined);
    editedEntry = {
      id: 2,
      title: 'bar',
      body: 'foo',
      date: Date.now(),
      body: 'bar',
      metadata: { author: 'Doe' },
    };
    try {
      await jDA.updateEntry(2, mockCtx, editedEntry);
    } catch (error) {
      expect(error.message).toMatch('Entry with id 2 not found');
    }
  });
});
