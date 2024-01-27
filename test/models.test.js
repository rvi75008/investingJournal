
const models = require('../src/models');
const context = require('../src/context');


beforeEach(() => {
  mockCtx = context.createMockContext();
})

describe('JournalDataAccess', () => {
  let jDA;
  const testEntry = {
    title: "foo", date: new Date().toISOString(), body: "bar"
  };


  beforeEach(() => {
    jDA = new models.JournalDataAccess();
  });

  test.only('should add an entry to the entries array', async () => {
    mockCtx.prisma.journalEntry.create.mockResolvedValue(undefined);
    await expect(jDA.addEntry(
      testEntry,
      mockCtx
    )).resolves.toEqual(undefined)
  });

  test.only('should return all entries', async () => {
    mockCtx.prisma.journalEntry.findMany.mockResolvedValue([testEntry]);
    await expect(jDA.getEntries(
      mockCtx)).resolves.toHaveLength(1);
  })

  test.only('should return one entry', async () => {
    mockCtx.prisma.journalEntry.findUnique.mockResolvedValue(testEntry);
    await expect(jDA.getEntryById(1, mockCtx)).resolves.toMatchObject(testEntry);
  })

  test('should throw when deleting unexisting entry', async () => {
    await expect(async () => {
      await jDA.deleteEntry(13);
  }).rejects.toThrowError(models.EntryNotFoundError);
  })

  test('should remove an existing entry', async () => {
    jDA.entries.push(testEntry);
    let entry2 = { id: 2};
    jDA.entries.push(entry2);
    await jDA.deleteEntry(1);
    expect(jDA.entries).toHaveLength(1);
    expect(jDA.entries.find((entry) => entry.id === testEntry.id)).toBeUndefined();
  })

  test('should update existing entry', async() => {
    jDA.entries.push(testEntry);
    editedEntry = {id: 1, title: 'bar', body: 'foo', date: Date.now(), body: "bar", metadata: { "author": "Doe" } };
    await jDA.updateEntry(1, editedEntry);
    expect(jDA.entries[0].title) === 'bar';
  })

  test('should throw if updating an unexisting entry', async() => {
    editedEntry = {id: 2, title: 'bar', body: 'foo', date: Date.now(), body: "bar", metadata: { "author": "Doe" } };
    await expect(async () => {
      await jDA.updateEntry(1, editedEntry);
    }).rejects.toThrowError(models.EntryNotFoundError);
  })
});
