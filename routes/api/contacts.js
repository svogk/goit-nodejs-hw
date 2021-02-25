const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const validate = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", validate.addContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      await Contacts.removeContact(req.params.contactId);
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId", validate.updateContact, async (req, res, next) => {
  try {
    if (!req.body.name && !req.body.email && !req.body.phone) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing fields",
      });
    }
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      await Contacts.updateContact(req.params.contactId, req.body);
      const updateContact = await Contacts.getContactById(req.params.contactId);
      return res.json({
        status: "success",
        code: 200,
        data: {
          updateContact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
