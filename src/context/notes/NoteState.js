import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props)=>{
    //this is just for a example for understanding
    // const s1 = { 
    //     "name": "Harry",
    //     "class": "5b"
    // }
    // const [state, setState] = useState(s1);

    // const update = ()=>{
    //     setTimeout(() => {
    //         setState({
    //             "name": "Larry",
    //             "class": "10b"
    //         })
    //     }, 1000);
    // }
    const host = "http://localhost:5000" 
    const notesInitial = []

    const [notes,setNotes] = useState(notesInitial)

    // Get all notes
    const  getNotes = async () =>{
        //TODO:API call

        const response = await fetch(`${host}/api/notes/fetchallnotes`,{
            method:'GET',
            headers:{
                'Content-Type' : 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json =  await response.json();
        console.log(json);
        setNotes(json);
    }

    // Add Note 
    const addNote = async (title, description, tag) => {
        // TODO: API Call
        // API Call 
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token'),
            'Accept':'application/json'
          },
          body: JSON.stringify({title, description, tag})
        })

        const note = await response.json();
        setNotes(notes.concat(note))
        // const note = {
        //   "_id": "61322f119553781a8ca8d0e08",
        //   "user": "6131dc5e3e4037cd4734a0664",
        //   "title": title,
        //   "description": description,
        //   "tag": tag,
        //   "date": "2021-09-03T14:20:09.668Z",
        //   "__v": 0
        // };
    
      }
    // delete Note 
    const deleteNote = async (id) => {
        // TODO: API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type' : 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });

        const json = await response.json();
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }
    // Edit Note
    const upDateNote = async (id,title,description,tag) =>{
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type' : 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body:JSON.stringify({title,description,tag}) 
        });
        const jsoneResponse = await response.json();
        console.log(jsoneResponse);

        let newNotes = JSON.parse(JSON.stringify(notes));

        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;       
            }     
        }
        setNotes(newNotes); 
    }
    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,upDateNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;