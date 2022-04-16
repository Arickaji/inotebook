import React,{ useContext } from 'react'
import noteContext from '../context/notes/noteContext'
export const About = () => {
    const a = useContext(noteContext)
    return (
        <div>
            This is About {a.state.name} and he is in class {a.state.class}
        </div>
    )
}

export default About
