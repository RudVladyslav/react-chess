import React, {useState} from 'react';
import {auth} from "./firebase";
import styled from "styled-components";

const Form = styled.form`
  margin-top: 30px !important;
  max-width: 800px;
  margin: auto;
`

const UserForm = () => {
    const [name, setName] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        localStorage.setItem('userName',name)
        await auth.signInAnonymously()
    }
    return (
        <Form  onSubmit={handleSubmit}>
            <h1>Enter your name to start</h1>
            <br/>
            <div className="field">
                <p className="control">
                    <input type="text"
                           placeholder={"Name"}
                           className={"input"}
                           value={name}
                           onChange={e=>setName(e.target.value)}
                           required/>
                </p>
            </div>
            <div className="field">
                <p className="control">
                    <button className={'button is-success'} type={'submit'}>Start</button>
                </p>
            </div>
        </Form>
    );
}

export default UserForm;