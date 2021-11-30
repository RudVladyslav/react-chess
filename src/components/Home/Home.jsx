import React, {useState} from 'react';
import styled from "styled-components";
import {auth, db} from "./firebase";
import {useHistory} from "react-router-dom";
import {initGame} from "./Game";

const HomeInnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const ButtonWrapper = styled.div`
  max-width: 300px;
  min-height: 300px;
  margin-top: 200px !important;
  margin: 30px;
  border-radius: 50px;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Button = styled.button`
  border-radius: 20px;
`
const Header = styled.h1`
  font-family: sans-serif;
  font-size: x-large;
  font-weight: bold;
  text-align: center;
  margin-top: 30px;
`

const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const {currentUser} = auth
    const history = useHistory()
    const newGameOption = [
        {label: 'Black pieces', value: 'b'},
        {label: 'White pieces', value: 'w'},
        {label: 'Random pieces', value: 'r'},
    ]

    const startOnlineGame = async (startingPiece) => {
        const member = {
            uid: currentUser.uid,
            piece: startingPiece === 'r' ? ['b', 'w'][Math.round(Math.random())] : startingPiece,
            name: localStorage.getItem('userName'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        }
        await db.collection('games').doc(game.gameId).set(game)
        history.push(`game/${game.gameId}`)
    }

    return (
        <>
            <Header>ChessGame</Header>
            <HomeInnerWrapper className={'columns'}>
                <ButtonWrapper className="column has-background-link">
                    <Button className="button is-primary" onClick={() => setShowModal(true)}>
                        Play Online
                    </Button>
                </ButtonWrapper>
                <div className={`modal ${showModal ? 'is-active' : ''}`}>
                    <div className="modal-background" onClick={() => setShowModal(false)}></div>
                    <div className="modal-content">
                        <div className="card">
                            <div className="card-content">
                                Please select the piece you want start
                            </div>
                            <footer className={'card-footer'}>
                                {newGameOption.map(({label, value}) =>
                                    <span className="card-footer-item"
                                          key={value}
                                          onClick={() => startOnlineGame(value)}>{label}</span>
                                )}
                            </footer>
                        </div>
                        <button className="modal-close is-large" onClick={() => setShowModal(false)} />
                    </div>
                </div>
            </HomeInnerWrapper>
        </>
    );
};

export default Home;