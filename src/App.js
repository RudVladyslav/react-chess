import React from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import UserForm from "./UserForm";

const App = (props) => {
    const [user, loading, error] = useAuthState(auth)
    if (loading) {
        return <img src='assets/preloader.gif'/>
    }
    if (error) {
        return <img src='assets/error.gif' />
    }
    if (!user){
        return <UserForm/>
    }
    return (
        <div>ggg</div>
    );
}

export default App;