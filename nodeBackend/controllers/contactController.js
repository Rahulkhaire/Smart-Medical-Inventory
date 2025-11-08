const Contact = require('../models/Contact');

// ✅ Create a new contact message
const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const newMessage = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      msg: 'Message sent successfully!',
      contact: newMessage,
    });
  } catch (err) {
    console.error('❌ Error saving contact message:', err);
    res.status(500).json({ msg: 'Server error while submitting form.' });
  }
};

// ✅ Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching contact messages:', err);
    res.status(500).json({ msg: 'Server error fetching messages.' });
  }
};

// ✅ Get single message by ID
const getMessageById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Message not found.' });
    res.json(contact);
  } catch (err) {
    console.error('❌ Error fetching message:', err);
    res.status(500).json({ msg: 'Server error fetching message.' });
  }
};

// ✅ Delete message
const deleteMessage = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Message not found.' });
    res.json({ msg: 'Message deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting message:', err);
    res.status(500).json({ msg: 'Server error deleting message.' });
  }
};

module.exports = {
  createContactMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
};
