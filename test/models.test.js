
const models = require('../src/models');


describe('JournalDataAccess', () => {
  let jDA;
  const testEntry = { id: 1, title: "foo", date: Date.now(), body: "bar", metadata: { "author": "Doe" } };


  beforeEach(() => {
    jDA = new models.JournalDataAccess();
  });

  test('should add an entry to the entries array', async () => {
    await jDA.addEntry(
        testEntry
      );
    expect(jDA.entries).toContain(testEntry);
  });

  test('should return all entries', async () => {
    jDA.entries.push(testEntry);
    const allEntries = await jDA.getEntries();
    expect(allEntries).toHaveLength(1);
    expect(allEntries).toContain(testEntry);
  })

  test('should return one entry', async () => {
    jDA.entries.push(testEntry);
    const retrievedEntry = await jDA.getEntryById(1);
    expect(retrievedEntry.id).toEqual(1);
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
