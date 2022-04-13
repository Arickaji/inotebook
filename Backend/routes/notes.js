const express = require("express");
const router = express.Router();
var fetchuser = require("../MiddleWare/fetchUser");
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");

//  router 1: for getting all notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// router 2: add a new Note POST : /api/auth/addNote login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// router 3: update Note put : /api/auth/updateNote login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const {title,description,tag} = req.body;
  try{
    // create a new noe obj
    const newNote = {};
    if(title){newNote.title = title;}
    if(description){newNote.description = description;}
    if(tag){newNote.tag = tag;}
  
    // find the note to be updated and update it 
    let note = await Notes.findById(req.params.id);
    if(!note){
      return res.status(404).send("Not Found");
    }
  
    if(note.user.toString() != req.user.id){
      return res.status(401).send("Not Allowed");
    }
  
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new : true});
    res.json(note);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// router 4: delete Note delete : /api/auth/deleteNote login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  // find the note and delete it
  try{
    let note = await Notes.findById(req.params.id);
    if(!note){
      return res.status(404).send("Not Found");
    }
    // allow deletion only if user owns this note
    if(note.user.toString() != req.user.id){
      return res.status(401).send("Not Allowed");
    }
  
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note has been deleted",note : note});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
