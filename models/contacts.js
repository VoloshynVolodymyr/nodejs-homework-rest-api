const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const result = JSON.parse(data);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

async function getItemById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

async function getContactById(contactId) {
  try {
    const result = getItemById(contactId);
    return result || null;
  } catch (error) {
    console.log(error.message);
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const id = nanoid();
    const newContact = { id, name, email, phone };
    const contacts = await listContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (id, { name, email, phone }) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    contacts[index] = { id, name, email, phone };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
