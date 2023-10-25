const express = require("express");
const Notes = require("../models/Notes");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');

// ROUTE 1:  fetch allnotes using: GET  "/api/notes/fetchallnotes"   Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

// ROUTE 2:  Add notes using: POST  "/api/notes/addnotes"   Login required

router.post('/addnotes', fetchuser, [
    body('title', 'Enter min 3 Characters').isLength({ min: 3 }),
    body('description', 'Enter min 5 characters').isLength({ min: 5 })
], async (req, res) => {


    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;

        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


// ROUTE 3:  update the existing notes using: PUT  "/api/notes/updatenote"   Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const newnote = {};
        if (title) { newnote.title = title }
        if (description) { newnote.description = description }
        if (tag) { newnote.tag = tag }

        // Find the note to be updated and update it

        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
        res.json({ note });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})

// ROUTE 4:  delete the existing notes using: DELETE  "/api/notes/deletenote"   Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it

        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been Deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})



module.exports = router